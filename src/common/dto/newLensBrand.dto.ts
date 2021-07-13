import { Products } from '../../entities/Products';

export class newLensBrandDto {
  public name: string;
  public products: Array<Products>;

  constructor(name: string, products: Array<Products>) {
    this.name = name;
    this.products = products;
  }
}
