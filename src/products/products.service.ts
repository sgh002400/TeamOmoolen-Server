import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThan, MoreThanOrEqual } from 'typeorm';
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
      order: {
        releaseDate: 'DESC',
        searchCount: 'DESC',
      },
      take: 6,
    });
  }
}
