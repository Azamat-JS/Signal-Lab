"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsService = void 0;
const common_1 = require("@nestjs/common");
const prom_client_1 = require("prom-client");
let MetricsService = class MetricsService {
    registry;
    scenarioRuns;
    scenarioErrors;
    scenarioDuration;
    constructor(registry) {
        this.registry = registry;
        this.scenarioRuns = new prom_client_1.Counter({
            name: 'scenario_runs_total',
            help: 'Total scenario runs',
            labelNames: ['type', 'status'],
            registers: [this.registry],
        });
        this.scenarioErrors = new prom_client_1.Counter({
            name: 'scenario_errors_total',
            help: 'Total scenario errors',
            labelNames: ['type'],
            registers: [this.registry],
        });
        this.scenarioDuration = new prom_client_1.Histogram({
            name: 'scenario_duration_sev',
            help: 'Scenario duration in seconds',
            labelNames: ['type'],
            buckets: [0.05, 0.1, 0.25, 0.5, 1, 2, 5],
            registers: [this.registry],
        });
    }
};
exports.MetricsService = MetricsService;
exports.MetricsService = MetricsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prom_client_1.Registry])
], MetricsService);
