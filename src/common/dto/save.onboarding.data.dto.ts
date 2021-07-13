import { SuitedLensDto } from './suitedLens.dto';
import { WantedLensDto } from './wantedLens.dto';

export class saveOnBoardingDataDto {
  public gender: string;

  public age: number;

  public wearTime: string;

  public wantedLens: WantedLensDto;

  public suitedLens: SuitedLensDto;
}
