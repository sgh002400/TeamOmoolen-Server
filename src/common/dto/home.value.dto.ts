import { Events } from 'src/entities/Events';
import { Guides } from 'src/entities/Guides';
import { Products } from 'src/entities/Products';

export class HomeValueDto {
  public username: string;

  public recommendationByUser: Array<Products>;

  public guides: Array<Guides[]>;

  public season: string;

  public recommendationBySeason: Array<Products>;

  public deadlineEvent: Array<Events>;

  public newLens;

  public situation: string;

  public recommendationBySituation: Array<Products>;

  public lastestEvent: Array<Events>;
}
