import { Query, Req } from '@nestjs/common';
import { Controller, Get, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const AppleAuth = require('apple-auth');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bodyParser = require('body-parser');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken');

const config = {
  client_id: 'com.Omoolen.service',
  team_id: '4QG3GC35LA',
  redirect_uri: 'https://omoolen.loca.lt/auth/apple',
  key_id: 'GY77G6Q7JW',
  scope: 'name email',
};

const auth = new AppleAuth(config, 'src/config/AuthKey_GY77G6Q7JW.p8');

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getAuthLogin(@Res() res) {
    res.send(`<a href="${auth.loginURL()}">Sign in with Apple</a>`);
  }

  @Get('token')
  getToken(@Res() res) {
    res.send(auth._tokenGenerator.generate());
  }

  /**
   * APPLE LOGIN CALL BACK 함수
   */
  @Post('apple')
  async appleLogin(@Req() req, @Res() res) {
    try {
      const response = await auth.accessToken(req.body.code);
      const idToken = jwt.decode(response.id_token);

      let userName = '오무렌';
      if (req.body.user) {
        const { name } = JSON.parse(req.body.user);
        const { lastName, firstName } = name;
        userName = lastName + firstName;
      }

      const userEmail = idToken.email;

      const user = await this.authService.findOrCreateUser({
        userName,
        userEmail,
      });
      const accessToken = this.authService.makeAccessToken(user.id);

      res.json(accessToken);
      // return { accessToken, isNewUser }; //TODO: for 클라이언트 분기처리
    } catch (ex) {
      console.error(ex);
      res.send('An error occurred!');
    }
  }
}
