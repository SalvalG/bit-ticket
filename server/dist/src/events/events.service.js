"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const event_entity_1 = require("./entities/event.entity");
const zone_entity_1 = require("../zones/entities/zone.entity");
const ticket_entity_1 = require("../tickets/entities/ticket.entity");
const uuid_1 = require("uuid");
let EventsService = class EventsService {
    constructor(eventsRepository, zonesRepository, ticketsRepository) {
        this.eventsRepository = eventsRepository;
        this.zonesRepository = zonesRepository;
        this.ticketsRepository = ticketsRepository;
    }
    async findAll(filters) {
        const query = this.eventsRepository
            .createQueryBuilder('event')
            .leftJoinAndSelect('event.zonas', 'zone')
            .where('event.estado = :estado', { estado: event_entity_1.EventStatus.ACTIVO });
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
    async findOne(id) {
        const event = await this.eventsRepository.findOne({
            where: { id },
            relations: ['zonas'],
        });
        if (!event) {
            throw new common_1.NotFoundException('Evento no encontrado.');
        }
        return event;
    }
    async create(createEventDto) {
        const { zonas, ...eventData } = createEventDto;
        const eventDate = new Date(eventData.fecha);
        if (eventDate <= new Date()) {
            throw new common_1.BadRequestException('La fecha del evento debe ser una fecha futura.');
        }
        const event = this.eventsRepository.create({
            ...eventData,
            fecha: eventDate,
            estado: event_entity_1.EventStatus.ACTIVO,
        });
        const savedEvent = await this.eventsRepository.save(event);
        for (const zonaDto of zonas) {
            const zone = this.zonesRepository.create({
                ...zonaDto,
                evento_id: savedEvent.id,
                asientos_disponibles: zonaDto.capacidad_total,
            });
            const savedZone = await this.zonesRepository.save(zone);
            const tickets = [];
            for (let i = 0; i < zonaDto.capacidad_total; i++) {
                tickets.push({
                    zona_id: savedZone.id,
                    uuid_secreto: (0, uuid_1.v4)(),
                    estado: ticket_entity_1.TicketStatus.DISPONIBLE,
                });
            }
            await this.ticketsRepository.save(tickets);
        }
        return this.findOne(savedEvent.id);
    }
    async update(id, updateEventDto) {
        const event = await this.findOne(id);
        if (event.estado === event_entity_1.EventStatus.CANCELADO) {
            throw new common_1.BadRequestException('No se puede modificar un evento cancelado.');
        }
        Object.assign(event, updateEventDto);
        await this.eventsRepository.save(event);
        return this.findOne(id);
    }
    async cancel(id, motivo) {
        const event = await this.findOne(id);
        if (event.estado === event_entity_1.EventStatus.CANCELADO) {
            throw new common_1.BadRequestException('El evento ya está cancelado.');
        }
        event.estado = event_entity_1.EventStatus.CANCELADO;
        await this.eventsRepository.save(event);
        const ticketsVendidos = await this.ticketsRepository
            .createQueryBuilder('ticket')
            .innerJoin('ticket.zona', 'zone')
            .where('zone.evento_id = :eventoId', { eventoId: id })
            .andWhere('ticket.estado = :estado', { estado: ticket_entity_1.TicketStatus.VENDIDO })
            .getCount();
        return {
            event,
            ordenes_afectadas: ticketsVendidos,
        };
    }
    async remove(id) {
        const event = await this.findOne(id);
        const zonas = event.zonas || [];
        for (const zona of zonas) {
            await this.ticketsRepository.delete({ zona_id: zona.id });
        }
        await this.zonesRepository.delete({ evento_id: id });
        await this.eventsRepository.delete(id);
        return { message: `Evento "${event.nombre}" eliminado correctamente.` };
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(event_entity_1.Event)),
    __param(1, (0, typeorm_1.InjectRepository)(zone_entity_1.Zone)),
    __param(2, (0, typeorm_1.InjectRepository)(ticket_entity_1.Ticket)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], EventsService);
//# sourceMappingURL=events.service.js.map