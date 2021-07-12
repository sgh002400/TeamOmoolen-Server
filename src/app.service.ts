import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
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

    @InjectRepository(Products)
    private productsRepository: Repository<Products>,

    @InjectRepository(Guides)
    private guidesRepository: Repository<Guides>,

    @InjectRepository(Events)
    private eventsRepository: Repository<Events>,
  ) { }


  async saveOnBoardingData(body: saveOnBoardingDataDto, id: ObjectID) {
    //토큰까서 user 찾아내기
    const user = await this.findUserById(id);

    user.age = body.age;
    user.gender = body.gender;
    user.wearTime = body.wearTime;
    
    const wantedLens = new WantedLensDto();
    wantedLens.category = body.wantedLens.category;
    wantedLens.color = body.wantedLens.color;
    wantedLens.function = body.wantedLens.function;
    wantedLens.changeCycleRange = body.wantedLens.changeCycleRange;

    const suitedLens = new SuitedLensDto();
    suitedLens.brand = body.suitedLens.brand;
    suitedLens.name = body.suitedLens.name;

    user.wantedLens = wantedLens;
    user.suitedLens = suitedLens;

    await this.usersRepository.save(user);

    return {
      "status": 200,
      "success": true,
      "message": "온보딩 데이터 저장 성공"
    }
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
        color: { $in: user.wantedLens.color },
        function: user.wantedLens.function,
        changeCycleRange: { $in: user.wantedLens.changeCycleRange }
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
        name: { $regex: `^${keyword}` }
      },
      take: 12,
    });
  }

  async getFilteredList(body: FilterConditionDto) {

    if(body.diameter == -1) {
      return this.productsRepository.find({
        where: {
          brand: { $in: body.brand },
          color: { $in: body.color },  
          changeCycleRange: { $in: body.changeCycleRange }
        },
      take: 12,
      });
    }

    let diameterMin = 0;
    let diameterMax = 0;

    if(body.diameter == 0) {
      diameterMin = 0;
      diameterMax = 12.6;
    } else if(body.diameter == 1) {
      diameterMax = 13.0;
      diameterMin = 12.7;
    } else if(body.diameter == 2) {
      diameterMax = 13.3;
      diameterMin = 13.1;
    } else if(body.diameter == 3) {
      diameterMax = 13.6;
      diameterMin = 13.4;
    } else if(body.diameter == 4) {
      diameterMax = 13.9;
      diameterMin = 13.7;
    } else if(body.diameter == 5) {
      diameterMax = 14.0;
      diameterMin = 30.0;
    }
    
    return await this.productsRepository.find({
      where: {
        brand: { $in: body.brand },
        color: { $in: body.color },
        diameter: { 
          $lte: diameterMax,
          $gte: diameterMin
        },
        changeCycleRange: { $in: body.changeCycleRange } 
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
      select: [
        "id",
        "name"
      ]
    });
  }
}
