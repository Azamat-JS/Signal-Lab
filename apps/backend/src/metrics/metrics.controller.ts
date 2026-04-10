import { Controller, Get, Header } from '@nestjs/common';
import { Registry } from 'prom-client';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly registry: Registry) { }

  @Get()
  @Header('Content-Type', 'text/plain')
  async getMetrics() {
    return this.registry.metrics();
  }
}