import { Test, TestingModule } from '@nestjs/testing';
import { ParquetsService } from './parquets.service';

describe('ParquetsService', () => {
  let service: ParquetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParquetsService],
    }).compile();

    service = module.get<ParquetsService>(ParquetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
