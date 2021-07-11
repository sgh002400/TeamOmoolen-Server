import { Column } from 'typeorm';

export class WantedLens {
  @Column()
  category: string;

  @Column()
  color: Array<number>;

  @Column()
  function: Array<string>;

  @Column()
  changeCycle: Array<number>;

  @Column()
  brand: string;
}
