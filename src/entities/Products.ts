import { ManyToOne } from 'typeorm';
import { OneToMany } from 'typeorm';
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
  color: string;

  @Column()
  otherColorList: Array<string>;

  @Column()
  price: number;

  @Column()
  brand: string;

  @Column()
  releaseDate: Date;

  @Column()
  diameter: number; // 직경

  @Column()
  changeCycleMinimum: number; // 주기 최소값

  @Column()
  changeCycleMaximum: number; // 주기 최대값

  @Column()
  changeCycleRange: number;

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
