import { Injectable, ForbiddenException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectID, Repository } from 'typeorm';
import { Users } from '../entities/Users';
import { UsersService } from '../users/users.service';
import jsonwebtoken, { SignOptions } from 'jsonwebtoken';

const signOptions: SignOptions = {
  algorithm: 'HS384',
};

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  // TODO: 로그아웃을 구현할 경우, 새로 로그인 한 이후 클라이언트 분기 처리(홈 또는 온보딩)을 위한 boolean 값도 함께 넘겨줄 필요가 있음.
  async findOrCreateUser(data: { userName: string; oauthKey: string }) {
    let user = await this.usersService.findByOauthKey(data.oauthKey);

    if (user == null) {
      user = await this.usersService.createUser(data.userName, data.oauthKey);
    }
    return user;
  }

  makeAccessToken(userId: ObjectID): string {
    const payload = {
      userId,
    };

    const token: string = jsonwebtoken.sign(
      payload,
      process.env.JWT_SECRET,
      signOptions,
    );
    return token;
  }
}
