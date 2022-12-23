import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { MarketHistoryService } from './market-history.service';

describe('MarketHistoryService', () => {
  let service: MarketHistoryService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketHistoryService,
        {
          provide: HttpService,
          useValue : {}
        }
      ],
    }).compile();

    service = module.get<MarketHistoryService>(MarketHistoryService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(httpService).toBeDefined();
  });
});
