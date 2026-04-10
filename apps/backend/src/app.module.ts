import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ScenarioModule } from './scenario/scenario.module';
import { MetricsModule } from './metrics/metrics.module';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';


@Module({
  imports: [PrismaModule, ScenarioModule, MetricsModule, SentryModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [{
    provide: APP_FILTER,
    useClass: SentryGlobalFilter,
  }],
})
export class AppModule { }
