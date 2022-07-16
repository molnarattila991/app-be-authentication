import { Test, TestingModule } from '@nestjs/testing';
import { TokenValidationCheckerService } from './token-validation-checker.service';

describe('TokenValidationCheckerService', () => {
  let service: TokenValidationCheckerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenValidationCheckerService],
    }).compile();

    service = module.get<TokenValidationCheckerService>(TokenValidationCheckerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
