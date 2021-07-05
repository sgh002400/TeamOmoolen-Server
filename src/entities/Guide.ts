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
import { User } from './User';

@Entity()
export class Guide {
  @ObjectIdColumn()
  id: ObjectID;

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

  @ManyToMany(() => User, (user) => user.scrapGuideList)
  @JoinTable({
    name: 'ScrapGuide',
    joinColumn: {
      name: 'GuideId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'UserId',
      referencedColumnName: 'id',
    },
  })
  scrapUserList: User[];
}
