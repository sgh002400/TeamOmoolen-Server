import { Query, Req } from '@nestjs/common';
import { Controller, Get, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const AppleAuth = require('apple-auth');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bodyParser = require('body-parser');
// eslint-disable-next-line @typescript-eslint/no-var-requires

const config = {
  client_id: 'com.Omoolen.service',
  team_id: '4QG3GC35LA',
  redirect_uri: 'https://omoolen.loca.lt/auth/apple',
  key_id: 'CY92UWQ3F3',
  scope: 'name email',
};

const auth = new AppleAuth(config, 'src/config/AuthKey_CY92UWQ3F3.p8');

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * APPLE LOGIN CALL BACK 함수
   * 클라이언트에서 [POST]'https://ommolen.loca.lt/auth/apple' 요청.
   * req.body 안에 oauthKey, familyName, givenName  담겨서 온다.
   */
  @Post('apple')
  async appleLogin(@Req() req, @Res() res) {
    try {
      const oauthKey = req.body.oauthKey;

      let userName = '오무렌';
      if (req.body.givenName) {
        userName = req.body.familyName + req.body.givenName;
      }

      const { user, isNewUser } = await this.authService.findOrCreateUser({
        userName,
        oauthKey,
      });
      const accessToken = this.authService.makeAccessToken(user.id);

      console.log(user);
      console.log(accessToken);

      res.json({
        accessToken: accessToken,
      });
      // return { accessToken, isNewUser }; //TODO: for 클라이언트 분기처리
    } catch (ex) {
      console.error(ex);
      res.send('An error occurred!');
    }
  }

  /**
   * KAKAO LOGIN CALL BACK 함수
   * 클라이언트에서 [POST] 'https://omoolen.loca.lt/auth/kakao' 요청.
   * req.body 안에 (oauthKey, name) 담겨서 온다.
   */
  @Post('kakao')
  async kakaoLogin(@Req() req, @Res() res) {
    try {
      const userName = req.body.name;
      const oauthKey = req.body.oauthKey;

      const { user, isNewUser } = await this.authService.findOrCreateUser({
        userName,
        oauthKey,
      });
      const accessToken = this.authService.makeAccessToken(user.id);

      res.json({
        accessToken: accessToken,
        isNewUser: isNewUser,
      });
    } catch (ex) {
      console.error(ex);
      res.send('An error occurred!');
    }
  }
}
