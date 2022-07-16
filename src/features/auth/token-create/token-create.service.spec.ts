import { Test, TestingModule } from '@nestjs/testing';
import { TokenCreateService } from './token-create.service';

describe('TokenCreateService', () => {
  let service: TokenCreateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenCreateService],
    }).compile();

    service = module.get<TokenCreateService>(TokenCreateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
