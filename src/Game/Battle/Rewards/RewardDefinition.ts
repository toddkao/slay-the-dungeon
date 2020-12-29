import { CardState } from "../../Cards/CardState";

export interface IReward {
  id: string;
  type: RewardTypes;
  cards: CardState[];
  // TODO add more reward types
}

export enum RewardTypes {
  CARD,
  POTION,
  GOLD,
}
