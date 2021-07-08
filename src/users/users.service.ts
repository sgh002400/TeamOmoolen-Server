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

  async createUser(userName: string, userEmail: string) {
    const newUser = new Users();
    newUser.name = userName;
    newUser.email = userEmail;

    return await this.usersRepository.save(newUser);
  }

  async findByEmail(userEmail: string) {
    return this.usersRepository.findOne({
      where: { email: userEmail },
    });
  }
}
