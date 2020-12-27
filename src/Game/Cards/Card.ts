import { computed } from "mobx";
import { IStatus } from "../Common/StatusBar";
import { Howl, HowlOptions } from "howler";
import { Battle, IBattleState } from "../Battle/Battle";
import { isCollidingWithEachOther } from "../Common/utility";

export enum CardEffectType {
  SpecificEnemy,
  AllEnemies,
  Self,
  Random,
}

export class Card {
  constructor(private card: ICard) {}

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

  public playAudioClips = async () => {
    // TODO stop currently playing audio clips when beginning 
    // to play a new set of audio clips
    if (this.get.audio !== undefined) {
      for (const audioClip of this.get.audio) {
        await Card.playAudioClip(audioClip);
      }
    }
  };

  public static playAudioClip = (src: string, options?: HowlOptions) => {
    const sound = new Howl({
      src: [src],
      ...options,
    });

    return new Promise((resolve) => {
      sound.on("end", () => {
        resolve(sound);
      });
      sound.play();
    });
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

  public onDrag = () => {
    const battleState = Battle.get();
    const cardBoundingRect = this.ref?.current?.getBoundingClientRect();
    const { top } = cardBoundingRect;
    const collisions = battleState.monstersWithBoundingRef
      ?.filter((monster) => !battleState.getMonsterById(monster.id)?.dead)
      .find((monster) =>
        isCollidingWithEachOther(cardBoundingRect, monster.boundingRect)
      );
    if (window.innerHeight / top > 1.7) {
      switch (this.card.effect) {
        case CardEffectType.SpecificEnemy:
          if (collisions && !battleState.getMonsterById(collisions.id)?.dead) {
            battleState.selectMonster([collisions.id]);
          } else {
            battleState.selectMonster();
          }
          return;
        case CardEffectType.AllEnemies:
        case CardEffectType.Random:
          battleState.selectAllMonsters();
          return;
        case CardEffectType.Self:
          battleState.selectedSelf = true;
          break;
        default:
          break;
      }
    }
    battleState.selectMonster();
  };

  public onReleaseDrag = () => {
    const battleState = Battle.get();
    const cardBoundingRect = this.ref?.current?.getBoundingClientRect();
    const { top } = cardBoundingRect;

    if (window.innerHeight / top > 1.7) {
      switch (this.card.effect) {
        case CardEffectType.Self:
          battleState.playSelectedCard();
          break;
        case CardEffectType.SpecificEnemy:
        case CardEffectType.AllEnemies:
        case CardEffectType.Random:
        default:
          if (
            (battleState.selectedMonsterIds?.length || 0) > 0 &&
            !battleState.wonBattle
          ) {
            battleState.playSelectedCard();
          }
          break;
      }
    }
  };
}

export enum CardType {
  Attack = "Attack",
  Skill = "Skill",
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
  cardSelection?: {
    amount: number;
    from: () => Card[];
    selectCards: (cards: Card[]) => void;
  };
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
  audio?: string[];
  ref?: React.MutableRefObject<any>;
}

export enum CardRarity {
  starter,
  common,
  uncommon,
  rare,
}
