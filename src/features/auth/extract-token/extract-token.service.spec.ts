import { Test, TestingModule } from '@nestjs/testing';
import { ExtractJwtTokenFromHeaderService } from './extract-token.service';

describe('ExtractTokenService', () => {
  let service: ExtractJwtTokenFromHeaderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExtractJwtTokenFromHeaderService],
    }).compile();

    service = module.get<ExtractJwtTokenFromHeaderService>(ExtractJwtTokenFromHeaderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
