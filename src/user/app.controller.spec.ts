import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './app.controller';
import { UsersService } from './app.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();
  });

  describe('News', () => {
    it('should return "Hello World!"', () => {
      const usersController = app.get<UsersController>(UsersController);
      expect(usersController.News()).toBe('Hello World!');
    });
  });
});
