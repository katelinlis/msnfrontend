import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { ClusterService } from './app-cluster';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setBaseViewsDir(join(__dirname, '../views'));
  app.setViewEngine('pug');
  app.use(cookieParser());
  await app.listen(3055);
}

const cluster = new ClusterService();

cluster.register(3, bootstrap);
