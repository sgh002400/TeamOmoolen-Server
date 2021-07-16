import { Injectable, ParseIntPipe } from '@nestjs/common';
import { Products } from '../entities/Products';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThan, ObjectID, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { suggestResponseDto } from '../common/dto/suggest.response.dto';

@Injectable()
export class SuggestService {
  constructor(
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
    private readonly usersService: UsersService,
  ) {}

  async findSuggestProduct(id: ObjectID) {
    const findUser = await this.usersService.findUserById(id);

    const [suggestForYou, suggestForYouTotalCount] = await this.productsRepository.findAndCount({
        where: {
          color: { $in: findUser.wantedLens.color },
          function: findUser.wantedLens.function,
          changeCycleRange: { $in: findUser.wantedLens.changeCycleRange },
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
        order: {
          name: 'DESC',
        },
        take: 8,
      });
    let suggestForYouTotalPage = parseInt(String(suggestForYouTotalCount / 8));
    if (suggestForYouTotalCount % 8 != 0) {
      suggestForYouTotalPage++;
    }

    let suggestForSituation;
    let suggestForSituationTotalCount;
    switch (findUser.wearTime) {
      case '일상':
        [suggestForSituation, suggestForSituationTotalCount] = await this.productsRepository.findAndCount({
            where: {
              diameter: { $lte: 13.4 },
              color: { $in: ['brown', 'choco'] },
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
            order: {
              name: 'DESC',
            },
            take: 8,
          });
        break;
      case '특별':
        [suggestForSituation, suggestForSituationTotalCount] = await this.productsRepository.findAndCount({
            where: {
              diameter: { $lt: 13.9 },
              color: { $in: ['grey', 'purple', 'pink', 'blue', 'green'] },
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
            order: {
              name: 'DESC',
            },
            take: 8,
          });
        break;
      case '운동':
        [suggestForSituation, suggestForSituationTotalCount] = await this.productsRepository.findAndCount({
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
            order: {
              name: 'DESC',
            },
            take: 8,
          });
        break;
      case '여행':
        [suggestForSituation, suggestForSituationTotalCount] = await this.productsRepository.findAndCount({
            where: {
              color: { $in: findUser.wantedLens.color },
              changeCycle: 1,
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
            order: {
              name: 'DESC',
            },
            take: 8,
          });
        break;
    }
    let suggestForSituationTotalPage = parseInt(String(suggestForSituationTotalCount / 8));
    if (suggestForYouTotalCount % 8 != 0) {
      suggestForSituationTotalPage++;
    }

    const now = new Date();
    const threeMonthAgo = new Date(now.setMonth(now.getMonth() - 3));

    const [suggestForNew, suggestForNewTotalCount] = await this.productsRepository.findAndCount({
        where: {
          releaseDate: { $gte: threeMonthAgo },
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
        order: {
          name: 'DESC',
        },
        take: 8,
      });
    let suggestForNewTotalPage = parseInt(String(suggestForNewTotalCount / 8));
    if (suggestForYouTotalCount % 8 != 0) {
      suggestForNewTotalPage++;
    }

    //TODO: 현재 여름만 정적으로 구현. 이후 계절별 분기 필요
    const [suggestForSeason, suggestForSeasonTotalCount] = await this.productsRepository.findAndCount({
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
        order: {
          name: 'DESC',
        },
        take: 8,
      });
    let suggestForSeasonTotalPage = parseInt(String(suggestForSeasonTotalCount / 8));
    if (suggestForYouTotalCount % 8 != 0) {
      suggestForSeasonTotalPage++;
    }

    const response = new suggestResponseDto(
      findUser.wearTime,
      'summer',
      suggestForYouTotalPage,
      suggestForSituationTotalPage,
      suggestForNewTotalPage,
      suggestForSeasonTotalPage,
      suggestForYou,
      suggestForSituation,
      suggestForNew,
      suggestForSeason,
    );

    return response;
  }

  async findSuggestProductForYou(id: ObjectID, page: number, sort: string, order: string) {
    const findUser = await this.usersService.findUserById(id);
    const [items, totalCount] = await this.productsRepository.findAndCount({
      where: {
        color: { $in: findUser.wantedLens.color },
        function: findUser.wantedLens.function,
        changeCycleRange: { $in: findUser.wantedLens.changeCycleRange },
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
      order: {
        [sort]: order === 'desc' ? 'DESC' : 'ASC',
        name: 'DESC',
      },
      skip: (page - 1) * 8,
      take: 8,
    });

    let totalPage = parseInt(String(totalCount / 8));
    if (totalCount % 8 != 0) {
      totalPage++;
    }

    return {
      items: items,
      totalPage: totalPage,
    };
  }

  async findSuggestProductForSituation(id: ObjectID, page: number, sort: string, order: string) {
    const findUser = await this.usersService.findUserById(id);

    switch (findUser.wearTime) {
      case '일상': {
        const [items, totalCount] = await this.productsRepository.findAndCount({
          where: {
            diameter: { $lte: 13.4 },
            color: { $in: ['brown', 'choco'] },
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
          order: {
            [sort]: order === 'desc' ? 'DESC' : 'ASC',
            name: 'DESC',
          },
          skip: (page - 1) * 8,
          take: 8,
        });

        let totalPage = parseInt(String(totalCount / 8));
        if (totalCount % 8 != 0) {
          totalPage++;
        }

        return {
          items: items,
          totalPage: totalPage,
        };
        break;
      }
      case '특별': {
        const [items, totalCount] = await this.productsRepository.findAndCount({
          where: {
            diameter: { $lt: 13.9 },
            color: { $in: ['grey', 'purple', 'pink', 'blue', 'green'] },
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
          order: {
            name: 'DESC',
          },
          skip: (page - 1) * 8,
          take: 8,
        });

        let totalPage = parseInt(String(totalCount / 8));
        if (totalCount % 8 != 0) {
          totalPage++;
        }

        return {
          items: items,
          totalPage: totalPage,
        };
        break;
      }
      case '운동': {
        const [items, totalCount] = await this.productsRepository.findAndCount({
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
          order: {
            name: 'DESC',
          },
          skip: (page - 1) * 8,
          take: 8,
        });

        let totalPage = parseInt(String(totalCount / 8));
        if (totalCount % 8 != 0) {
          totalPage++;
        }

        return {
          items: items,
          totalPage: totalPage,
        };
        break;
      }
      case '여행': {
        const [items, totalCount] = await this.productsRepository.findAndCount({
          where: {
            color: { $in: findUser.wantedLens.color },
            changeCycle: 1,
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
          order: {
            name: 'DESC',
          },
          skip: (page - 1) * 8,
          take: 8,
        });

        let totalPage = parseInt(String(totalCount / 8));
        if (totalCount % 8 != 0) {
          totalPage++;
        }

        return {
          items: items,
          totalPage: totalPage,
        };
        break;
      }
    }
  }

  async findSuggestProductForNew(page: number, sort: string, order: string) {
    const now = new Date();
    const threeMonthAgo = new Date(now.setMonth(now.getMonth() - 3));

    const [items, totalCount] = await this.productsRepository.findAndCount({
      where: {
        releaseDate: { $gte: threeMonthAgo },
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
      order: {
        [sort]: order === 'desc' ? 'DESC' : 'ASC',
        releaseDate: 'DESC',
      },
      skip: (page - 1) * 8,
      take: 8,
    });

    let totalPage = parseInt(String(totalCount / 8));
    if (totalCount % 8 != 0) {
      totalPage++;
    }

    return {
      items: items,
      totalPage: totalPage,
    };
  }

  async findSuggestProductForSeason(page: number, sort: string, order: string) {
    const [items, totalCount] = await this.productsRepository.findAndCount({
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
      order: {
        [sort]: order === 'desc' ? 'DESC' : 'ASC',
        name: 'DESC',
      },
      skip: (page - 1) * 8,
      take: 8,
    });

    let totalPage = parseInt(String(totalCount / 8));
    if (totalCount % 8 != 0) {
      totalPage++;
    }

    return {
      items: items,
      totalPage: totalPage,
    };
  }
}
