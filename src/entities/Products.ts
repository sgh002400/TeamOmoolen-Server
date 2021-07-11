import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ObjectID,
  ObjectIdColumn,
} from 'typeorm';
import { Users } from './Users';

@Entity()
export class Products {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  name: string;

  @Column()
  imageList: string[];

  @Column()
  category: string;

  @Column()
  colorList: number[];

  @Column()
  price: number;

  @Column()
  brand: string;

  @Column()
  releaseDate: Date;

  @Column()
  diameter: number; // 직경

  @Column()
  changeCycle: number; // 주기

  @Column()
  pieces: number; // 개수

  @Column()
  function: string;

  @Column()
  material: string;

  @Column()
  visionMinimum: number;

  @Column()
  visionMaximum: number;

  @ManyToMany(() => Products)
  suggestList: Products[];

  @Column()
  searchCount: number;

  // @ManyToMany(() => Users, (user) => user.favoriteList)
  // @JoinTable({
  //   name: 'favorite',
  //   joinColumn: {
  //     name: 'ProductId',
  //     referencedColumnName: 'id',
  //   },
  //   inverseJoinColumn: {
  //     name: 'UserId',
  //     referencedColumnName: 'id',
  //   },
  // })
  // favoriteUserList: Users[];
}
