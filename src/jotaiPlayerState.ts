import { atom } from 'jotai';
import { uniqueId, range } from 'lodash';
import { IStatus, StatusType, StatusTypeToIStatus } from './Game/Common/StatusBar';
import { cardMap } from './Game/Cards/CardDefinitions';
import { ICardWithId } from './Game/Cards/CardState';
import { playAudioClip } from './Game/Common/utility';

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
  deck: ICardWithId[];
  statuses: IStatus[];
}

const initialPlayerState: PlayerState = {
  id: uniqueId(),
  health: 80,
  maxHealth: 80,
  block: 0,
  maxMana: 3,
  class: PlayerClass.IRONCLAD,
  deck: [
    ...range(0, 5).map(() => ({ ...cardMap['Strike'], id: uniqueId() })),
    ...range(0, 4).map(() => ({ ...cardMap['Defend'], id: uniqueId() })),
    { ...cardMap['Bash'], id: uniqueId() },
  ],
  statuses: [],
};

export const playerAtom = atom<PlayerState>(initialPlayerState);

export const playerStrengthAtom = atom((get) =>
  get(playerAtom).statuses.find((s) => s.type === StatusType.STRENGTH)?.amount || 0
);

export const playerDexterityAtom = atom((get) =>
  get(playerAtom).statuses.find((s) => s.type === StatusType.DEXTERITY)?.amount || 0
);

export const playerDamageMultiplierAtom = atom((get) =>
  get(playerAtom).statuses.find((s) => s.type === StatusType.WEAK) ? 0.75 : 1
);

export const playerBlockMultiplierAtom = atom(() => 1);

export const addStatusAtom = atom(null, (get, set, { type, amount = 1 }: { type: StatusType; amount?: number }) => {
  const player = get(playerAtom);
  const existing = player.statuses.find((s) => s.type === type);
  if (existing) {
    set(playerAtom, {
      ...player,
      statuses: player.statuses.map((s) =>
        s.type === type ? { ...s, amount: s.amount + amount } : s
      ),
    });
  } else {
    set(playerAtom, {
      ...player,
      statuses: [
        ...player.statuses,
        {
          type,
          amount,
          degrades: StatusTypeToIStatus[type]?.degrades,
          fleeting: StatusTypeToIStatus[type]?.fleeting,
        },
      ],
    });
  }
  playAudioClip(StatusTypeToIStatus[type]?.audio);
});

export const removeStatusAtom = atom(null, (get, set, args: { type: StatusType; amount?: number }) => {
  const { type, amount = -1 } = args;
  set(addStatusAtom, { type, amount: amount * -1 });
});

export const clearBlockAtom = atom(null, (get, set) => {
  const player = get(playerAtom);
  set(playerAtom, { ...player, block: 0 });
});

export const addBlockAtom = atom(null, (get, set, amount: number) => {
  const player = get(playerAtom);
  const dexBonus = get(playerDexterityAtom);
  set(playerAtom, { ...player, block: player.block + amount + dexBonus });
});

export const takeDamageAtom = atom(null, (get, set, amount: number) => {
  const player = get(playerAtom);
  let { block, health } = player;
  if (block > amount) {
    block -= amount;
  } else if (block + health > amount) {
    health -= amount - block;
    block = 0;
  } else {
    health = 0;
    block = 0;
  }
  set(playerAtom, { ...player, block, health });
});

export const resetPlayerAtom = atom(null, (get, set) => {
  const player = get(playerAtom);
  set(playerAtom, { ...player, health: player.maxHealth, block: 0, statuses: [] });
});

export const initializeBattleAtom = atom(null, (get, set) => {
  const player = get(playerAtom);
  set(playerAtom, { ...player, block: 0, statuses: [] });
});

export const addCardToDeckAtom = atom(null, (get, set, cardName: string) => {
  const player = get(playerAtom);
  const card = {
    ...cardMap[cardName],
    id: uniqueId(),
  };
  set(playerAtom, { ...player, deck: [...player.deck, card] });
});
