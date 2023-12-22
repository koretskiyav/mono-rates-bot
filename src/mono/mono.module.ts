import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { MonoService } from './mono.service';

@Module({
  imports: [HttpModule],
  providers: [MonoService],
  exports: [MonoService],
})
export class MonoModule {}
