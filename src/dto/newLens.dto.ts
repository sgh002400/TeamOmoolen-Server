import { ObjectID } from "typeorm";

export class NewLensDto {

  public id: ObjectID;

  public name: string;

  public imageList: Array<string>;

  public category: string;

  public color: number;

  public otherColorList: Array<number>

  public price: number;

  public brand: string;

  public releaseDate: Date;

  public diameter: number;

  public changeCycle: number;

  public pieces: number;

  public function: string;

  public visionMinimum: number;

  public searchCount: number;

  
}