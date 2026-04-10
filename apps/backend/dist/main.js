"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
require("./instrument");
const global_1 = require("./filters/global");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalFilters(new global_1.AllExceptionsFilter());
    await app.listen(process.env.PORT ?? 3001, () => { console.log('server is running'); });
}
bootstrap();
