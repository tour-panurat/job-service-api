import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';

const PORT = parseInt(process.env.PORT, 10) || 3000;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(compression());

  await app.listen(PORT, () => {
    console.log(`🚀 Application running at port ${PORT}`);
  });
}
bootstrap();
