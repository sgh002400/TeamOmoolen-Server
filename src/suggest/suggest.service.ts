import { Injectable, ParseIntPipe } from '@nestjs/common';
import { Products } from '../entities/Products';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThan, ObjectID, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';

@Injectable()
export class SuggestService {
  constructor(
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
    private readonly usersService: UsersService,
  ) {}

  async findSuggestProduct(id: ObjectID) {
    const findUser = await this.usersService.findUserById(id);

    const suggestForYou = await this.productsRepository.find({
      where: {
        color: { $in: findUser.wantedLens.color },
        function: findUser.wantedLens.function,
        changeCycle: findUser.wantedLens.changeCycle,
      },
      select: [
        'id',
        'imageList',
        'brand',
        'name',
        'diameter',
        'changeCycle',
        'pieces',
        'price',
        'otherColorList',
      ],
      order: {
        releaseDate: 'DESC',
      },
      take: 8,
    });

    let suggestForSituation;
    switch (findUser.wearTime) {
      case '일상':
        suggestForSituation = await this.productsRepository.find({
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
            'changeCycle',
            'pieces',
            'price',
            'otherColorList',
          ],
          order: {
            releaseDate: 'DESC',
          },
          take: 8,
        });
      case '특별':
        suggestForSituation = await this.productsRepository.find({
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
            'changeCycle',
            'pieces',
            'price',
            'otherColorList',
          ],
          order: {
            releaseDate: 'DESC',
          },
          take: 8,
        });
      case '운동':
        suggestForSituation = await this.productsRepository.find({
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
            'changeCycle',
            'pieces',
            'price',
            'otherColorList',
          ],
          order: {
            releaseDate: 'DESC',
          },
          take: 8,
        });
      case '여행':
        suggestForSituation = await this.productsRepository.find({
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
            'changeCycle',
            'pieces',
            'price',
            'otherColorList',
          ],
          order: {
            releaseDate: 'DESC',
          },
          take: 8,
        });
    }

    const now = new Date();
    const threeMonthAgo = new Date(now.setMonth(now.getMonth() - 3));

    const suggestForNew = await this.productsRepository.find({
      where: {
        releaseDate: { $gte: threeMonthAgo },
      },
      select: [
        'id',
        'imageList',
        'brand',
        'name',
        'diameter',
        'changeCycle',
        'pieces',
        'price',
        'otherColorList',
      ],
      order: {
        releaseDate: 'DESC',
      },
      take: 8,
    });

    //TODO: 현재 여름만 정적으로 구현. 이후 계절별 분기 필요
    const suggestForSeason = await this.productsRepository.find({
      where: {
        color: 'blue',
      },
      select: [
        'id',
        'imageList',
        'brand',
        'name',
        'diameter',
        'changeCycle',
        'pieces',
        'price',
        'otherColorList',
      ],
      order: {
        releaseDate: 'DESC',
      },
      take: 8,
    });

    const response = {};
    response['suggestForYou'] = suggestForYou;
    response['suggestForSituation'] = suggestForSituation;
    response['suggestForNew'] = suggestForNew;
    response['suggestForSeason'] = suggestForSeason;

    return response;
  }

  async findSuggestProductForYou(id: ObjectID, page: number) {
    const findUser = await this.usersService.findUserById(id);
    const [items, totalCount] = await this.productsRepository.findAndCount({
      where: {
        color: { $in: findUser.wantedLens.color },
        function: findUser.wantedLens.function,
        changeCycle: findUser.wantedLens.changeCycle,
      },
      select: [
        'id',
        'imageList',
        'brand',
        'name',
        'diameter',
        'changeCycle',
        'pieces',
        'price',
        'otherColorList',
      ],
      order: {
        releaseDate: 'DESC',
      },
      skip: (page - 1) * 1,
      take: 1,
    });

    let totalPage = parseInt(String(totalCount / 8));
    if (totalCount % 8 != 0) {
      totalPage++;
    }

    return {
      data: items,
      totalPage: totalPage,
    };
  }

  async findSuggestProductForSituation(id: ObjectID, page: number) {
    const findUser = await this.usersService.findUserById(id);

    switch (findUser.wearTime) {
      case '일상':
        let [items, totalCount] = await this.productsRepository.findAndCount({
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
            'changeCycle',
            'pieces',
            'price',
            'otherColorList',
          ],
          order: {
            releaseDate: 'DESC',
          },
          skip: (page - 1) * 1,
          take: 1,
        });
      case '특별':
        [items, totalCount] = await this.productsRepository.findAndCount({
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
            'changeCycle',
            'pieces',
            'price',
            'otherColorList',
          ],
          order: {
            releaseDate: 'DESC',
          },
          skip: (page - 1) * 1,
          take: 1,
        });
      case '운동':
        [items, totalCount] = await this.productsRepository.findAndCount({
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
            'changeCycle',
            'pieces',
            'price',
            'otherColorList',
          ],
          order: {
            releaseDate: 'DESC',
          },
          skip: (page - 1) * 1,
          take: 1,
        });
      case '여행':
        [items, totalCount] = await this.productsRepository.findAndCount({
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
            'changeCycle',
            'pieces',
            'price',
            'otherColorList',
          ],
          order: {
            releaseDate: 'DESC',
          },
          skip: (page - 1) * 1,
          take: 1,
        });

        let totalPage = parseInt(String(totalCount / 8));
        if (totalCount % 8 != 0) {
          totalPage++;
        }

        return {
          data: items,
          totalPage: totalPage,
        };
    }
  }

  async findSuggestProductForNew(page: number) {
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
        'changeCycle',
        'pieces',
        'price',
        'otherColorList',
      ],
      order: {
        releaseDate: 'DESC',
      },
      skip: (page - 1) * 1,
      take: 1,
    });

    let totalPage = parseInt(String(totalCount / 8));
    if (totalCount % 8 != 0) {
      totalPage++;
    }

    return {
      data: items,
      totalPage: totalPage,
    };
  }

  async findSuggestProductForSeason(page: number) {
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
        'changeCycle',
        'pieces',
        'price',
        'otherColorList',
      ],
      order: {
        releaseDate: 'DESC',
      },
      skip: (page - 1) * 1,
      take: 1,
    });

    let totalPage = parseInt(String(totalCount / 8));
    if (totalCount % 8 != 0) {
      totalPage++;
    }

    return {
      data: items,
      totalPage: totalPage,
    };
  }
}
