import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket, TicketStatus } from './entities/ticket.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketsRepository: Repository<Ticket>,
  ) {}

  /**
   * UC4: Obtener boleto para descarga (con datos para generar QR).
   */
  async getTicketForDownload(ticketId: string, userId: string) {
    const ticket = await this.ticketsRepository.findOne({
      where: { id: ticketId },
      relations: ['zona', 'zona.evento', 'compra'],
    });

    if (!ticket) {
      throw new NotFoundException('Boleto no encontrado.');
    }

    if (ticket.compra?.usuario_id !== userId) {
      throw new BadRequestException('No tienes acceso a este boleto.');
    }

    if (ticket.estado !== TicketStatus.VENDIDO && ticket.estado !== TicketStatus.USADO) {
      throw new BadRequestException('El boleto no está disponible para descarga.');
    }

    return {
      id: ticket.id,
      uuid_secreto: ticket.uuid_secreto,
      estado: ticket.estado,
      zona: {
        nombre: ticket.zona.nombre,
        precio: ticket.zona.precio,
      },
      evento: {
        nombre: ticket.zona.evento.nombre,
        fecha: ticket.zona.evento.fecha,
        ubicacion: ticket.zona.evento.ubicacion,
      },
    };
  }

  /**
   * UC10: Validar boleto en puerta (escaneo QR).
   */
  async validateTicket(uuidSecreto: string) {
    const ticket = await this.ticketsRepository.findOne({
      where: { uuid_secreto: uuidSecreto },
      relations: ['zona', 'zona.evento'],
    });

    if (!ticket) {
      return { valido: false, mensaje: 'BOLETO INVÁLIDO', color: 'red' };
    }

    if (ticket.estado === TicketStatus.USADO) {
      return {
        valido: false,
        mensaje: 'ALERTA: BOLETO DUPLICADO/YA INGRESADO',
        color: 'red',
        evento: ticket.zona?.evento?.nombre,
      };
    }

    if (ticket.estado !== TicketStatus.VENDIDO) {
      return { valido: false, mensaje: 'BOLETO INVÁLIDO', color: 'red' };
    }

    // Marcar como usado
    ticket.estado = TicketStatus.USADO;
    await this.ticketsRepository.save(ticket);

    return {
      valido: true,
      mensaje: 'ACCESO CONCEDIDO',
      color: 'green',
      evento: ticket.zona?.evento?.nombre,
      zona: ticket.zona?.nombre,
    };
  }
}
