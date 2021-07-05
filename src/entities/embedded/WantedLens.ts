import { Column } from 'typeorm';

export class WantedLens {
  @Column()
  category: string;

  @Column()
  color: string;

  @Column()
  function: string;

  @Column()
  changeCycle: number;
}
