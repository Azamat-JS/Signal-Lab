import * as Sentry from "@sentry/nestjs"

Sentry.init({
    dsn: "https://251b9d1cd0dbb523fe481b4ae7679c11@o4511193943965696.ingest.de.sentry.io/4511193946194000",
    sendDefaultPii: true,
});