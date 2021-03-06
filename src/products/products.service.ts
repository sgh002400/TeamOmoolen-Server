import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectID, Repository } from 'typeorm';
import { Products } from '../entities/Products';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
  ) {}

  async findProductById(id: ObjectID) {
    return this.productsRepository.findOne({
      where: { _id: id },
    });
  }

  async findPopularProductList() {
    const now = new Date();
    const threeMonthAgo = new Date(now.setMonth(now.getMonth() - 3));

    return await this.productsRepository.find({
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
      ],
      order: {
        releaseDate: 'DESC',
        searchCount: 'DESC',
      },
      take: 6,
    });
  }

  async findSuggestProductList(id: ObjectID) {
    const findItem = await this.productsRepository.findOne({
      where: { _id: id },
    });

    return await this.productsRepository.find({
      where: {
        _id: { $ne: findItem.id },
        brand: findItem.brand,
        color: findItem.color,
        diameter: findItem.diameter,
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
      take: 4,
    });
  }
}
