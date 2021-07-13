import { Controller, Get, Post, Query, Body, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './common/decorators/user.decorator';
import { FilterConditionDto } from './common/dto/filter.condition.dto';
import { SearchQueryStringDto } from './common/dto/search.querystring.dto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ObjectId = require('mongodb').ObjectID;

@Controller('/api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/home')
  async getHomeData(@User() user, @Res() res) {
    const userId = ObjectId(user.userId);
    const response = await this.appService.findHomeData(userId);
    res.status(200).send({
      status: 200, 
      message: "홈 화면 데이터 조회 완료",
      data: response,
    });
  }

  @Get('/searchWindow')
  async getPopularItem(@Res() res) {
    const response = await this.appService.findPopularItem();
    res.status(200).send({
      status: 200,
      message: "인기 검색어 조회 성공",
      data: response
    })
  }

  @Get('/searchProduct')
  async getSearchProduct(@Query() query, @Res() res) {
    const response = await this.appService.getSearchProduct(query.keyword, query.page, query.sort, query.order);
    res.status(200).send({
      status: 200,
      message: "키워드 검색 성공",
      data: response
    })
  }

  @Get('/getFilteredList')

  async filteredList(@Body() body: FilterConditionDto, @Query() query, @Res() res) {
    const response = await this.appService.getFilteredList(body, query.page, query.sort, query.order);
    res.status(200).send({
      status: 200,
      message: "필터 검색 성공",
      data: response
    })
  }
}
