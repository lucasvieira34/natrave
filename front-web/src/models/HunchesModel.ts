export interface HunchesModel {
  name: string;
  hunches: Hunch[];
}

export interface Hunch {
  id: string;
  userId: string;
  gameId: string;
  homeTeamScore: number;
  awayTeamScore: number;
  createdAt: Date;
  updatedAt: Date;
}
