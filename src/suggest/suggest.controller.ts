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
  async findSuggestProductForYou(@User() user, @Query('page') page) {
    const userId = ObjectId(user.userId);
    return await this.suggestService.findSuggestProductForYou(userId, page);
  }

  @Get('situation')
  @UseGuards(new AuthGuard())
  async findSuggestProductForSituation(@User() user, @Query('page') page) {
    const userId = ObjectId(user.userId);
    return await this.suggestService.findSuggestProductForSituation(userId, page);
  }

  @Get('new')
  async findSuggestProductForNew(@Query('page') page) {
    return await this.suggestService.findSuggestProductForNew(page);
  }

  @Get('season')
  async findSuggestProductForSeason(@Query('page') page) {
    return await this.suggestService.findSuggestProductForSeason(page);
  }
}
