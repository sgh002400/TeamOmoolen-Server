import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ObjectID,
  ObjectIdColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class Product {
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
  astigmatismPossible: boolean;

  @Column()
  visionMinimum: number;

  @Column()
  visionMaximum: number;

  @Column((type) => Product)
  suggestList: Product[];

  @ManyToMany(() => User, (user) => user.favoriteList)
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
  favoriteUserList: User[];
}
