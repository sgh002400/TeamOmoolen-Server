import { Query, Req } from '@nestjs/common';
import { Controller, Get, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { appleAuthConfig } from '../config/authConfig';
const jwt = require('jsonwebtoken');
const fs = require('fs');
const AppleAuth = require('apple-auth');
const bodyParser = require('body-parser');

const auth = new AppleAuth(appleAuthConfig, 'src/config/AuthKey_CY92UWQ3F3.p8');

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * APPLE LOGIN CALL BACK 함수
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
