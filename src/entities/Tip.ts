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
export class Tip {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  image: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;

  @ManyToMany(() => User, (user) => user.scrapTipList)
  @JoinTable({
    name: 'ScrapTip',
    joinColumn: {
      name: 'TipId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'UserId',
      referencedColumnName: 'id',
    },
  })
  scrapUserList: User[];
}
