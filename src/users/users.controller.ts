import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { saveOnBoardingDataDto } from '../common/dto/save.onboarding.data.dto';
import { User } from '../common/decorators/user.decorator';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ObjectId = require('mongodb').ObjectID;

@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/saveOnBoardingData')
  async saveOnBoardingData(@Body() body: saveOnBoardingDataDto, @User() user) {
    const userId = ObjectId(user.userId);
    await this.usersService.saveOnBoardingData(body, userId);
  }
}
