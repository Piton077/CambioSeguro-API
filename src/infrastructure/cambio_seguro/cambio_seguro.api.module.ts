import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CambioSeguroAPIService } from './cambio_seguro.api';

@Module({
  imports: [HttpModule],
  providers: [CambioSeguroAPIService],
  exports: [CambioSeguroAPIService],
})
export class CambioSeguroAPIModule {}
