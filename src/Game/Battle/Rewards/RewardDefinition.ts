import { Card } from "../../Cards/Card";

export interface IReward {
  id: string;
  type: RewardTypes;
  cards: () => Card[];
  // TODO add more reward types
}

export enum RewardTypes {
  card,
  potion,
  gold,
}
