import { atom } from 'jotai';
import { cardMap, CardRarity } from '../Game/Cards/CardDefinitions';

export enum CardEffectType {
  SPECIFIC_ENEMY,
  ALL_ENEMIES,
  SELF,
  RANDOM,
}

export enum CardType {
  ATTACK = 'Attack',
  SKILL = 'Skill',
}

export interface CardState {
  id: string;
  name: string;
  type: CardType;
  effect: CardEffectType;
  upgraded: boolean;
}

const createCard = (name: string, id: string, upgraded: boolean): CardState => ({
  id,
  name,
  type: cardMap[name].type as CardType,
  effect: cardMap[name].effect,
  upgraded,
});

export const cardAtom = (name: string, id: string, upgraded = false) => atom<CardState>(createCard(name, id, upgraded));
