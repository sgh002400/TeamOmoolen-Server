import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectID, Repository } from 'typeorm';
import { FilterConditionDto } from './common/dto/filter.condition.dto';
import { HomeValueDto } from './common/dto/home.value.dto';
import { saveOnBoardingDataDto } from './common/dto/save.onboarding.data.dto';
import { SearchQueryStringDto } from './common/dto/search.querystring.dto';
import { SuitedLensDto } from './common/dto/suitedLens.dto';
import { WantedLensDto } from './common/dto/wantedLens.dto';
import { Events } from './entities/Events';
import { Guides } from './entities/Guides';
import { Products } from './entities/Products';
import { Users } from './entities/Users';
import { UsersService } from './users/users.service';

@Injectable()
export class AppService {
  constructor(
    private readonly usersService: UsersService,

    @InjectRepository(Products)
    private productsRepository: Repository<Products>,

    @InjectRepository(Guides)
    private guidesRepository: Repository<Guides>,

    @InjectRepository(Events)
    private eventsRepository: Repository<Events>,
  ) {}

  //홈
  async findHomeData(id: ObjectID) {
    const findUser = await this.usersService.findUserById(id);

    const userName = findUser.name;
    const season = 'summer';
    const wearTime = findUser.wearTime;

    if (!findUser.gender) {
      const recommendationByUser =
        await this.findRecommendationByUserOnBoardingData(findUser);
      const guides = await this.findGuide();
      const recommendationBySeason = await this.findRecommendationBySeason(
        season,
      );
      const deadlineEvent = await this.findDeadlineEvents();
      const newLens = await this.findNewLens();
      const recommendationBySituation =
        await this.findRecommendationBySituationOnBoardingData(findUser);
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
      //TODO: 온보딩을 하지 않기로 선택한 경우 분기처리
    }
  }

  //온보딩 과정에서 유저가 입력한 정보 기반 추천상품 목록
  async findRecommendationByUserOnBoardingData(user: Users) {
    return await this.productsRepository.find({
      where: {
        color: { $in: user.wantedLens.color },
        function: user.wantedLens.function,
        changeCycleRange: { $in: user.wantedLens.changeCycleRange },
      },
      select: [
        'id',
        'imageList',
        'brand',
        'name',
        'diameter',
        'changeCycleMinimum',
        'changeCycleMaximum',
        'pieces',
        'price',
        'otherColorList',
      ],
      take: 6,
    });
  }

  //TODO: 카테고리별 (3개, 3개,3개) 묶어서 보내기
  async findGuide() {
    const firstGuideList = await this.guidesRepository.find({
      where: {
        category: '어쩌고 저쩌고',
      },
      order: {
        createAt: 'DESC',
      },
      take: 3,
    });

    const secondGuideList = await this.guidesRepository.find({
      where: {
        category: '어쩌고 저쩌고',
      },
      order: {
        createAt: 'DESC',
      },
      take: 3,
    });

    const thirdGuideList = await this.guidesRepository.find({
      where: {
        category: '어쩌고 저쩌고',
      },
      order: {
        createAt: 'DESC',
      },
      take: 3,
    });

    return [firstGuideList, secondGuideList, thirdGuideList];
  }

  //계절별 추천상품 목록
  async findRecommendationBySeason(season: string) {
    if (season == 'spring') {
      return await this.productsRepository.find({
        where: {
          color: 'gold',
        },
        select: [
          'id',
          'imageList',
          'brand',
          'name',
          'diameter',
          'changeCycleMinimum',
          'changeCycleMaximum',
          'pieces',
          'price',
          'otherColorList',
        ],
        take: 6,
      });
    } else if (season == 'summer') {
      return await this.productsRepository.find({
        where: {
          color: 'blue',
        },
        select: [
          'id',
          'imageList',
          'brand',
          'name',
          'diameter',
          'changeCycleMinimum',
          'changeCycleMaximum',
          'pieces',
          'price',
          'otherColorList',
        ],
        take: 6,
      });
    } else if (season == 'autumn') {
      return this.productsRepository.find({
        where: {
          color: 'brown',
        },
        select: [
          'id',
          'imageList',
          'brand',
          'name',
          'diameter',
          'changeCycleMinimum',
          'changeCycleMaximum',
          'pieces',
          'price',
          'otherColorList',
        ],
        take: 6,
      });
    } else if (season == 'winter') {
      return this.productsRepository.find({
        where: {
          color: 'blue',
        },
        select: [
          'id',
          'imageList',
          'brand',
          'name',
          'diameter',
          'changeCycleMinimum',
          'changeCycleMaximum',
          'pieces',
          'price',
          'otherColorList',
        ],
        take: 6,
      });
    } else {
      throw new HttpException('잘못된 계절 입력입니다.', 404);
    }
  }

  //마감이 얼마 남지 않은 이벤트 목록을 가져옴
  async findDeadlineEvents() {
    return this.eventsRepository.find({
      order: {
        endDate: 'ASC',
      },
      take: 3,
    });
  }

  //신제품 목록
  async findNewLens() {
    const now = new Date();
    const threeMonthAgo = new Date(now.setMonth(now.getMonth() - 3));

    const newLensBrand1 = await this.productsRepository.find({
      where: {
        brand: '오렌즈',
        releaseDate: { $gte: threeMonthAgo },
      },
      select: ['id', 'imageList', 'brand', 'name', 'price'],
    });

    const newLensBrand2 = await this.productsRepository.find({
      where: {
        brand: '렌즈미',
        releaseDate: { $gte: threeMonthAgo },
      },
      select: ['id', 'imageList', 'brand', 'name', 'price'],
    });

    const newLensBrand3 = await this.productsRepository.find({
      where: {
        brand: '렌즈베리',
        releaseDate: { $gte: threeMonthAgo },
      },
      select: ['id', 'imageList', 'brand', 'name', 'price'],
    });

    return [newLensBrand1, newLensBrand2, newLensBrand3];
  }

  //온보딩 과정에서 입력한 상황(wearTime) 기반 추천상품 목록
  async findRecommendationBySituationOnBoardingData(user: Users) {
    if (user.wearTime == '일상') {
      return this.productsRepository.find({
        where: {
          color: { $in: ['brown', 'choco'] },
          diameter: { $lte: 13.4 },
        },
        select: [
          'id',
          'imageList',
          'brand',
          'name',
          'diameter',
          'changeCycleMinimum',
          'changeCycleMaximum',
          'pieces',
          'price',
          'otherColorList',
        ],
        take: 6,
      });
    } else if (user.wearTime == '특별') {
      return this.productsRepository.find({
        where: {
          color: { $in: ['grey', 'purple', 'pink', 'blue', 'green'] },
          diameter: { $lte: 13.9 },
        },
        select: [
          'id',
          'imageList',
          'brand',
          'name',
          'diameter',
          'changeCycleMinimum',
          'changeCycleMaximum',
          'pieces',
          'price',
          'otherColorList',
        ],
        take: 6,
      });
    } else if (user.wearTime == '운동') {
      return this.productsRepository.find({
        where: {
          category: '투명',
          price: { $lt: 20000 },
        },
        select: [
          'id',
          'imageList',
          'brand',
          'name',
          'diameter',
          'changeCycleMinimum',
          'changeCycleMaximum',
          'pieces',
          'price',
          'otherColorList',
        ],
      });
    } else if (user.wearTime == '여행') {
      return this.productsRepository.find({
        where: {
          color: { $in: user.wantedLens.color },
        },
        select: [
          'id',
          'imageList',
          'brand',
          'name',
          'diameter',
          'changeCycleMinimum',
          'changeCycleMaximum',
          'pieces',
          'price',
          'otherColorList',
        ],
      });
    } else {
      throw new HttpException('잘못된 상황 입력입니다.', 404);
    }
  }

  //최신 이벤트 목록을 가져옴
  async findLatestEvent() {
    return this.eventsRepository.find({
      order: {
        startDate: 'DESC',
      },
      take: 3,
    });
  }

  //키워드검색 결과
  async getSearchProduct(
    keyword: string,
    page: number,
    sort: string,
    order: string,
  ) {
    const [items, totalCount] = await this.productsRepository.findAndCount({
      where: {
        name: { $regex: `${keyword}` },
      },
      select: [
        'id',
        'imageList',
        'brand',
        'name',
        'diameter',
        'changeCycleMinimum',
        'changeCycleMaximum',
        'pieces',
        'price',
        'otherColorList',
      ],
      skip: (page - 12) * 12,
      take: 12,
    });

    let totalPage = parseInt(String(totalCount / 12));
    if (totalCount % 12 != 0) {
      totalPage++;
    }

    return {
      items: items,
      totalPage: totalPage,
    };
  }

  //필터검색 결과
  async getFilteredList(
    body: FilterConditionDto,
    page: number,
    sort: string,
    order: string,
  ) {
    // 필터검색에서 직경을 선택하지 않았을 경우, 전체 선택과 같은 결과가 나와야 하기 때문에 -1로 설정
    if (body.diameter == -1) {
      const [items, totalCount] = await this.productsRepository.findAndCount({
        where: {
          brand: { $in: body.brand },
          color: { $in: body.color },
          changeCycleRange: { $in: body.changeCycleRange },
        },
        select: [
          'id',
          'imageList',
          'brand',
          'name',
          'diameter',
          'changeCycleMinimum',
          'changeCycleMaximum',
          'pieces',
          'price',
          'otherColorList',
        ],
        skip: (page - 12) * 12,
        take: 12,
      });

      let totalPage = parseInt(String(totalCount / 12));
      if (totalCount % 12 != 0) {
        totalPage++;
      }

      return {
        items: items,
        totalPage: totalPage,
      };
    }

    let diameterMin = 0;
    let diameterMax = 0;

    if (body.diameter == 0) {
      diameterMin = 0;
      diameterMax = 12.6;
    } else if (body.diameter == 1) {
      diameterMin = 12.7;
      diameterMax = 13.0;
    } else if (body.diameter == 2) {
      diameterMin = 13.1;
      diameterMax = 13.3;
    } else if (body.diameter == 3) {
      diameterMin = 13.4;
      diameterMax = 13.6;
    } else if (body.diameter == 4) {
      diameterMin = 13.7;
      diameterMax = 13.9;
    } else if (body.diameter == 5) {
      diameterMin = 14.0;
      diameterMax = 30.0;
    }

    const [items, totalCount] = await this.productsRepository.findAndCount({
      where: {
        brand: { $in: body.brand },
        color: { $in: body.color },
        diameter: {
          $lte: diameterMax,
          $gte: diameterMin,
        },
        changeCycleRange: { $in: body.changeCycleRange },
      },
      select: [
        'id',
        'imageList',
        'brand',
        'name',
        'diameter',
        'changeCycleMinimum',
        'changeCycleMaximum',
        'pieces',
        'price',
        'otherColorList',
      ],
      skip: (page - 12) * 12,
      take: 12,
    });

    let totalPage = parseInt(String(totalCount / 12));
    if (totalCount % 12 != 0) {
      totalPage++;
    }

    return {
      items: items,
      totalPage: totalPage,
    };
  }

  //인기검색어를 가져옴
  async findPopularItem() {
    return this.productsRepository.find({
      order: {
        searchCount: 'DESC',
      },
      take: 9,
      select: ['id', 'name'],
    });
  }
}
