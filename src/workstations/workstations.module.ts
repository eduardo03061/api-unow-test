import { Module } from '@nestjs/common';
import { WorkstationsService } from './workstations.service';
import { WorkstationsController } from './workstations.controller';
import { ProvidersModule } from 'src/providers/providers.module';

@Module({
  imports: [
    ProvidersModule
  ],
  controllers: [WorkstationsController],
  providers: [WorkstationsService],
})
export class WorkstationsModule {}
