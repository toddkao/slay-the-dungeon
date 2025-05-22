import { CardState } from "../../Cards/CardState";

export interface IReward {
  id: string;
  type: RewardTypes;
  cards: CardState[];
  gold?: number;
  potion?: string;
}

export enum RewardTypes {
  CARD,
  POTION,
  GOLD,
  RELIC,
  HEALTH,
}
