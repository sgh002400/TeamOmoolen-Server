import { Controller, Get, Post, Query, Body, Res, UseGuards, HttpException } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './common/decorators/user.decorator';
import { FilterConditionDto } from './common/dto/filter.condition.dto';
import { SearchQueryStringDto } from './common/dto/search.querystring.dto';
import AuthGuard from './middlewares/auth.middleware';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ObjectId = require('mongodb').ObjectID;

@Controller('/api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/home')
  @UseGuards(new AuthGuard())
  async getHomeData(@User() user, @Res() res) {
    try {
      const userId = ObjectId(user.userId);
      const response = await this.appService.findHomeData(userId);
      res.status(200).send({
        status: 200,
        success: true,
        message: '홈 화면 데이터 조회 완료',
        data: response,
      });
    } catch (err) {
      console.log(err);
      throw new HttpException('홈 화면 데이터 조회 실패', 500);
    }
  }

  @Get('/searchWindow')
  async getPopularItem(@Res() res) {
    try {
      const response = await this.appService.findPopularItem();
      res.status(200).send({
        status: 200,
        success: true,
        message: '인기 검색어 조회 성공',
        data: response,
      });
    } catch (err) {
      console.log(err);
      throw new HttpException('인기 검색어 조회 실패', 500);
    }
  }

  @Get('/searchProduct')
  async getSearchProduct(@Query() query, @Res() res) {
    try {
      const response = await this.appService.getSearchProduct(query.keyword, query.page, query.sort, query.order);
      res.status(200).send({
        status: 200,
        success: true,
        message: '키워드 검색 성공',
        data: response,
      });
    } catch (err) {
      console.log(err);
      throw new HttpException('키워드 검색 실패', 500);
    }
  }

  @Get('/getFilteredList')
  async filteredList(@Body() body: FilterConditionDto, @Query() query, @Res() res) {
    try {
      const response = await this.appService.getFilteredList(body, query.page, query.sort, query.order);
      res.status(200).send({
        status: 200,
        success: true,
        message: '필터 검색 성공',
        data: response,
      });
    } catch (err) {
      console.log(err);
      throw new HttpException('필터 검색 실패', 500);
    }
  }
}
