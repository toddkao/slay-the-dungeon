import { slot } from 'ts-event-bus'
import { CardState } from '../Game/Cards/CardState'
import { createEventBus } from "ts-event-bus";

export const Events = {
  cardPlayed: slot<{card: CardState}>(),
  cancelDrag: slot(),
  healthAtOrBelowHalf: slot<{monsterId: string}>(),
}

export const AppEvent = createEventBus({
  events: Events,
});