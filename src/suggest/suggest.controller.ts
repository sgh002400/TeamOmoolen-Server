import { DefaultValuePipe, Get, Query } from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Products } from '../entities/Products';
import { SuggestService } from './suggest.service';

@Controller('suggest')
export class SuggestController {
  constructor(private readonly suggestService: SuggestService) {}

  @Get('')
  async index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Products>> {
    limit = limit > 100 ? 100 : limit;
    return this.suggestService.paginate({
      page,
      limit,
      route: 'https://omoolen.loca.lt',
    });
  }
}
