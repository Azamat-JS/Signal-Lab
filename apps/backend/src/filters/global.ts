import { Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { SentryExceptionCaptured } from '@sentry/nestjs';
import type { ArgumentsHost } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    @SentryExceptionCaptured()
    catch(exception: any, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        let status = 500;
        let message = 'Internal server error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();
            message = typeof res === 'string' ? res : (res as any).message;
        }

        response.status(status).json({
            success: false,
            result: null,
            error: {
                code: status,
                message,
            },
        });
    }
}