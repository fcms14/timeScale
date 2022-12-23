import { PartialType } from '@nestjs/swagger';
import { CreateMarketHistoryDto } from './create-market-history.dto';

export class UpdateMarketHistoryDto extends PartialType(CreateMarketHistoryDto) {}
