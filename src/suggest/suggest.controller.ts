import { Controller, Get } from '@nestjs/common';
import { SuggestService } from './suggest.service';
import { User } from 'src/common/decorators/user.decorator';
import { UseGuards } from '@nestjs/common';
import AuthGuard from 'src/middlewares/auth.middleware';
import { Query } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ObjectId = require('mongodb').ObjectID;

@Controller('suggest')
export class SuggestController {
  constructor(private readonly suggestService: SuggestService) {}

  @Get()
  @UseGuards(new AuthGuard())
  async findSuggestProduct(@User() user) {
    const userId = ObjectId(user.userId);
    return await this.suggestService.findSuggestProduct(userId);
  }

  @Get('foryou')
  @UseGuards(new AuthGuard())
  async findSuggestProductForYou(@User() user, @Query() query) {
    const userId = ObjectId(user.userId);
    return await this.suggestService.findSuggestProductForYou(userId, query.page, query.sort, query.order);
  }

  @Get('situation')
  @UseGuards(new AuthGuard())
  async findSuggestProductForSituation(@User() user, @Query() query) {
    const userId = ObjectId(user.userId);
    return await this.suggestService.findSuggestProductForSituation(userId, query.page, query.sort, query.order);
  }

  //TODO: 정렬 구현 완료. 기본적으로는 쿼리스트링 없이 요청. 하지만 정렬을 선택한 경우에는 sort와 order가 필요.
  @Get('new')
  async findSuggestProductForNew(@Query() query) {
    return await this.suggestService.findSuggestProductForNew(query.page, query.sort, query.order);
  }

  @Get('season')
  async findSuggestProductForSeason(@Query() query) {
    return await this.suggestService.findSuggestProductForSeason(query.page, query.sort, query.order);
  }
}
