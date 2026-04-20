import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Zone } from './entities/zone.entity';

@Injectable()
export class ZonesService {
  constructor(
    @InjectRepository(Zone)
    private readonly zonesRepository: Repository<Zone>,
  ) {}

  async findByEventId(eventoId: string): Promise<Zone[]> {
    return this.zonesRepository.find({
      where: { evento_id: eventoId },
    });
  }

  async findById(id: string): Promise<Zone | null> {
    return this.zonesRepository.findOne({ where: { id } });
  }

  /**
   * Decrementa asientos disponibles de una zona (para reservas).
   * Usa query builder para operación atómica y prevenir race conditions.
   */
  async decrementAvailableSeats(zoneId: string, cantidad: number): Promise<boolean> {
    const result = await this.zonesRepository
      .createQueryBuilder()
      .update(Zone)
      .set({
        asientos_disponibles: () => `asientos_disponibles - ${cantidad}`,
      })
      .where('id = :id', { id: zoneId })
      .andWhere('asientos_disponibles >= :cantidad', { cantidad })
      .execute();

    return (result.affected ?? 0) > 0;
  }

  /**
   * Incrementa asientos disponibles (cuando se liberan reservas expiradas).
   */
  async incrementAvailableSeats(zoneId: string, cantidad: number): Promise<void> {
    await this.zonesRepository
      .createQueryBuilder()
      .update(Zone)
      .set({
        asientos_disponibles: () => `asientos_disponibles + ${cantidad}`,
      })
      .where('id = :id', { id: zoneId })
      .execute();
  }
}
