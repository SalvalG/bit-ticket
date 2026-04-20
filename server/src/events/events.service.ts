import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event, EventStatus } from './entities/event.entity';
import { Zone } from '../zones/entities/zone.entity';
import { Ticket, TicketStatus } from '../tickets/entities/ticket.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
    @InjectRepository(Zone)
    private readonly zonesRepository: Repository<Zone>,
    @InjectRepository(Ticket)
    private readonly ticketsRepository: Repository<Ticket>,
  ) {}

  /**
   * UC5: Visualización de eventos disponibles.
   * Retorna todos los eventos activos con sus zonas.
   */
  async findAll(filters?: { fecha?: string; ubicacion?: string; nombre?: string }) {
    const query = this.eventsRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.zonas', 'zone')
      .where('event.estado = :estado', { estado: EventStatus.ACTIVO });

    if (filters?.fecha) {
      query.andWhere('DATE(event.fecha) = :fecha', { fecha: filters.fecha });
    }

    if (filters?.ubicacion) {
      query.andWhere('event.ubicacion LIKE :ubicacion', {
        ubicacion: `%${filters.ubicacion}%`,
      });
    }

    if (filters?.nombre) {
      query.andWhere('event.nombre LIKE :nombre', {
        nombre: `%${filters.nombre}%`,
      });
    }

    query.orderBy('event.fecha', 'ASC');

    return query.getMany();
  }

  /**
   * UC5: Detalle completo de un evento específico con disponibilidad de zonas.
   */
  async findOne(id: string): Promise<Event> {
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['zonas'],
    });

    if (!event) {
      throw new NotFoundException('Evento no encontrado.');
    }

    return event;
  }

  /**
   * UC6: Crear un nuevo evento con sus zonas.
   * Genera boletos automáticamente para cada zona según su capacidad.
   */
  async create(createEventDto: CreateEventDto): Promise<Event> {
    const { zonas, ...eventData } = createEventDto;

    // Validar que la fecha sea futura
    if (new Date(eventData.fecha) <= new Date()) {
      throw new BadRequestException('La fecha del evento debe ser una fecha futura.');
    }

    // Crear el evento
    const event = this.eventsRepository.create({
      ...eventData,
      estado: EventStatus.ACTIVO,
    });
    const savedEvent = await this.eventsRepository.save(event);

    // Crear zonas y generar boletos para cada una
    for (const zonaDto of zonas) {
      const zone = this.zonesRepository.create({
        ...zonaDto,
        evento_id: savedEvent.id,
        asientos_disponibles: zonaDto.capacidad_total,
      });
      const savedZone = await this.zonesRepository.save(zone);

      // Generar boletos individuales para la zona
      const tickets: Partial<Ticket>[] = [];
      for (let i = 0; i < zonaDto.capacidad_total; i++) {
        tickets.push({
          zona_id: savedZone.id,
          uuid_secreto: uuidv4(),
          estado: TicketStatus.DISPONIBLE,
        });
      }
      await this.ticketsRepository.save(tickets);
    }

    // Retornar el evento con zonas cargadas
    return this.findOne(savedEvent.id);
  }

  /**
   * UC6: Modificar evento existente.
   * No permite cambios estructurales si hay boletos vendidos.
   */
  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);

    // Verificar si el evento está cancelado
    if (event.estado === EventStatus.CANCELADO) {
      throw new BadRequestException('No se puede modificar un evento cancelado.');
    }

    // Aplicar las actualizaciones permitidas
    Object.assign(event, updateEventDto);
    await this.eventsRepository.save(event);

    return this.findOne(id);
  }

  /**
   * UC9: Cancelar evento.
   * Cambia el estado a CANCELADO. El proceso de reembolso se maneja por OrdersService.
   */
  async cancel(id: string, motivo: string): Promise<{ event: Event; ordenes_afectadas: number }> {
    const event = await this.findOne(id);

    if (event.estado === EventStatus.CANCELADO) {
      throw new BadRequestException('El evento ya está cancelado.');
    }

    // Cambiar estado del evento
    event.estado = EventStatus.CANCELADO;
    await this.eventsRepository.save(event);

    // Contar órdenes afectadas (boletos vendidos de este evento)
    const ticketsVendidos = await this.ticketsRepository
      .createQueryBuilder('ticket')
      .innerJoin('ticket.zona', 'zone')
      .where('zone.evento_id = :eventoId', { eventoId: id })
      .andWhere('ticket.estado = :estado', { estado: TicketStatus.VENDIDO })
      .getCount();

    return {
      event,
      ordenes_afectadas: ticketsVendidos,
    };
  }
}
