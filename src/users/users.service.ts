import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/Users';
import { ObjectID, Repository } from 'typeorm';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mongodb = require('mongodb');

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async createUser(userName: string, oauthKey: string) {
    const newUser = new Users();
    newUser.name = userName;
    newUser.oauthKey = oauthKey;

    return await this.usersRepository.save(newUser);
  }

  async findByOauthKey(oauthKey: string) {
    return this.usersRepository.findOne({
      where: { oauthKey: oauthKey },
    });
  }
}
