import { Injectable } from '@nestjs/common';
import { Counter, Histogram, Registry } from 'prom-client';


@Injectable()
export class MetricsService {
    readonly scenarioRuns: Counter<string>;
    readonly scenarioErrors: Counter<string>;
    readonly scenarioDuration: Histogram<string>;

    constructor(private readonly registry: Registry) {
        this.scenarioRuns = new Counter({
            name: 'scenario_runs_total',
            help: 'Total scenario runs',
            labelNames: ['type', 'status'],
            registers: [this.registry],
        });

        this.scenarioErrors = new Counter({
            name: 'scenario_errors_total',
            help: 'Total scenario errors',
            labelNames: ['type'],
            registers: [this.registry],
        });

        this.scenarioDuration = new Histogram({
            name: 'scenario_run_duration_seconds',
            help: 'Scenario duration in seconds',
            labelNames: ['type'],
            buckets: [0.05, 0.1, 0.25, 0.5, 1, 2, 5],
            registers: [this.registry],
        });
    }
}
