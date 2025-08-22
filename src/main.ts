import { ServerApplication } from './server';

async function bootstrap() {
  const port = Number(process.env.PORT) || 3000;
  const server = new ServerApplication({ port });
  await server.start();
}
void bootstrap();
