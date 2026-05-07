import { Test, TestingModule } from '@nestjs/testing';
import { ParquetsController } from './parquets.controller';
import { ParquetsService } from './parquets.service';

describe('ParquetsController', () => {
  let controller: ParquetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParquetsController],
      providers: [ParquetsService],
    }).compile();

    controller = module.get<ParquetsController>(ParquetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
