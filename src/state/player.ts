import { atom } from 'jotai';
import { uniqueId, range } from 'lodash';
import { ICardWithId } from '../Game/Cards/CardState';
import { cardMap } from '../Game/Cards/CardDefinitions';
import { IStatus } from '../Game/Common/StatusBar';

export enum PlayerClass {
  IRONCLAD,
  SILENT,
}

export interface PlayerState {
  id: string;
  health: number;
  maxHealth: number;
  block: number;
  maxMana: number;
  class: PlayerClass;
  statuses: IStatus[];
  deck: ICardWithId[];
}

const createDefaultDeck = () => [
  ...range(0, 5).map(() => ({ ...cardMap['Strike'], id: uniqueId() })),
  ...range(0, 4).map(() => ({ ...cardMap['Defend'], id: uniqueId() })),
  { ...cardMap['Bash'], id: uniqueId() },
];

const initialPlayerState: PlayerState = {
  id: uniqueId(),
  health: 80,
  maxHealth: 80,
  block: 0,
  maxMana: 3,
  class: PlayerClass.IRONCLAD,
  statuses: [],
  deck: createDefaultDeck(),
};

export const playerAtom = atom<PlayerState>(initialPlayerState);

export const initializeBattleAtom = atom(null, (get, set) => {
  const current = get(playerAtom);
  set(playerAtom, { ...current, block: 0, statuses: [] });
});

export const addCardToDeckAtom = atom(null, (get, set, cardName: string) => {
  const card = { ...cardMap[cardName], id: uniqueId() } as ICardWithId;
  const current = get(playerAtom);
  set(playerAtom, { ...current, deck: [...current.deck, card] });
});
