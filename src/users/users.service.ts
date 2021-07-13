import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/Users';
import { ObjectID, Repository } from 'typeorm';
import { saveOnBoardingDataDto } from '../common/dto/save.onboarding.data.dto';
import { WantedLensDto } from '../common/dto/wantedLens.dto';
import { SuitedLensDto } from '../common/dto/suitedLens.dto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mongodb = require('mongodb');

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async findUserById(id: ObjectID) {
    return this.usersRepository.findOne({
      where: { _id: id },
    });
  }

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

  async saveOnBoardingData(body: saveOnBoardingDataDto, id: ObjectID) {
    const findUser = await this.findUserById(id);

    findUser.age = body.age;
    findUser.gender = body.gender;
    findUser.wearTime = body.wearTime;

    const wantedLens = new WantedLensDto();
    wantedLens.category = body.wantedLens.category;
    wantedLens.color = body.wantedLens.color;
    wantedLens.function = body.wantedLens.function;
    wantedLens.changeCycleRange = body.wantedLens.changeCycleRange;

    const suitedLens = new SuitedLensDto();
    suitedLens.brand = body.suitedLens.brand;
    suitedLens.name = body.suitedLens.name;

    findUser.wantedLens = wantedLens;
    findUser.suitedLens = suitedLens;

    await this.usersRepository.save(findUser);
  }
}
