import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class ProductDetailResponseDto {
  public imageURL;
  public brand;
  public name;
  public price;
  public diameter;
  public changeCycleMinimum;
  public changeCycleMaximum;
  public material;
  public function;
  public color;
  public otherColorList;
  public suggestList;
  public popularList;
}
