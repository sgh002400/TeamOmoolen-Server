import { Controller, Get, Post, Query, Body } from '@nestjs/common';
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
  async getHomeData() {
    const id = new ObjectId("60e7975bb8cadc72adc44f33");
    return this.appService.findHomeData(id);
  }
  
  @Get('/searchWindow')
  async getPopularItem() {
    return this.appService.findPopularItem();
  }
  
  @Get('/searchProduct')
  async getSearchProduct(@Query() query: SearchQueryStringDto) {
    return this.appService.getSearchProduct(query);
  }
  
  @Get('/getFilteredList')
  async filteredList(@Body() body: FilterConditionDto) {
    return this.appService.getFilteredList(body);
  }
}
