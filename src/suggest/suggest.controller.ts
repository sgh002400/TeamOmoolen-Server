import { Controller, Get, Res } from '@nestjs/common';
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
  async findSuggestProduct(@User() user, @Res() res) {
    const userId = ObjectId(user.userId);
    const response = await this.suggestService.findSuggestProduct(userId);

    res.status(200).send({
      status: 200,
      message: '발견탭 조회 성공',
      data: response,
    });
  }

  @Get('foryou')
  @UseGuards(new AuthGuard())
  async findSuggestProductForYou(@Res() res, @User() user, @Query() query) {
    const userId = ObjectId(user.userId);
    const response = await this.suggestService.findSuggestProductForYou(userId, query.page, query.sort, query.order);

    res.status(200).send({
      status: 200,
      message: '발견탭(For you) 페이징 조회 성공',
      data: response,
    });
  }

  @Get('situation')
  @UseGuards(new AuthGuard())
  async findSuggestProductForSituation(@Res() res, @User() user, @Query() query) {
    const userId = ObjectId(user.userId);
    const response = await this.suggestService.findSuggestProductForSituation(userId, query.page, query.sort, query.order);

    res.status(200).send({
      status: 200,
      message: '발견탭(상황) 페이징 조회 성공',
      data: response,
    });
  }

  //TODO: 정렬 구현 완료. 기본적으로는 쿼리스트링 없이 요청. 하지만 정렬을 선택한 경우에는 sort와 order가 필요.
  @Get('new')
  async findSuggestProductForNew(@Res() res, @Query() query) {
    const response = await this.suggestService.findSuggestProductForNew(query.page, query.sort, query.order);

    res.status(200).send({
      status: 200,
      message: '발견탭(신제품) 페이징 조회 성공',
      data: response,
    });
  }

  @Get('season')
  async findSuggestProductForSeason(@Res() res, @Query() query) {
    const response = await this.suggestService.findSuggestProductForSeason(query.page, query.sort, query.order);

    res.status(200).send({
      status: 200,
      message: '발견탭(계절) 페이징 조회 성공',
      data: response,
    });
  }
}
