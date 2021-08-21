import { Test, TestingModule } from '@nestjs/testing';
import { MainController } from './app.controller';
import { MainService } from './app.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [MainController],
      providers: [MainService],
    }).compile();
  });

  describe('News', () => {
    it('should return "Hello World!"', () => {
      const mainController = app.get<MainController>(MainController);
      expect(mainController.News()).toBe('Hello World!');
    });
  });
});
