import { DataSource } from 'typeorm';
import { Event, EventStatus } from './src/events/entities/event.entity';
import { Zone } from './src/zones/entities/zone.entity';
import { Ticket, TicketStatus } from './src/tickets/entities/ticket.entity';
import { Order } from './src/orders/entities/order.entity';
import { Payment } from './src/payments/entities/payment.entity';
import { User } from './src/users/entities/user.entity';
import { Coupon } from './src/coupons/entities/coupon.entity';
import { v4 as uuidv4 } from 'uuid';

async function test() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'bit_ticket',
    entities: [Event, Zone, Ticket, Order, Payment, User, Coupon],
    synchronize: false,
  });

  await dataSource.initialize();
  console.log('Data Source has been initialized!');

  try {
    const eventsRepo = dataSource.getRepository(Event);
    const zonesRepo = dataSource.getRepository(Zone);
    const ticketsRepo = dataSource.getRepository(Ticket);

    const event = eventsRepo.create({
      nombre: 'Test Event',
      descripcion: 'Test Desc',
      fecha: new Date('2026-04-20T20:10:20.000Z'),
      ubicacion: 'Test Loc',
      estado: EventStatus.ACTIVO,
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
        uuid_secreto: uuidv4(),
        estado: TicketStatus.DISPONIBLE,
      });
    }
    await ticketsRepo.save(tickets);
    console.log('Tickets saved');
  } catch (err) {
    console.error('ERROR OCCURRED:', err);
  } finally {
    await dataSource.destroy();
  }
}

test();
