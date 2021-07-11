import { Column } from 'typeorm';

export class SuitedLens {
  @Column()
  lensName: string;

  @Column()
  wearTime: string;
}
