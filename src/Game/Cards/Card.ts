import { computed } from "mobx";
import { IStatus } from "../Common/StatusBar";
import { Howl } from "howler";

export class Card {
  constructor(private card: ICard) { };

  @computed
  public get get() {
    return {
      ...this.card,
      targetSelf: !this.card.targetEnemy,
    };
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

  public evaluateDamage = (arg0: any) => {
    return ((typeof this.card.damage === 'function' ? this.card.damage(arg0) : this.card.damage) ?? 0);
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
  id: any;
  name: string;
  manaCost: number;
  type: CardType;
  effect: CardEffectType;
  damage?: number | ((arg0: any) => number);
  status?: IStatus;
  block?: number;
  special?: Function;

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