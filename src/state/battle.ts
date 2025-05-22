import { atom } from 'jotai';
import { CardState } from '../Game/Cards/CardState';
import { MonsterState } from '../Game/Entities/Monster/MonsterState';
import { PlayerState } from './player';

export interface BattleState {
  selectedCardId?: string;
  selectedMonsterIds?: string[];
  selectedSelf?: boolean;
  monsters?: MonsterState[];
  currentHand: CardState[];
  currentMana: number;
  drawPile: CardState[];
  discardPile: CardState[];
  exhaustPile: CardState[];
}

const initialBattleState: BattleState = {
  selectedCardId: undefined,
  selectedMonsterIds: undefined,
  selectedSelf: undefined,
  monsters: undefined,
  currentHand: [],
  currentMana: 3,
  drawPile: [],
  discardPile: [],
  exhaustPile: [],
};

export const battleAtom = atom<BattleState>(initialBattleState);

export const setSelectedCardAtom = atom(null, (get, set, id?: string) => {
  const current = get(battleAtom);
  set(battleAtom, { ...current, selectedCardId: id });
});
