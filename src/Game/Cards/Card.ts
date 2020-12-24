import { computed } from "mobx";
import { IStatus } from "../Common/StatusBar";
import { Howl } from "howler";

export class Card {
  constructor(private card: ICard) {};

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
  damage?: number;
  status?: IStatus;
  block?: number;

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
