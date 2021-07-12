import { Column } from 'typeorm';

export class WantedLens {
  @Column()
  category: Array<string>;

  @Column()
  color: Array<string>;

  @Column()
  function: string;

  @Column()
  changeCycleRange: Array<number>;

}
