import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { ValidateTicketDto } from './dto/validate-ticket.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  /** UC4: GET /api/tickets/:id/download — Descargar boleto digital */
  @Get(':id/download')
  @UseGuards(JwtAuthGuard)
  async download(@Param('id') id: string, @Request() req: any) {
    return this.ticketsService.getTicketForDownload(id, req.user.id);
  }

  /** UC10: POST /api/tickets/validate — Validar boleto en puerta (Staff) */
  @Post('validate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STAFF, UserRole.ADMIN)
  async validate(@Body() validateDto: ValidateTicketDto) {
    return this.ticketsService.validateTicket(validateDto.uuid_secreto);
  }
}
