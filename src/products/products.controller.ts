import { Controller, Get, Param, Res } from '@nestjs/common';
import { ObjectID } from 'typeorm';
import { ProductsService } from './products.service';
import { ProductDetailResponseDto } from './dto/product-detail.response.dto';
import { ParseObjectIdPipe } from '../common/pipe/objectId.pipe';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get(':id')
  async findProduct(@Param('id', ParseObjectIdPipe) id: ObjectID, @Res() res) {
    const findProduct = await this.productsService.findProductById(id);
    const suggestProductList = await this.productsService.findSuggestProductList(id);
    const popularProductList = await this.productsService.findPopularProductList();

    const response = new ProductDetailResponseDto();
    response.imageURL = findProduct.imageList;
    response.brand = findProduct.brand;
    response.name = findProduct.name;
    response.price = findProduct.price;
    response.diameter = findProduct.diameter;
    response.changeCycleMinimum = findProduct.changeCycleMinimum;
    response.changeCycleMaximum = findProduct.changeCycleMaximum;
    response.material = findProduct.material;
    response.function = findProduct.function;
    response.color = findProduct.color;
    response.otherColorList = findProduct.otherColorList;
    response.suggestList = suggestProductList;
    response.popularList = popularProductList;

    res.status(200).send({
      status: 200,
      message: '상세페이지 조회 성공',
      data: response,
    });
  }
}
