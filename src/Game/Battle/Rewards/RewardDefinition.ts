import { Card } from "../../Cards/Card";

export interface IReward {
  id: string;
  type: RewardTypes;
  cards: ((id: string) => Card)[];
  // TODO add more reward types
}

export enum RewardTypes {
  card,
  potion,
  gold,
}