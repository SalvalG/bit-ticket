import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  /** UC5: GET /api/events — Listar eventos (público) */
  @Get()
  async findAll(
    @Query('fecha') fecha?: string,
    @Query('ubicacion') ubicacion?: string,
    @Query('nombre') nombre?: string,
  ) {
    return this.eventsService.findAll({ fecha, ubicacion, nombre });
  }

  /** UC5: GET /api/events/:id — Detalle de evento (público) */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  /** UC6: POST /api/events — Crear evento (Admin) */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  /** UC6: PUT /api/events/:id — Modificar evento (Admin) */
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  /** UC9: POST /api/events/:id/cancel — Cancelar evento (Admin) */
  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async cancel(@Param('id') id: string, @Body('motivo') motivo: string) {
    return this.eventsService.cancel(id, motivo);
  }
}
