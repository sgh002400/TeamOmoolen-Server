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
  category: string; //컬러인지 투명인지 코스프레인지

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
  changeCycle: number; // 주기

  @Column()
  pieces: number; // 개수

  @Column()
  function: string; // 기능 - 근시, 난시, 다초점, 없음

  @Column()
  visionMinimum: number;

  @Column()
  visionMaximum: number;

  @Column()
  searchCount: number;


  @Column((type) => Products)
  suggestList: Products[];

  @ManyToMany(() => Users, (user) => user.favoriteList)
  @JoinTable({
    name: 'favorite',
    joinColumn: {
      name: 'ProductId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'UserId',
      referencedColumnName: 'id',
    },
  })
  favoriteUserList: Users[];
}
