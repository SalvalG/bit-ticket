"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const event_entity_1 = require("./src/events/entities/event.entity");
const zone_entity_1 = require("./src/zones/entities/zone.entity");
const ticket_entity_1 = require("./src/tickets/entities/ticket.entity");
const order_entity_1 = require("./src/orders/entities/order.entity");
const payment_entity_1 = require("./src/payments/entities/payment.entity");
const user_entity_1 = require("./src/users/entities/user.entity");
const coupon_entity_1 = require("./src/coupons/entities/coupon.entity");
const uuid_1 = require("uuid");
async function test() {
    const dataSource = new typeorm_1.DataSource({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'root',
        database: 'bit_ticket',
        entities: [event_entity_1.Event, zone_entity_1.Zone, ticket_entity_1.Ticket, order_entity_1.Order, payment_entity_1.Payment, user_entity_1.User, coupon_entity_1.Coupon],
        synchronize: false,
    });
    await dataSource.initialize();
    console.log('Data Source has been initialized!');
    try {
        const eventsRepo = dataSource.getRepository(event_entity_1.Event);
        const zonesRepo = dataSource.getRepository(zone_entity_1.Zone);
        const ticketsRepo = dataSource.getRepository(ticket_entity_1.Ticket);
        const event = eventsRepo.create({
            nombre: 'Test Event',
            descripcion: 'Test Desc',
            fecha: new Date('2026-04-20T20:10:20.000Z'),
            ubicacion: 'Test Loc',
            estado: event_entity_1.EventStatus.ACTIVO,
        });
        const savedEvent = await eventsRepo.save(event);
        console.log('Event saved:', savedEvent.id);
        const zone = zonesRepo.create({
            evento_id: savedEvent.id,
            nombre: 'Z1',
            precio: 100,
            capacidad_total: 10,
            asientos_disponibles: 10,
        });
        const savedZone = await zonesRepo.save(zone);
        console.log('Zone saved:', savedZone.id);
        const tickets = [];
        for (let i = 0; i < 10; i++) {
            tickets.push({
                zona_id: savedZone.id,
                uuid_secreto: (0, uuid_1.v4)(),
                estado: ticket_entity_1.TicketStatus.DISPONIBLE,
            });
        }
        await ticketsRepo.save(tickets);
        console.log('Tickets saved');
    }
    catch (err) {
        console.error('ERROR OCCURRED:', err);
    }
    finally {
        await dataSource.destroy();
    }
}
test();
//# sourceMappingURL=test-db.js.map