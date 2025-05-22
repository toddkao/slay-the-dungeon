import { atom } from 'jotai'
import { uniqueId } from 'lodash'
import { ICardWithId } from '../../Cards/CardState'
import { cardMap } from '../../Cards/CardDefinitions'
import { IStatus, StatusType } from '../../Common/StatusBar'

export enum PlayerClass {
  IRONCLAD,
  SILENT,
}

export interface PlayerState {
  id: string
  health: number
  maxHealth: number
  block: number
  maxMana: number
  class: PlayerClass
  deck: ICardWithId[]
  statuses: IStatus[]
}

export const initialPlayerState: PlayerState = {
  id: uniqueId(),
  health: 80,
  maxHealth: 80,
  block: 0,
  maxMana: 3,
  class: PlayerClass.IRONCLAD,
  deck: [],
  statuses: [],
}

export const playerAtom = atom(initialPlayerState)

export const playerActions = {
  reset: (get: () => PlayerState, set: (v: PlayerState) => void) => {
    set({ ...initialState, id: get().id })
  },
  initializeBattle: (get: () => PlayerState, set: (v: PlayerState) => void) => {
    const p = get()
    set({ ...p, block: 0, statuses: [] })
  },
  addBlock: (amount: number) => (get: () => PlayerState, set: (v: PlayerState) => void) => {
    const p = get()
    set({ ...p, block: p.block + amount })
  },
  takeDamage: (amount: number) => (get: () => PlayerState, set: (v: PlayerState) => void) => {
    const p = get()
    const remainingBlock = p.block - amount
    if (remainingBlock >= 0) {
      set({ ...p, block: remainingBlock })
    } else {
      const newHealth = Math.max(0, p.health + remainingBlock)
      set({ ...p, block: 0, health: newHealth })
    }
  },
  addCardToDeck: (cardName: string) => (get: () => PlayerState, set: (v: PlayerState) => void) => {
    const p = get()
    const card = { ...cardMap[cardName], id: uniqueId() }
    set({ ...p, deck: [...p.deck, card] })
  },
  addStatus: (type: StatusType, amount = 1) => (get: () => PlayerState, set: (v: PlayerState) => void) => {
    const p = get()
    const status = p.statuses.find(s => s.type === type)
    if (status) {
      status.amount += amount
    } else {
      p.statuses.push({ type, amount, degrades: false })
    }
    set({ ...p, statuses: [...p.statuses] })
  },
}
