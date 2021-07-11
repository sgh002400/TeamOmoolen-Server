import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class ProductDetailResponseDto {

  public imageURL;
  public brand;
  public name;
  public price;
  public diameter;
  public changeCycle;
  public material;
  public function;
  public colorList;
  public suggestList;
  public popularList;
}
