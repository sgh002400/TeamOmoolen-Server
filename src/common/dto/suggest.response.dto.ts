import { Products } from '../../entities/Products';

export class suggestResponseDto {
  public situation: string;
  public season: string;
  public suggestForYouTotalPage: number;
  public suggestForSituationTotalPage: number;
  public suggestForNewTotalPage: number;
  public suggestForSeasonTotalPage: number;
  public suggestForYou: Array<Products>;
  public suggestForSituation: Array<Products>;
  public suggestForNew: Array<Products>;
  public suggestForSeason: Array<Products>;

  constructor(
    situation: string,
    season: string,
    suggestForYouTotalPage: number,
    suggestForSituationTotalPage: number,
    suggestForNewTotalPage: number,
    suggestForSeasonTotalPage: number,
    suggestForYou: Array<Products>,
    suggestForSituation: Array<Products>,
    suggestForNew: Array<Products>,
    suggestForSeason: Array<Products>,
  ) {
    this.situation = situation;
    this.season = season;
    this.suggestForYouTotalPage = suggestForYouTotalPage;
    this.suggestForSituationTotalPage = suggestForSituationTotalPage;
    this.suggestForNewTotalPage = suggestForNewTotalPage;
    this.suggestForSeasonTotalPage = suggestForSeasonTotalPage;
    this.suggestForYou = suggestForYou;
    this.suggestForSituation = suggestForSituation;
    this.suggestForNew = suggestForNew;
    this.suggestForSeason = suggestForSeason;
  }
}