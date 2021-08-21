import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MainController } from './main/app.controller';
import { MainService } from './main/app.service';
import { UsersController } from './user/app.controller';
import { UsersService } from './user/app.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
    }),
  ],
  controllers: [MainController, UsersController],
  providers: [MainService, UsersService],
})
export class AppModule {}
