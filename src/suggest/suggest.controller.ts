import { Controller, Get } from '@nestjs/common';
import { SuggestService } from './suggest.service';
import { User } from 'src/common/decorators/user.decorator';
import { UseGuards } from '@nestjs/common';
import AuthGuard from 'src/middlewares/auth.middleware';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ObjectId = require('mongodb').ObjectID;

@Controller('suggest')
export class SuggestController {
  constructor(private readonly suggestService: SuggestService) {}

  @Get()
  @UseGuards(new AuthGuard())
  async findSuggestProductList(@User() user) {
    const userId = ObjectId(user.userId);
    return await this.suggestService.findSuggestProductList(userId);
  }
}
