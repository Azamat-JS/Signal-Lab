"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ScenarioService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScenarioService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const prom_client_1 = require("prom-client");
const Sentry = __importStar(require("@sentry/node"));
let ScenarioService = ScenarioService_1 = class ScenarioService {
    prisma;
    registry;
    logger = new common_1.Logger(ScenarioService_1.name);
    scenarioCounter;
    errorCounter;
    durationHistogram;
    constructor(prisma, registry) {
        this.prisma = prisma;
        this.registry = registry;
        this.scenarioCounter = new prom_client_1.Counter({
            name: 'scenario_runs_total',
            help: 'Total scenario executions',
            labelNames: ['type', 'status'],
            registers: [registry],
        });
        this.errorCounter = new prom_client_1.Counter({
            name: 'scenario_errors_total',
            help: 'Total failed scenario executions',
            labelNames: ['type'],
            registers: [registry],
        });
        this.durationHistogram = new prom_client_1.Histogram({
            name: 'scenario_duration_sec',
            help: 'Scenario execution duration',
            labelNames: ['type'],
            buckets: [50, 100, 250, 500, 1000, 2000, 5000],
            registers: [registry],
        });
    }
    async runScenario(type, name) {
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
                    throw new common_1.BadRequestException('Unknown scenario type');
            }
        }
        catch (error) {
            if (!(error instanceof common_1.BadRequestException)) {
                this.logger.error('Unhandled scenario failure', error.stack);
            }
            throw error;
        }
    }
    async handleSuccess(name, startedAt) {
        await this.prisma.scenarioRun.create({
            data: {
                type: 'success',
                metadata: name ? { name } : {},
                status: 'SUCCESS',
            }
        });
        this.scenarioCounter.inc({ type: 'success', status: 'success' });
        const duration = Date.now() - startedAt;
        this.durationHistogram.observe({ type: 'success' }, duration / 1000);
        this.logger.log(JSON.stringify({
            level: 'info',
            scenario: 'success',
            message: 'Scenario completed successfully',
            duration: duration / 1000,
        }));
        return {
            success: true,
            message: 'Success scenario completed',
        };
    }
    async handleValidationError(name, startedAt) {
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
        this.logger.warn(JSON.stringify({
            level: 'warn',
            scenario: 'validation_error',
            message: 'Invalid input provided',
        }));
        throw new common_1.BadRequestException('Validation failed');
    }
    async handleSystemError(name, startedAt) {
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
        }
        catch (error) {
            Sentry.captureException(error);
            this.logger.error(JSON.stringify({
                level: 'error',
                scenario: 'system_error',
                message: 'Unhandled exception thrown',
                error: error.message,
            }));
            throw new common_1.InternalServerErrorException('System failure occurred');
        }
    }
    async handleSlowRequest(name, startedAt) {
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
        this.logger.warn(JSON.stringify({
            level: 'warn',
            scenario: 'slow_request',
            message: 'Slow request detected',
            duration: duration / 1000,
        }));
        return {
            success: true,
            message: `Slow scenario finished in ${duration / 1000}sec`,
        };
    }
};
exports.ScenarioService = ScenarioService;
exports.ScenarioService = ScenarioService = ScenarioService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        prom_client_1.Registry])
], ScenarioService);
