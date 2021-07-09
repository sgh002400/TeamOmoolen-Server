import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, LessThanOrEqual, Like, MoreThanOrEqual, ObjectID, Repository, In } from 'typeorm';
import { FilterConditionDto } from './dto/filter.condition.dto';
import { saveOnBoardingDataDto } from './dto/save.onboarding.data.dto';
import { SearchQueryStringDto } from './dto/search.querystring.dto';
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
    private eventsRepository: Repository<Events>
    ) {}

  /*
  컬러값 16진수로 바꾸기
  take했을 때 항상 똑같은 결과 나오지 않나 체크
  상세보기 눌렀을 때 인기 count 증가
  findRecommendationByUser
  */

  async saveOnBoardingData(body: saveOnBoardingDataDto, id: number) {
    //토큰까서 user 찾아내기
    const user = await this.usersRepository.findOne({
      where: {
        id: id
      }
    })

    user.age = body.age;
    user.gender = body.gender;
    user.wantedLens.category = body.category;
    user.wantedLens.color = body.color;
    user.wantedLens.function = body.function;
    user.wantedLens.changeCycle = body.changeCycle;
    user.suitedLens.brand = body.brand;
    user.suitedLens.name = body.lensName;
    user.suitedLens.wearTime = body.wearTime;

    await this.usersRepository.save(user);

  }

  async findHomeData(id: number) {
    //토큰 정보에서 user 정보 찾아야 될 듯

    const user = this.findUser(id);
    const userName = (await user).name;
    const season = "여름";

    if(this.OnboardingComplete(await user)) {
      const recommendationByUser = this.findRecommendationByUser(await user);
      const guides = this.findGuide();
      const recommendationBySeason = this.findRecommendationBySeason(season);
      const deadlineEvent = this.findDeadlineEvents();
      const newLens = this.findNewLens();
      const recommendationBySituation = this.findRecommendationBySituation(await user);
      const lastestEvent = this.findLastestEvent()
      
      const homeValues = {
        userName,
        recommendationByUser,
        guides,
        recommendationBySeason,
        deadlineEvent,
        newLens,
        recommendationBySituation,
        lastestEvent
      }
      
      return homeValues; //형식 맞는지 확인 -> log 찍어보기

    } else {
      //온보딩을 안하는 경우 보류!
    }    
  }

  /* 매번 바뀌는지 확인해보기 */

  async OnboardingComplete(user: Users) {
    if(user.gender != null && user.age != null && user.wantedLens != null && user.suitedLens != null && user.favoriteList != null) {
      return true;
    }
  }

  async findUser(id: number)  {
    return this.usersRepository.findOne({
      where: { id: id }
    });
  }

  async findRecommendationByUser(user: Users) {
    return this.productsRepository.find({
      where: {
        wantedLens: { 
          color: In(user.wantedLens.color),
          function: In(user.wantedLens.function),
          changeCycle: In(user.wantedLens.changeCycle)
        }
      },
      take: 6
    });
  }

  async findGuide() {
    return this.guidesRepository.find({
      order: {
        createAt: "DESC"
      },
      take: 9    
    })
  }

  async findRecommendationBySeason(season: String) {
    
    if(season == "봄") {
      return this.productsRepository.find({
        where: {
          color: "골드"
        },
        take: 6
      })
    } else if (season == "여름") {
      return this.productsRepository.find({
        where: {
          color: "그린"
        },
        take: 6
      })
    } else if (season == "가을") {
      return this.productsRepository.find({
        where: {
          color: "브라운"
        },
        take: 6
      })
    } else if (season == "겨울") {
      return this.productsRepository.find({
        where: {
          color: "블루"
        },
        take: 6
      })
    } else {
      console.log("잘못된 계절입니다.");
    }

  }

  async findDeadlineEvents() {
    return this.eventsRepository.find({
      order: {
        endDate: "DESC"
      },
      take: 3
    })
  }
  
  async findNewLens() { 
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() - 3;
    const date = today.getDate();
    const dueDate = `${year}-${month}-${date}`

    const newLensBrand1 = this.productsRepository.find({
      where : {
        brand: "오렌즈",
        releaseDate: MoreThanOrEqual(dueDate) //morethanequal 되는지가 의문!
      }
    });

    const newLensBrand2 = this.productsRepository.find({
      where : {
        brand: "렌즈미",
        releaseDate: MoreThanOrEqual(dueDate)
      }
    });
    
    const newLensBrand3 = this.productsRepository.find({
      where: {
        brand: "렌즈베리",
        releaseDate: MoreThanOrEqual(dueDate)
      }
    });

    return {
      newLensBrand1,
      newLensBrand2,
      newLensBrand3
    }
  }

  async findRecommendationBySituation(user: Users) {
    
    if(user.suitedLens.wearTime == "일상생활") {
      return this.productsRepository.find({
        where: [
          { color: "브라운", diameter: LessThanOrEqual(13.4) },
          { color: "초코", diameter: LessThanOrEqual(13.4) }
        ],
        take: 6
      })
    } else if(user.suitedLens.wearTime == "특별한 날") {
      return this.productsRepository.find({
        where: [
          { color: "그레이", diameter: LessThanOrEqual(13.9) },
          { color: "글리터", diameter: LessThanOrEqual(13.9) },
          { color: "퍼플", diameter: LessThanOrEqual(13.9) },
          { color: "핑크", diameter: LessThanOrEqual(13.9) },
          { color: "블루", diameter: LessThanOrEqual(13.9) },
          { color: "그린", diameter: LessThanOrEqual(13.9) },
        ],
        take: 6
      })
    } else if(user.suitedLens.wearTime == "운동") {
      return this.productsRepository.find({
        where: {
          color: "투명",
          price: LessThan(20000)
        }
      })
    } else if(user.suitedLens.wearTime == "여행") {
      return this.productsRepository.find({
        where: {
          color: In(user.wantedLens.color)
        }
      })
    } else {
      console.log("잘못된 상황입니다.")
    }
  }

  async findLastestEvent() {

    return this.eventsRepository.find({
      order: {
        "startDate": "DESC"
      },
      take: 3
    })
  }

  async getSearchProduct(query: SearchQueryStringDto) { 

    const keyword = query.keyword;

    return this.productsRepository.find({
      where: {
        name: Like(`${keyword}%`)
      },
      take:10
    })
  }

  async getFilteredList(body: FilterConditionDto) {
    
    return this.productsRepository.find({
      where: {
        brand: In (body.brand),
        color: In(body.color),
        diameter: body.diameter,
        changeCycle: In(body.changeCycle)
      },
      take: 9 //아마 무한 로딩인지 뭐시기 적용해야 될듯
    })
  }

  async findPopularItem() {

    return this.productsRepository.find({
      order: {
        searchCount: "DESC"
      },
      take: 9
    })
  }
}