import { Column, Entity, ManyToMany, ObjectID, ObjectIdColumn } from 'typeorm';
import { WantedLens } from './embedded/WantedLens';
import { SuitedLens } from './embedded/SuitedLens';
import { Guide } from './Guide';
import { Tip } from './Tip';

@Entity()
export class Users {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  oauthKey: string;

  @Column()
  name: string;

  @Column()
  gender: string;

  @Column()
  age: number;

  @Column((type) => WantedLens)
  wantedLens: WantedLens;

  @Column((type) => SuitedLens)
  suitedLens: SuitedLens;

  // @ManyToMany(() => Product, (product) => product.favoriteUserList)
  // favoriteList: Product[];

  // @ManyToMany(() => Guide, (guide) => guide.scrapUserList)
  // scrapGuideList: Guide[];
  //
  // @ManyToMany(() => Tip, (tip) => tip.scrapUserList)
  // scrapTipList: Tip[];
}
