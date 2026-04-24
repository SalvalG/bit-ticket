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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ticket = exports.TicketStatus = void 0;
const typeorm_1 = require("typeorm");
const zone_entity_1 = require("../../zones/entities/zone.entity");
const order_entity_1 = require("../../orders/entities/order.entity");
var TicketStatus;
(function (TicketStatus) {
    TicketStatus["DISPONIBLE"] = "DISPONIBLE";
    TicketStatus["RESERVADO"] = "RESERVADO";
    TicketStatus["VENDIDO"] = "VENDIDO";
    TicketStatus["USADO"] = "USADO";
})(TicketStatus || (exports.TicketStatus = TicketStatus = {}));
let Ticket = class Ticket {
};
exports.Ticket = Ticket;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Ticket.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Ticket.prototype, "zona_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Ticket.prototype, "compra_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', unique: true }),
    __metadata("design:type", String)
], Ticket.prototype, "uuid_secreto", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TicketStatus,
        default: TicketStatus.DISPONIBLE,
    }),
    __metadata("design:type", String)
], Ticket.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Ticket.prototype, "reservado_hasta", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => zone_entity_1.Zone, (zone) => zone.boletos, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'zona_id' }),
    __metadata("design:type", zone_entity_1.Zone)
], Ticket.prototype, "zona", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_entity_1.Order, (order) => order.boletos, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'compra_id' }),
    __metadata("design:type", order_entity_1.Order)
], Ticket.prototype, "compra", void 0);
exports.Ticket = Ticket = __decorate([
    (0, typeorm_1.Entity)('tickets')
], Ticket);
//# sourceMappingURL=ticket.entity.js.map