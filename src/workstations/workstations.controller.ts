import { Controller, Get } from '@nestjs/common';
import { WorkstationsService } from './workstations.service';

@Controller('workstations')
export class WorkstationsController {
  constructor(private readonly workstationsService: WorkstationsService) {}

  @Get()
  async findAll() {
    return await this.workstationsService.findAll();
  }
}
