import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ObjectID,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './Users';

@Entity()
export class Guides {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  category: string;

  @Column()
  question: string;

  @Column()
  answer: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;

  // @ManyToMany(() => Users, (user) => user.scrapGuideList)
  // @JoinTable({
  //   name: 'ScrapGuide',
  //   joinColumn: {
  //     name: 'GuideId',
  //     referencedColumnName: 'id',
  //   },
  //   inverseJoinColumn: {
  //     name: 'UserId',
  //     referencedColumnName: 'id',
  //   },
  // })
  // scrapUserList: Users[];
}
