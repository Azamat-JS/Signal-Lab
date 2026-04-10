import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import "./instrument";
import { AllExceptionsFilter } from './filters/global';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(process.env.PORT ?? 3001, () => { console.log('server is running') });
}
bootstrap();
