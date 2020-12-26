import { computed, observable } from "mobx";
import { Card } from "../../Cards/Card";
import { range, times, uniqueId } from "lodash";
import { Singleton } from "@taipescripeto/singleton";
import { Entity, IEntity } from "../entity";
import { StatusType } from "../../Common/StatusBar";
import { cardMap } from "../../Cards/CardDefinitions";

export enum PlayerClass {
  Ironclad,
  Silent,
}

@Singleton()
export class Player extends Entity {
  constructor(
    private stats: IPlayer = observable({
      health: 80,
      maxHealth: 80,
      statuses: [],
      maxMana: 3,
      class: PlayerClass.Ironclad,
      deck: [],
      block: 0,
      damage: 0,
      id: uniqueId(),
    })
  ) {
    super(stats);
    // times(6, () => stats.deck.push(cardMap.bash(uniqueId())));
        // times(6, () => stats.deck.push(cardMap.defend(uniqueId())));
    // times(6, () => stats.deck.push(cardMap.anger(uniqueId())));
    // times(6, () => stats.deck.push(cardMap.bodySlam(uniqueId())));
    // times(6, () => stats.deck.push(cardMap.cleave(uniqueId())));
    // times(6, () => stats.deck.push(cardMap.clothesline(uniqueId())));
    // times(6, () => stats.deck.push(cardMap.flex(uniqueId())));
    range(0, 6).forEach(() => stats.deck.push(cardMap.clash(uniqueId())));
    range(0, 6).forEach(() => stats.deck.push(cardMap.havoc(uniqueId())));
    times(1, () => stats.deck.push(cardMap.strike(uniqueId())));
    // this.addStatus(StatusType.strength, 2);
    // this.addStatus(StatusType.dexterity);
  }

  @computed
  get get() {
    return this.stats;
  }

  @computed
  get maxMana() {
    return this.stats.maxMana;
  }
}

interface IPlayer extends IEntity {
  maxMana: number;
  health: number;
  class: PlayerClass;
  deck: Card[];
}
