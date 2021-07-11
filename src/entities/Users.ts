import {
  Column,
  Entity,
  ManyToMany,
  ObjectID,
  ObjectIdColumn,
  OneToMany,
} from 'typeorm';
import { WantedLens } from './embedded/WantedLens';
import { SuitedLens } from './embedded/SuitedLens';
import { Products } from './Products';
import { Guides } from './Guides';
import { Tips } from './Tips';


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

  @ManyToMany(() => Products, (product) => product.favoriteUserList)
  favoriteList: Products[];

  @ManyToMany(() => Guides, (guide) => guide.scrapUserList)
  scrapGuideList: Guides[];

  @ManyToMany(() => Tips, (tip) => tip.scrapUserList)
  scrapTipList: Tips[];
}