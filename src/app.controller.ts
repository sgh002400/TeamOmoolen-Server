import { Controller, Get, Post, Query, Body, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { FilterConditionDto } from './common/dto/filter.condition.dto';
import { saveOnBoardingDataDto } from './common/dto/save.onboarding.data.dto';
import { SearchQueryStringDto } from './common/dto/search.querystring.dto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ObjectId = require('mongodb').ObjectID;

@Controller('/api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/saveOnBoardingData')
  async saveOnBoardingData(@Body() body: saveOnBoardingDataDto) {
    const id = new ObjectId("60e7975bb8cadc72adc44f33");
    return this.appService.saveOnBoardingData(body, id);
  }
  
  @Get('/home')
  async getHomeData(@Res() res) {
    const id = new ObjectId("60e7975bb8cadc72adc44f33");
    const response = await this.appService.findHomeData(id);
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
  async getSearchProduct(@Query() query: SearchQueryStringDto, @Res() res) {
    const response = await this.appService.getSearchProduct(query);
    res.status(200).send({
      status: 200,
      message: "키워드 검색 성공",
      data: response
    })
  }
  
  @Get('/getFilteredList')
  async filteredList(@Body() body: FilterConditionDto, @Res() res) {
    const response = await this.appService.getFilteredList(body);
    res.status(200).send({
      status: 200,
      message: "필터 검색 성공",
      data: response
    })
  }
}
