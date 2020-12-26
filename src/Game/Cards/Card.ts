import { computed } from "mobx";
import { IStatus } from "../Common/StatusBar";
import { Howl } from "howler";
import { Battle, IBattleState } from "../Battle/Battle";
import { uniqueId } from "lodash";

export class Card {
  constructor(private card: ICard) {}

  @computed
  public get get() {
    return {
      ...this.card,
      targetSelf: !this.card.targetEnemy,
    };
  }

  public selectable = () => {
    return this.card.prerequisite ? this.card.prerequisite(new Battle()) : true;
  };

  public select = () => {
    const battle = new Battle();
    battle.selectCard(undefined);
    if (this.selectable()) {
      battle.selectCard(this.get.id);
    }
  };

  public playAudioClip = () => {
    if (this.get.audio) {
      const sound = new Howl({
        src: this.get.audio,
        volume: 0.5,
      });
      sound.play();
    }
  };

  public evaluateDamage = () => {
    return (
      (typeof this.card.damage === "function"
        ? this.card.damage()
        : this.card.damage) ?? 0
    );
  };
}

export enum CardType {
  Attack = "Attack",
  Skill = "Skill",
}

export enum CardEffectType {
  SingleTarget,
  MultiTarget,
  AddBlock,
}

export interface ICard {
  id?: string;
  name: string;
  manaCost: number;
  type: CardType;
  effect: CardEffectType;
  damage?: number | (() => number);
  prerequisite?: (battleState: IBattleState) => boolean;
  status?: IStatus;
  block?: number;
  special?: Function;
  rarity: CardRarity;
  targetEnemy: boolean;

  description: string;
  descriptionVariables?: string[];
  // assets
  image: {
    src: string;
    position: [number, number];
    width: number;
    height: number;
  };
  audio?: string;
}

export enum CardRarity {
  starter,
  common,
  uncommon,
  rare,
}
