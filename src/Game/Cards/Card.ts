import { computed } from "mobx";
import { IStatus } from "../Common/StatusBar";
import { Howl } from "howler";
import { Battle, IBattleState } from "../Battle/Battle";
import { uniqueId } from "lodash";
import { isCollidingWithEachOther } from "../Common/utility";

export class Card {
  constructor(private card: ICard) { }

  @computed
  public get get() {
    return {
      ...this.card,
      targetSpecificEnemy: this.card.effect === CardEffectType.SpecificEnemy,
      targetSelf: this.card.effect === CardEffectType.Self,
      targetAllEnemies: this.card.effect === CardEffectType.AllEnemies,
    };
  }

  @computed
  get ref(): React.MutableRefObject<any> | undefined {
    return this.card.ref;
  }
  set ref(ref: React.MutableRefObject<any> | undefined) {
    this.card.ref = ref;
  }

  public selectable = () => {
    return this.card.prerequisite ? this.card.prerequisite(Battle.get()) : true;
  };

  public select = () => {
    const battle = Battle.get();
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
    console.log("play audio clip");
    Battle.get().callNextAction();
  };

  public evaluateDamage = () => {
    return (
      (typeof this.card.damage === "function"
        ? this.card.damage()
        : this.card.damage) ?? 0
    );
  };

  public evaluateBlock = () => {
    return (
      (typeof this.card.block === "function"
        ? this.card.block()
        : this.card.block) ?? 0
    );
  };

  public onReleaseDrag = () => {
    const battleState = Battle.get();
    const cardBoundingRect = this.ref?.current?.getBoundingClientRect();
    const { top } = cardBoundingRect;

    if (
      window.innerHeight / top > 1.7 &&
      (this.get.targetAllEnemies || this.get.targetSelf)
    ) {
      battleState.playSelectedCard();
    } else {
      const collisions = battleState.monstersWithBoundingRef?.find((monster) =>
        isCollidingWithEachOther(cardBoundingRect, monster.boundingRect)
      );
      if (collisions && !battleState.getMonsterById(collisions.id)?.dead) {
        battleState.selectMonster(collisions.id);
        battleState.playSelectedCard();
      }
    }
  };
}

export enum CardType {
  Attack = "Attack",
  Skill = "Skill",
}

export enum CardEffectType {
  SpecificEnemy,
  AllEnemies,
  Self,
  Random,
}

export interface ICard {
  id?: string;
  name: string;
  manaCost: number;
  type: CardType;
  effect: CardEffectType;
  damage?: number | (() => number);
  damageInstances?: number;
  block?: number | (() => number);
  cardSelection?: { amount: number, from: (() => Card[]), selectCards: ((cards: Card[]) => void) }
  prerequisite?: (battleState: IBattleState) => boolean;
  status?: IStatus;
  specialEffect?: Function;
  rarity: CardRarity;

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
  ref?: React.MutableRefObject<any>;
}

export enum CardRarity {
  starter,
  common,
  uncommon,
  rare,
}
