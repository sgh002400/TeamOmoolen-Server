import { Controller, Get, Post, Query, Body } from '@nestjs/common';
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
  async getHomeData(@User() user) {
    const userId = ObjectId(user.userId);
    return this.appService.findHomeData(userId);
  }

  @Get('/searchWindow')
  async getPopularItem() {
    return this.appService.findPopularItem();
  }

  @Get('/searchProduct')
  async getSearchProduct(@Query() query) {
    return this.appService.getSearchProduct(query.keyword, query.page, query.sort, query.order);
  }

  @Get('/getFilteredList')
  async filteredList(@Body() body: FilterConditionDto, @Query() query) {
    return this.appService.getFilteredList(body, query.page, query.sort, query.order);
  }
}
