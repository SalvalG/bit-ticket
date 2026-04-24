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
exports.TicketsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ticket_entity_1 = require("./entities/ticket.entity");
let TicketsService = class TicketsService {
    constructor(ticketsRepository) {
        this.ticketsRepository = ticketsRepository;
    }
    async getTicketForDownload(ticketId, userId) {
        const ticket = await this.ticketsRepository.findOne({
            where: { id: ticketId },
            relations: ['zona', 'zona.evento', 'compra'],
        });
        if (!ticket) {
            throw new common_1.NotFoundException('Boleto no encontrado.');
        }
        if (ticket.compra?.usuario_id !== userId) {
            throw new common_1.BadRequestException('No tienes acceso a este boleto.');
        }
        if (ticket.estado !== ticket_entity_1.TicketStatus.VENDIDO && ticket.estado !== ticket_entity_1.TicketStatus.USADO) {
            throw new common_1.BadRequestException('El boleto no está disponible para descarga.');
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
    async validateTicket(uuidSecreto) {
        const ticket = await this.ticketsRepository.findOne({
            where: { uuid_secreto: uuidSecreto },
            relations: ['zona', 'zona.evento'],
        });
        if (!ticket) {
            return { valido: false, mensaje: 'BOLETO INVÁLIDO', color: 'red' };
        }
        if (ticket.estado === ticket_entity_1.TicketStatus.USADO) {
            return {
                valido: false,
                mensaje: 'ALERTA: BOLETO DUPLICADO/YA INGRESADO',
                color: 'red',
                evento: ticket.zona?.evento?.nombre,
            };
        }
        if (ticket.estado !== ticket_entity_1.TicketStatus.VENDIDO) {
            return { valido: false, mensaje: 'BOLETO INVÁLIDO', color: 'red' };
        }
        ticket.estado = ticket_entity_1.TicketStatus.USADO;
        await this.ticketsRepository.save(ticket);
        return {
            valido: true,
            mensaje: 'ACCESO CONCEDIDO',
            color: 'green',
            evento: ticket.zona?.evento?.nombre,
            zona: ticket.zona?.nombre,
        };
    }
};
exports.TicketsService = TicketsService;
exports.TicketsService = TicketsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ticket_entity_1.Ticket)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TicketsService);
//# sourceMappingURL=tickets.service.js.map