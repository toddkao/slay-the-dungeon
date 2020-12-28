import { computed, makeObservable } from "mobx";
import { IStatus } from "../Common/StatusBar";
import { Howl, HowlOptions } from "howler";
import { Battle, IBattleState } from "../Battle/Battle";
import { isCollidingWithEachOther } from "../Common/utility";
import { Monster } from "../Entities/Monster/Monster";

export enum CardEffectType {
  SPECIFIC_ENEMY,
  ALL_ENEMIES,
  SELF,
  RANDOM,
}

export class Card {
  constructor(private card: ICard) {
    makeObservable(this, {
      manaCost: computed,
      damageInstances: computed,
      damage: computed,
      ref: computed,
    });
  }

  @computed
  public get get() {
    return {
      ...this.card,
      targetSpecificEnemy: this.card.effect === CardEffectType.SPECIFIC_ENEMY,
      targetSelf: this.card.effect === CardEffectType.SELF,
      targetAllEnemies: this.card.effect === CardEffectType.ALL_ENEMIES,
    };
  }

  get manaCost() {
    return this.get.manaCost?.(this.card.upgraded) ?? 0;
  }
  get damageInstances() {
    return this.get.damageInstances?.(this.card.upgraded) ?? 1;
  }
  get damage() {
    return this.get.damage?.(this.card.upgraded) ?? 0;
  }
  get block() {
    return this.get.block?.(this.card.upgraded) ?? 0;
  }
  get status() {
    return this.get.status?.(this.card.upgraded) ?? 0;
  }

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
        case CardEffectType.SPECIFIC_ENEMY:
          if (collisions && !battleState.getMonsterById(collisions.id)?.dead) {
            battleState.selectMonster([collisions.id]);
          } else {
            battleState.selectMonster();
          }
          return;
        case CardEffectType.ALL_ENEMIES:
        case CardEffectType.RANDOM:
          battleState.selectAllMonsters();
          return;
        case CardEffectType.SELF:
          battleState.selectedSelf = true;
          return;
        default:
          break;
      }
    }
    battleState.selectedSelf = false;
    battleState.selectMonster();
  };

  public onReleaseDrag = () => {
    const battleState = Battle.get();
    const cardBoundingRect = this.ref?.current?.getBoundingClientRect();
    const { top } = cardBoundingRect;

    if (window.innerHeight / top > 1.7) {
      switch (this.card.effect) {
        case CardEffectType.SELF:
          battleState.playSelectedCard();
          break;
        case CardEffectType.SPECIFIC_ENEMY:
        case CardEffectType.ALL_ENEMIES:
        case CardEffectType.RANDOM:
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
  ATTACK = 'Attack',
  SKILL = 'Skill',
}

export interface ICard {
  id?: string;
  name: string;
  type: CardType;
  effect: CardEffectType;
  upgraded: boolean;
  cardSelection?: {
    amount: number;
    from: () => Card[];
    selectCards: (cards: Card[]) => void;
  };
  specialEffect?: Function;
  rarity: CardRarity;
  // assets
  image: {
    src: string;
    position: [number, number];
    width: number;
    height: number;
  };
  audio?: string[];
  ref?: React.MutableRefObject<any>;
  prerequisite?: (battleState: IBattleState) => boolean;
  manaCost: (upgraded?: boolean) => number;
  damage?: (upgraded?: boolean, target?: Monster) => number;
  damageInstances?: (upgraded?: boolean) => number;
  block?: (upgraded?: boolean) => number;
  status?: (upgraded?: boolean) => IStatus;
  description:
    | ((upgraded: boolean) => string)
    | ((
        upgraded: boolean,
        card: Card,
        selected: boolean,
        target?: Monster
      ) => string);
}

export enum CardRarity {
  STARTER,
  COMMON,
  UNCOMMON,
  RARE,
}
