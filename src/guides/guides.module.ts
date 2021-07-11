import { Module } from '@nestjs/common';
import { GuidesService } from './guides.service';
import { GuidesController } from './guides.controller';

@Module({
  controllers: [GuidesController],
  providers: [GuidesService]
})
export class GuidesModule {}
