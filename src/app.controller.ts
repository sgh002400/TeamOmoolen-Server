import { Controller, Get, Post, Query, Body, Response } from '@nestjs/common';
import { query } from 'express';
import { ObjectID } from 'typeorm';
import { AppService } from './app.service';
import { FilterConditionDto } from './dto/filter.condition.dto';
import { saveOnBoardingDataDto } from './dto/save.onboarding.data.dto';
import { SearchQueryStringDto } from './dto/search.querystring.dto';
import { Users } from './entities/Users';
const ObjectId = require('mongodb').ObjectID

@Controller('/api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/saveOnBoardingData')
  async saveOnBoardingData(@Body() body: saveOnBoardingDataDto) {//헤더까서 user 정보 가져와야됨 

    const id = new ObjectId("60e7975bb8cadc72adc44f33");
    return this.appService.saveOnBoardingData(body, id);
  }

  @Get('/home')
  async getHomeData() { //헤더까서 user 정보 가져온 뒤 
    const id = new ObjectId("60e7975bb8cadc72adc44f33");
    return this.appService.findHomeData(id)
  }

  @Get('/searchWindow')
  async getPopularItem() {
    return this.appService.findPopularItem()
  }

  @Get('/searchProduct')
  async getSearchProduct(@Query() query: SearchQueryStringDto) {
    return this.appService.getSearchProduct(query)
  }

  @Get('/getFilteredList')
  async filteredList(@Body() body: FilterConditionDto) { 
    return this.appService.getFilteredList(body)
  }
}
