import { action, computed, makeObservable, observable } from "mobx";
import { IStatus } from "../Common/StatusBar";
import { BattleState, IBattleState } from "../Battle/BattleState";
import { isCollidingWithEachOther, playAudioClip } from "../Common/utility";
import { MonsterState } from "../Entities/Monster/MonsterState";
import { maxBy } from "lodash";
import { cardMap, CardRarity } from "./CardDefinitions";

export enum CardEffectType {
  SPECIFIC_ENEMY,
  ALL_ENEMIES,
  SELF,
  RANDOM,
}

export class CardState {
  @observable
  card: ICardWithId;

  constructor({
    name,
    id,
    upgraded,
  }: {
    name: string;
    id: string;
    upgraded: boolean;
  }) {
    this.card = {
      ...cardMap[name],
      id,
      upgraded,
    };
  }

  @computed
  get id() {
    return this.card.id;
  }
  set id(id: string) {
    this.card.id = id;
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

  @computed
  get manaCost() {
    return this.card.manaCost?.(this.card.upgraded) ?? 0;
  }

  @computed
  get damageInstances() {
    return this.card.damageInstances?.(this.card.upgraded) ?? 1;
  }

  @computed
  get damage() {
    return (
      this.card.damage?.({
        upgraded: this.card.upgraded,
        selected: BattleState.get().selectedCardId === this.id,
      }) ?? 0
    );
  }
  get block() {
    return (
      this.card.block?.({
        upgraded: this.card.upgraded,
        selected: BattleState.get().selectedCardId === this.id,
      }) ?? 0
    );
  }
  get status() {
    return this.card.status?.(this.card.upgraded) ?? 0;
  }

  @computed
  get ref(): React.MutableRefObject<any> | undefined {
    return this.card.ref;
  }
  set ref(ref: React.MutableRefObject<any> | undefined) {
    this.card.ref = ref;
  }

  get cardSelection() {
    return this.card.cardSelection?.(this.card.upgraded);
  }

  @computed
  get upgraded() {
    return this.card.upgraded;
  }

  upgradeCard = action(() => {
    this.card.upgraded = true;
  });

  public selectable = () => {
    return this.card.prerequisite
      ? this.card.prerequisite(BattleState.get())
      : true;
  };

  public select = () => {
    const battle = BattleState.get();
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
        await playAudioClip(audioClip);
      }
    }
  };

  public onDrag = action(() => {
    const battleState = BattleState.get();
    const cardBoundingRect = this.ref?.current?.getBoundingClientRect();

    if (!cardBoundingRect?.top) {
      return;
    }
    const collisions = battleState.monstersWithBoundingRef
      ?.filter((monster) => !battleState.getMonsterById(monster.id)?.dead)
      .map((monster) => {
        const collision = isCollidingWithEachOther(
          cardBoundingRect,
          monster.boundingRect
        );
        if (collision.collides) {
          return {
            id: monster.id,
            amount: collision.amount,
          };
        }
        return undefined;
      })
      .filter((collision) => collision);

    const collision = maxBy(collisions, (collision) => collision?.amount);

    if (window.innerHeight / cardBoundingRect.top > 1.7) {
      switch (this.card.effect) {
        case CardEffectType.SPECIFIC_ENEMY:
          if (collisions && !battleState.getMonsterById(collision?.id || '')?.dead) {
            battleState.selectMonster([collision?.id || '']);
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
  });

  public onReleaseDrag = action((event: any) => {
    const battleState = BattleState.get();
    const cardBoundingRect = this.ref?.current?.getBoundingClientRect();

    // event.button 0 = left click, 2 = right click
    if (!cardBoundingRect?.top || event.button === 2) {
      event.preventDefault();
      return;
    }
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
  });
}

export enum CardType {
  ATTACK = "Attack",
  SKILL = "Skill",
}

export interface ICard {
  id?: string;
  name: string;
  type: CardType;
  effect: CardEffectType;
  upgraded: boolean;
  cardSelection?: (
    upgraded?: boolean
  ) =>
    | {
        amount: number;
        from: () => CardState[];
        selectCards: (cards: CardState[]) => void;
      }
    | undefined;
  specialEffect?: (args?: any) => any;
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
  damageInstances?: (upgraded?: boolean) => number;
  status?: (upgraded?: boolean) => IStatus;

  damage?: (prop: IEvaluatedCardProperty) => number;
  block?: (prop: IEvaluatedCardProperty) => number;
  description: (prop: IEvaluatedCardProperty) => string;
}

export interface ICardWithId extends ICard {
  id: string;
}

export interface IEvaluatedCardProperty {
  damage?: number;
  block?: number;
  upgraded: boolean;
  selected: boolean;
  includeStatuses?: boolean;
  target?: MonsterState;
}
