import { Body, Controller, ForbiddenException, HttpException, Post, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { saveOnBoardingDataDto } from '../common/dto/save.onboarding.data.dto';
import { User } from '../common/decorators/user.decorator';
const ObjectId = require('mongodb').ObjectID;

@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/saveOnBoardingData')
  async saveOnBoardingData(@Res() res, @Body() body: saveOnBoardingDataDto, @User() user) {
    try {
      const userId = ObjectId(user.userId);
      await this.usersService.saveOnBoardingData(body, userId);
      res.status(201).send({
        status: 201,
        success: true,
        message: '온보딩 데이터가 정상적으로 저장되었습니다.',
      });
    } catch (err) {
      console.log(err);
      throw new HttpException('온보딩 데이터 저장에 실패했습니다.', 500);
    }
  }
}
