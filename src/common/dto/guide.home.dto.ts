import { Guides } from '../../entities/Guides';

export class GuideHomeDto {
  public category: string;
  public guides: Array<Guides>;

  constructor(category: string, guides: Array<Guides>) {
    this.category = category;
    this.guides = guides;
  }
}
