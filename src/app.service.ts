import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Like,
  ObjectID,
  Repository,
} from 'typeorm';
import { FilterConditionDto } from './common/dto/filter.condition.dto';
import { HomeValueDto } from './common/dto/home.value.dto';
import { saveOnBoardingDataDto } from './common/dto/save.onboarding.data.dto';
import { SearchQueryStringDto } from './common/dto/search.querystring.dto';
import { SuitedLensDto } from './common/dto/suitedLens.dto';
import { WantedLensDto } from './common/dto/wantedLens.dto';
import { Events } from './entities/Events';
import { Guides } from './entities/Guides';
import { Products } from './entities/Products';
import { Tips } from './entities/Tips';
import { Users } from './entities/Users';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,

    @InjectRepository(Tips)
    private tipsRepository: Repository<Tips>,

    @InjectRepository(Products)
    private productsRepository: Repository<Products>,

    @InjectRepository(Guides)
    private guidesRepository: Repository<Guides>,

    @InjectRepository(Events)
    private eventsRepository: Repository<Events>,
  ) { }

  /*
  컬러값 16진수로 바꾸기
  take했을 때 항상 똑같은 결과 나오지 않나 체크
  상세보기 눌렀을 때 인기 count 증가
  findRecommendationByUser
  */

  async saveOnBoardingData(body: saveOnBoardingDataDto, id: ObjectID) {
    //토큰까서 user 찾아내기
    const user = await this.findUserById(id);

    user.age = body.age;
    user.gender = body.gender;

    const wantedLens = new WantedLensDto();
    wantedLens.category = body.wantedLens.category;
    wantedLens.color = body.wantedLens.color;
    wantedLens.function = body.wantedLens.function;
    wantedLens.changeCycle = body.wantedLens.changeCycle;
    wantedLens.brand = body.wantedLens.brand;

    const suitedLens = new SuitedLensDto();
    suitedLens.brand = body.suitedLens.brand;
    suitedLens.name = body.suitedLens.name;

    user.wantedLens = wantedLens;
    user.suitedLens = suitedLens;

    await this.usersRepository.save(user);
  }

  async findHomeData(id: ObjectID) {
    //토큰 정보에서 user 정보 찾아야 될 듯

    const user = await this.findUserById(id);
    const userName = user.name;
    const season = 'spring';
    const wearTime = user.wearTime;

    if (this.OnboardingComplete(user)) {
      const recommendationByUser = await this.findRecommendationByUserOnBoardingData(user);
      const guides = await this.findGuide();
      const recommendationBySeason = await this.findRecommendationBySeason(season);
      const deadlineEvent = await this.findDeadlineEvents();
      const newLens = await this.findNewLens();
      const recommendationBySituation = await this.findRecommendationBySituationOnBoardingData(user);
      const lastestEvent = await this.findLatestEvent();

      const homeValues = new HomeValueDto();

      homeValues.username = userName;
      homeValues.recommendationByUser = recommendationByUser;
      homeValues.guides = guides;
      homeValues.season = season;
      homeValues.recommendationBySeason = recommendationBySeason;
      homeValues.deadlineEvent = deadlineEvent;
      homeValues.newLens = newLens;
      homeValues.situation = wearTime;
      homeValues.recommendationBySituation = recommendationBySituation;
      homeValues.lastestEvent = lastestEvent;

      return homeValues;

    } else {
      //온보딩을 안하는 경우 보류!
    }
  }

  /* 매번 바뀌는지 확인해보기 */

  async OnboardingComplete(user: Users) {
    if (
      user.gender != null &&
      user.age != null &&
      user.wantedLens != null &&
      user.suitedLens != null &&
      user.favoriteList != null
    ) {
      return true;
    }
  }

  async findUserById(id: ObjectID) {
    return await this.usersRepository.findOne({
      where: { _id: id },
    });
  }

  async findRecommendationByUserOnBoardingData(user: Users) {
    return await this.productsRepository.find({
      where: {
        color: { $in: user.wantedLens.color }, //gold, green
        function: user.wantedLens.function, // 난시
        changeCycle: user.wantedLens.changeCycle //0
      },
      select: [
        'id',
        'name',
        'imageList',
        'category',
        'color',
        'otherColorList',
        'price',
        'brand',
        'releaseDate',
        'diameter',
        'changeCycle',
        'pieces',
        'function'
      ],
      take: 6,
    });
  }

  async findGuide() {
    return await this.guidesRepository.find({
      order: {
        createAt: 'DESC',
      },
      take: 6,
    });
  }

  async findRecommendationBySeason(season: string) {
    if (season == 'spring') {
      return await this.productsRepository.find({
        where: {
          color: "gold", 
        },
        select: [
          'id',
          'name',
          'imageList',
          'category',
          'color',
          'otherColorList',
          'price',
          'brand',
          'releaseDate',
          'diameter',
          'changeCycle',
          'pieces',
        ],
        take: 6,
      });
    } else if (season == 'summer') {
      return await this.productsRepository.find({
        where: {
          color: "green",
        },
        select: [
          'id',
          'name',
          'imageList',
          'category',
          'color',
          'otherColorList',
          'price',
          'brand',
          'releaseDate',
          'diameter',
          'changeCycle',
          'pieces',
        ],
        take: 6,
      });
    } else if (season == 'autumn') {
      return this.productsRepository.find({
        where: {
          color: "brown",
        },
        select: [
          'id',
          'name',
          'imageList',
          'category',
          'color',
          'otherColorList',
          'price',
          'brand',
          'releaseDate',
          'diameter',
          'changeCycle',
          'pieces',
        ],
        take: 6,
      });
    } else if (season == 'winter') {
      return this.productsRepository.find({
        where: {
          color: "blue",
        },
        select: [
          'id',
          'name',
          'imageList',
          'category',
          'color',
          'otherColorList',
          'price',
          'brand',
          'releaseDate',
          'diameter',
          'changeCycle',
          'pieces',
        ],
        take: 6,
      });
    } else {
      console.log('잘못된 계절입니다.');
    }
  }

  async findDeadlineEvents() {
    return this.eventsRepository.find({
      order: {
        endDate: 'ASC',
      },
      take: 3,
    });
  }

  async findNewLens() {
    
    const now = new Date();
    const threeMonthAgo = new Date(now.setMonth(now.getMonth() - 3));

    const newLensBrand1 = await this.productsRepository.find({
      where: {
        brand: '오렌즈',
        releaseDate: { $gte: threeMonthAgo },
      },
    });

    const newLensBrand2 = await this.productsRepository.find({
      where: {
        brand: '렌즈미',
        releaseDate: { $gte: threeMonthAgo },
      },
    });

    const newLensBrand3 = await this.productsRepository.find({
      where: {
        brand: '렌즈베리',
        releaseDate: { $gte: threeMonthAgo },
      },
    });

    return await 
    [
      newLensBrand1,
      newLensBrand2,
      newLensBrand3,
    ];
  }

  async findRecommendationBySituationOnBoardingData(user: Users) {
    if (user.wearTime == '일상생활') {
      return this.productsRepository.find({
        where: [
          { color: 'brown', diameter: { $lte: 13.4 } },
          { color: 'choco', diameter: { $lte: 13.4 } },
        ],
        take: 6,
      });
    } else if (user.wearTime == '특별한 날') {
      return this.productsRepository.find({
        where: [
          { color: 'grey', diameter: { $lte: 13.9 } },
          { color: 'purple', diameter: { $lte: 13.9 } },
          { color: 'pink', diameter: { $lte: 13.9 } },
          { color: 'blue', diameter: { $lte: 13.9 } },
          { color: 'green', diameter: { $lte: 13.9 } },
        ],
        take: 6,
      });
    } else if (user.wearTime == '운동') {
      return this.productsRepository.find({
        where: {
          color: 'clear',
          price: { $lt: 20000 },
        },
      });
    } else if (user.wearTime == '여행') {
      return this.productsRepository.find({
        where: {
          color: { $in: user.wantedLens.color },
        },
      });
    } else {
      console.log('잘못된 상황입니다.');
    }
  }

  async findLatestEvent() {
    return this.eventsRepository.find({
      order: {
        startDate: 'DESC',
      },
      take: 3,
    });
  }

  async getSearchProduct(query: SearchQueryStringDto) {
    const keyword = query.keyword;

    return this.productsRepository.find({
      where: {
        name: Like(`${keyword}%`),
      },
      take: 10,
    });
  }

  async getFilteredList(body: FilterConditionDto) {
    return this.productsRepository.find({
      where: {
        brand: { $in: body.brand },
        color: { $in: body.color },
        diameter: body.diameter,
        changeCycle: { $in: body.changeCycle },
      },
      take: 12,
    });
  }

  async findPopularItem() {
    return this.productsRepository.find({
      order: {
        searchCount: 'DESC',
      },
      take: 9,
    });
  }
}
