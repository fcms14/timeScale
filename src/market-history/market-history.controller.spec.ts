import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { MarketHistoryController } from './market-history.controller';
import { MarketHistoryService } from './market-history.service';

describe('MarketHistoryController', () => {
  let controller: MarketHistoryController;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarketHistoryController],
      providers: [
        MarketHistoryService,
        {
          provide: HttpService,
          useValue : {}
        }
      ],
    }).compile();

    controller = module.get<MarketHistoryController>(MarketHistoryController);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(httpService).toBeDefined();
  });
});
