import { atom } from 'jotai';
import { IStatus } from '../Game/Common/StatusBar';
import { CardState } from '../Game/Cards/CardState';

export enum IntentType {
  SLEEP,
  ATTACK,
  ATTACK_DEBUFF,
  SHIELD,
  GAIN_STRENGTH,
  ENRAGE,
  GOOP_SPRAY,
  NOTHING,
  SPLIT,
  DEBUFF,
}

export interface Intent {
  intentImage: string;
  chance: number;
  type: IntentType;
  amount?: number;
  status?: IStatus;
}

export interface MonsterState {
  id: string;
  name: string;
  health: number;
  maxHealth: number;
  block: number;
  image: { src: string; height: number };
  intent: () => Intent[];
  currentIntent?: Intent;
  onCardPlayed?: (card: CardState) => void;
  statuses: IStatus[];
}

const initialMonsterState = (id: string): MonsterState => ({
  id,
  name: 'Monster',
  health: 0,
  maxHealth: 0,
  block: 0,
  image: { src: '', height: 0 },
  intent: () => [],
  currentIntent: undefined,
  onCardPlayed: undefined,
  statuses: [],
});

export const monsterAtom = (id: string) => atom<MonsterState>(initialMonsterState(id));
