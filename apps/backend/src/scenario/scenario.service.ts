import { Injectable, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Counter, Histogram, Registry } from 'prom-client';
import * as Sentry from '@sentry/node';
import { ScenarioType } from './type';

@Injectable()
export class ScenarioService {
    private readonly logger = new Logger(ScenarioService.name);

    private readonly scenarioCounter: Counter<string>;
    private readonly errorCounter: Counter<string>;
    private readonly durationHistogram: Histogram<string>;

    constructor(
        private readonly prisma: PrismaService,
        private readonly registry: Registry,
    ) {
        this.scenarioCounter = new Counter({
            name: 'scenario_runs_total',
            help: 'Total scenario executions',
            labelNames: ['type', 'status'],
            registers: [registry],
        });

        this.errorCounter = new Counter({
            name: 'scenario_errors_total',
            help: 'Total failed scenario executions',
            labelNames: ['type'],
            registers: [registry],
        });

        this.durationHistogram = new Histogram({
            name: 'scenario_duration_sec',
            help: 'Scenario execution duration',
            labelNames: ['type'],
            buckets: [0.05, 0.1, 0.25, 0.5, 1, 2, 5],
            registers: [registry],
        });
    }

    async runScenario(type: ScenarioType, name?: string) {
        const startedAt = Date.now();

        try {
            switch (type) {
                case 'success':
                    return await this.handleSuccess(name, startedAt);

                case 'validation_error':
                    return await this.handleValidationError(name, startedAt);

                case 'system_error':
                    return await this.handleSystemError(name, startedAt);

                case 'slow_request':
                    return await this.handleSlowRequest(name, startedAt);

                default:
                    throw new BadRequestException('Unknown scenario type');
            }
        } catch (error: any) {
            if (!(error instanceof BadRequestException)) {
                this.logger.error('Unhandled scenario failure', error.stack);
            }

            throw error;
        }
    }

    private async handleSuccess(name: string | undefined, startedAt: number) {
        await this.prisma.scenarioRun.create({
            data: {
                type: 'success',
                metadata: name ? { name } : {},
                status: 'SUCCESS',
            }
        })
        this.scenarioCounter.inc({ type: 'success', status: 'success' });

        const duration = Date.now() - startedAt;
        this.durationHistogram.observe({ type: 'success' }, duration / 1000);

        this.logger.log(
            JSON.stringify({
                level: 'info',
                scenario: 'success',
                message: 'Scenario completed successfully',
                duration: duration / 1000,
            }),
        );

        return {
            success: true,
            message: 'Success scenario completed',
        };
    }

    private async handleValidationError(name: string | undefined, startedAt: number) {
        await this.prisma.scenarioRun.create({
            data: {
                type: 'validation_error',
                metadata: name ? { name } : {},
                status: 'FAILED',
            },
        });

        this.errorCounter.inc({ type: 'validation_error' });

        const duration = Date.now() - startedAt;
        this.durationHistogram.observe({ type: 'validation_error' }, duration / 1000);

        Sentry.addBreadcrumb({
            category: 'validation',
            message: 'Validation error scenario triggered',
            level: 'warning',
        });

        this.logger.warn(
            JSON.stringify({
                level: 'warn',
                scenario: 'validation_error',
                message: 'Invalid input provided',
            }),
        );

        throw new BadRequestException('Validation failed');
    }

    private async handleSystemError(name: string | undefined, startedAt: number) {
        await this.prisma.scenarioRun.create({
            data: {
                type: 'system_error',
                metadata: name ? { name } : {},
                status: 'FAILED',
            },
        });

        this.errorCounter.inc({ type: 'system_error' });

        const duration = Date.now() - startedAt;
        this.durationHistogram.observe({ type: 'system_error' }, duration / 1000);

        try {
            throw new Error('Simulated system failure');
        } catch (error: any) {
            Sentry.captureException(error);

            this.logger.error(
                JSON.stringify({
                    level: 'error',
                    scenario: 'system_error',
                    message: 'Unhandled exception thrown',
                    error: error.message,
                }),
            );

            throw new InternalServerErrorException('System failure occurred');
        }
    }

    private async handleSlowRequest(name: string | undefined, startedAt: number) {
        const delay = Math.floor(Math.random() * 3000) + 2000;

        await new Promise((resolve) => setTimeout(resolve, delay));

        await this.prisma.scenarioRun.create({
            data: {
                type: 'slow_request',
                metadata: name ? { name } : {},
                status: 'SUCCESS',
            },
        });

        this.scenarioCounter.inc({ type: 'slow_request', status: 'success' });

        const duration = Date.now() - startedAt;
        this.durationHistogram.observe({ type: 'slow_request' }, duration / 1000);

        this.logger.warn(
            JSON.stringify({
                level: 'warn',
                scenario: 'slow_request',
                message: 'Slow request detected',
                duration: duration / 1000,
            }),
        );

        return {
            success: true,
            message: `Slow scenario finished in ${duration / 1000}sec`,
        };
    }
}