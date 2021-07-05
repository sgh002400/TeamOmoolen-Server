import { Column } from 'typeorm';

export class SuitedLens {
  @Column()
  brand: string;

  @Column()
  name: string;

  @Column()
  wearTime: string;
}
