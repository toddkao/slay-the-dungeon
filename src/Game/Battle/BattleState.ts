import { clone, random, range, sampleSize, shuffle, uniqueId } from "lodash";
import {
  action,
  computed,
  IReactionDisposer,
  observable,
  reaction,
} from "mobx";
import { CardState, CardEffectType, CardType } from "../Cards/CardState";
import { StatusType } from "../Common/StatusBar";
import { IntentType, MonsterState } from "../Entities/Monster/MonsterState";
import { PlayerState } from "../Entities/Player/PlayerState";
import { MapState } from "../Map/MapState";
import { AppHistory } from "../../Router";
import { playAudioClip } from "../Common/utility";
import { combatVictory } from "../../Audio/Audio";
import { AppEvent } from "../../Events";

enum DeckPosition {
  TOP,
  BOTTOM,
}

export enum PileOfCards {
  DRAW,
  DISCARD,
  EXHAUST,
  HAND,
}

export interface IBattleState {
  selectedCardId: string | undefined;
  selectedMonsterIds?: string[];
  selectedSelf?: boolean;
  monsters: MonsterState[] | undefined;
  currentHand: CardState[];
  currentMana: number;
  drawPile: CardState[];
  discardPile: CardState[];
  exhaustPile: CardState[];
  endTurnActions: Function[];
  cardsToShow?: CardState[];
}
export class BattleState {
  private static instance: BattleState;
  public static get(): BattleState {
    if (!BattleState.instance) BattleState.instance = new BattleState();
    return BattleState.instance;
  }

  public battleReactionDisposer?: IReactionDisposer;

  private constructor(
    private battleState: IBattleState = observable({
      selectedCardId: undefined,
      selectedMonsterIds: undefined,
      selectedSelf: undefined,
      currentMana: PlayerState.get().maxMana,
      monsters: undefined,
      currentHand: [],
      drawPile: [],
      discardPile: [],
      exhaustPile: [],
      endTurnActions: [],
      cardsToShow: undefined,
    })
  ) {}

  @observable
  currentTurn: number = 1;

  @observable
  cardResolveQueue: (() => void)[] = [];

  @observable
  endCombatActions: (() => void)[] = [
    () => MapState.get().battleBgMusic?.stop(),
  ];

  @observable
  cardsPlayed: CardState[] = [];

  @computed
  get wonBattle() {
    return this.monsters !== undefined && this.monstersAlive?.length === 0;
  }

  @computed
  get currentMana() {
    return this.battleState.currentMana;
  }

  @computed
  get targetSelf() {
    return (
      this.selectedCard?.get.targetSpecificEnemy === false ||
      this.selectedCardId === undefined
    );
  }

  @computed
  get targetEnemy() {
    return (
      this.selectedCard?.get.targetSpecificEnemy === true ||
      this.selectedCardId === undefined
    );
  }

  @computed
  get selectedCardId() {
    return this.battleState.selectedCardId;
  }

  @computed
  get endTurnActions() {
    return this.battleState.endTurnActions;
  }

  @computed
  get selectedCard(): CardState | undefined {
    return this.battleState.selectedCardId
      ? this.getCardFromId(this.battleState.selectedCardId)
      : undefined;
  }

  @computed
  get selectedCardManaCost(): number {
    return this.selectedCard?.manaCost ?? 0;
  }

  @computed
  get selectedMonsterIds() {
    return this.battleState.selectedMonsterIds;
  }

  @computed
  get selectedSelf() {
    return this.battleState.selectedSelf;
  }
  set selectedSelf(selected: boolean | undefined) {
    this.battleState.selectedSelf = selected;
  }

  @computed
  get selectedMonsters() {
    return this.monsters?.filter((monster) =>
      this.battleState.selectedMonsterIds?.includes(monster.get.id)
    );
  }

  @computed
  get monsters() {
    return this.battleState.monsters;
  }

  @computed
  get monstersAlive() {
    return this.monsters?.filter((monster) => !monster.dead);
  }

  @computed
  get monstersWithBoundingRef() {
    return this.monsters?.map((monster) => ({
      id: monster.id,
      boundingRect: monster.ref?.current?.getBoundingClientRect(),
    }));
  }

  @computed
  get currentHand() {
    return this.battleState.currentHand;
  }
  set currentHand(cards: CardState[]) {
    this.battleState.currentHand = cards;
  }

  @computed
  get drawPile() {
    return this.battleState.drawPile;
  }
  set drawPile(cards: CardState[]) {
    this.battleState.drawPile = cards;
  }

  @computed
  get discardPile() {
    return this.battleState.discardPile;
  }
  set discardPile(cards: CardState[]) {
    this.battleState.discardPile = cards;
  }

  @computed
  get exhaustPile() {
    return this.battleState.exhaustPile;
  }
  set exhaustPile(cards: CardState[]) {
    this.battleState.discardPile = cards;
  }

  @computed
  get cardsToShow() {
    return this.battleState.cardsToShow;
  }

  public setCardsToShow(cards?: CardState[]) {
    this.battleState.cardsToShow = cards;
  }

  public getMonsterById = (monsterId: string) => {
    return this.monsters?.find((monster) => monster.get.id === monsterId);
  };

  public log = () => {
    console.log(
      "draw",
      this.battleState.drawPile.map((card) => card.id)
    );
    console.log(
      "hand",
      this.battleState.currentHand.map((card) => card.id)
    );
    console.log(
      "discard",
      this.battleState.discardPile.map((card) => card.id)
    );
    console.log(
      "exhaust",
      this.battleState.exhaustPile.map((card) => card.id)
    );
  };

  private getCardFromId = (cardId: string) => {
    return (
      this.currentHand.find((card) => card.id === cardId) ??
      this.drawPile.find((card) => card.id === cardId) ??
      this.exhaustPile.find((card) => card.id === cardId)
    );
  };

  private drawCards = action((cards: CardState[]) => {
    if (
      !cards.every((card) =>
        this.battleState.drawPile
          .map((drawCard) => drawCard.id)
          .includes(card.id)
      )
    ) {
      throw new Error("Trying to draw cards that don't exist in draw pile");
    } else {
      this.moveCards({ cards, from: PileOfCards.DRAW, to: PileOfCards.HAND });
    }
  });

  private initializeMonsters = action(() => {
    const mapState = MapState.get();
    this.setMonsters(mapState.currentEncounter);
  });

  private reshuffleDiscardPile = action(() => {
    this.battleState.drawPile = this.battleState.discardPile;
    this.battleState.discardPile = [];
  });

  private initializeHand = action(() => {
    this.battleState.currentHand = [];
    this.battleState.exhaustPile = [];
    this.battleState.discardPile = [];

    this.battleState.drawPile = PlayerState.get().deck.map((card) => {
      return new CardState(card);
    });
    this.battleState.drawPile = shuffle(this.battleState.drawPile);
    this.draw(5);
  });

  public draw = action((count: number = 1) => {
    let cards: CardState[] = [];
    const cardsFromDrawPile = sampleSize(this.drawPile, count);
    this.drawCards(cardsFromDrawPile);
    const remainingCardsToDraw = count - cardsFromDrawPile.length;
    cards = [...cards, ...cardsFromDrawPile];

    if (remainingCardsToDraw) {
      this.reshuffleDiscardPile();
      const cardsFromDrawPileAfterReshuffling = sampleSize(
        this.drawPile,
        remainingCardsToDraw
      );
      this.drawCards(cardsFromDrawPileAfterReshuffling);
      cards = [...cards, ...cardsFromDrawPileAfterReshuffling];
    }

    return cards;
  });

  private removeCardsFromHand = () => {
    this.moveCards({
      cards: this.currentHand,
      from: PileOfCards.HAND,
      to: PileOfCards.DISCARD,
    });
  };

  public exhaustCards(cards: CardState[]) {
    cards.forEach((card) => {
      this.battleState.drawPile = this.battleState.drawPile.filter(
        (drawCard) => drawCard.id !== card.id
      );
      this.battleState.currentHand = this.battleState.currentHand.filter(
        (handCard) => handCard.id !== card.id
      );
      this.battleState.discardPile = this.battleState.discardPile.filter(
        (exhaustCard) => exhaustCard.id !== card.id
      );
      this.battleState.exhaustPile = [...this.battleState.exhaustPile, card];
    });
  }

  public resolveCardEffect = action(async (card: CardState) => {
    switch (card.get.effect) {
      case CardEffectType.SPECIFIC_ENEMY:
        if (card.damage)
          this.resolveSingleTargetDamage({
            card: card,
            selectedMonster: this.selectedMonsters?.[0],
          });
        if (card.block) {
          PlayerState.get().addBlock(card.block + PlayerState.get().dexterity);
        }
        break;
      case CardEffectType.ALL_ENEMIES:
        this.monsters?.forEach((monster) => {
          if (card.damage) {
            this.resolveSingleTargetDamage({
              card: card,
              selectedMonster: monster,
            });
          }
        });
        break;
      case CardEffectType.SELF:
        if (card.block && card.get.targetSelf) {
          PlayerState.get().addBlock(card.block);
        }
        break;
      case CardEffectType.RANDOM:
        for (const _instance of range(0, card.damageInstances)) {
          if ((this.monstersAlive?.length ?? 0) > 0) {
            await new Promise((resolve) =>
              setTimeout(() => {
                this.resolveSingleTargetDamage({
                  card: card,
                  selectedMonster: this.monstersAlive?.[
                    random(0, this.monstersAlive.length - 1)
                  ],
                });
                this.selectedCard?.playAudioClips();
                resolve(true);
              }, 175)
            );
          }
        }
        this.callNextAction();
        return;
      default:
        break;
    }

    if (card.get.specialEffect) {
      card.get.specialEffect(card.get.upgraded);
    }

    if (card.cardSelection) {
      if (card.cardSelection.from().length <= 1) {
        card.cardSelection.selectCards(card.cardSelection.from());
      } else {
        this.battleState.cardsToShow = card.cardSelection.from();
        return;
      }
    }
    this.selectedCard?.playAudioClips();
    this.callNextAction();
  });

  public static calculateDamage = action(
    ({
      damage,
      target,
    }: {
      damage: number;
      target?: MonsterState | PlayerState;
    }) => {
      const vulnerable = target?.statuses?.find(
        (s) => s.type === StatusType.VULNERABLE
      );
      if (vulnerable && vulnerable.amount && vulnerable.amount >= 1) {
        damage = Math.floor(damage * 1.5);
      }

      return damage;
    }
  );

  private resolveSingleTargetDamage({
    card,
    selectedMonster,
  }: {
    card: CardState;
    selectedMonster?: MonsterState;
  }) {
    if (!selectedMonster && this.monstersAlive) {
      selectedMonster = this.monstersAlive[
        random(0, this.monstersAlive.length - 1)
      ];
    }

    if (card.damage && selectedMonster) {
      selectedMonster.takeDamage(
        BattleState.calculateDamage({
          damage: card.damage + PlayerState.get().strength,
          target: selectedMonster,
        })
      );
      const status = card.status;
      if (status && selectedMonster) {
        switch (status.target) {
          case CardEffectType.SPECIFIC_ENEMY:
            selectedMonster.addStatus(status.type, status.amount);
            break;
          case CardEffectType.ALL_ENEMIES:
            this.monstersAlive?.forEach((monster) =>
              monster.addStatus(status.type, status.amount)
            );
            break;
          case CardEffectType.RANDOM:
            this.monstersAlive?.[
              random(0, this.monstersAlive.length - 1)
            ].addStatus(status.type, status.amount);
            break;
          default:
            break;
        }
      }
    }
  }

  private resolveMonsterActions = action(() => {
    this.monstersAlive?.forEach((monster) => {
      const { strength } = monster;
      const { currentIntent } = monster.get;
      switch (currentIntent?.type) {
        case IntentType.ATTACK_DEBUFF:
          PlayerState.get().takeDamage(
            BattleState.calculateDamage({
              damage: (currentIntent.amount ?? 0) + strength,
              target: PlayerState.get(),
            })
          );
          if (!currentIntent?.status?.type || !currentIntent?.status?.amount) {
            return;
          }
          PlayerState.get().addStatus(
            currentIntent.status?.type,
            currentIntent.status?.amount
          );
          break;
        case IntentType.ATTACK:
          PlayerState.get().takeDamage(
            BattleState.calculateDamage({
              damage: (currentIntent.amount ?? 0) + strength,
              target: PlayerState.get(),
            })
          );
          break;
        case IntentType.GAIN_STRENGTH:
          if (currentIntent.amount) {
            monster.addStatus(StatusType.STRENGTH, currentIntent.amount);
          }
          break;
        case IntentType.ENRAGE:
          if (currentIntent.amount) {
            monster.addStatus(StatusType.ENRAGE, currentIntent.amount);
            const unsubscribe = AppEvent.cardPlayed.on(({ card }) => {
              if (card.get.type === CardType.SKILL) {
                monster.addStatus(StatusType.STRENGTH, currentIntent.amount);
              }
            });
            this.endCombatActions.push(() => unsubscribe());
          }
          break;
        default:
          break;
      }
      if (PlayerState.get().health <= 0) {
        this.resolveEndCombatActions();
        AppHistory.push("/defeat");
      }
      this.endTurnActions.push(
        ...[() => monster.updateStatuses(), () => monster.pickRandomIntent()]
      );
    });
  });

  private resolvePlayerActions = action(() => {
    const player = PlayerState.get();

    this.endTurnActions.push(
      ...[() => player.updateStatuses(), () => player.clearBlock()]
    );
  });

  private resolveGameActions = action(() => {
    this.battleState.currentMana = PlayerState.get().maxMana;
    this.removeCardsFromHand();
    this.selectCard();
    this.draw(5);
  });

  private resolveEndTurnActions() {
    this.battleState.endTurnActions.forEach((action) => action());
    this.battleState.endTurnActions = [];
  }

  private useMana = action((amount: number) => {
    if (amount <= this.currentMana) {
      this.battleState.currentMana -= amount;
    }
    this.callNextAction();
  });

  public callNextAction = action(() => {
    const nextAction = this.cardResolveQueue.shift();
    nextAction?.();
  });

  public initializeCardResolveQueue = action(() => {
    // TODO
    // Think about a way to allow cards to decide whether
    // it shoud move to the discard pile before or after resolving?
    this.cardResolveQueue = [];
    this.cardResolveQueue.push(
      () => this.useMana(this.selectedCardManaCost),
      () => this.resolveCardEffect(this.selectedCard as CardState),
      () => {
        this.cardsPlayed.push(this.selectedCard as CardState);
        AppEvent.cardPlayed({ card: this.selectedCard as CardState });
        this.moveCards({
          cards: [this.selectedCard as CardState],
          from: PileOfCards.HAND,
          to: PileOfCards.DISCARD,
        });
        this.callNextAction();
      },
      () => {
        this.selectCard();
        this.callNextAction();
      },
      () => {
        this.selectMonster();
        this.selectedSelf = false;
        this.callNextAction();
      }
    );
  });

  public playSelectedCard = action(() => {
    if (
      // Ensure a card is selected
      !this.selectedCardId ||
      !this.selectedCard ||
      // Ensure you have enough mana to cast the card
      this.selectedCardManaCost > this.currentMana ||
      // Make sure previous card isn't in the process of resolving

      // TODO maybe instead just push the new card onto the queue?
      // need to check in game and think about the best way to handle it
      // currentlySelectedCard / currentlySelectedMonster would have to be
      // re-designed to be attached to card themselves instead of battleState
      this.cardResolveQueue.length !== 0
    ) {
      return;
    }
    this.initializeCardResolveQueue();
    this.callNextAction();
  });

  public endTurn = action(() => {
    this.resolveMonsterActions();
    this.resolvePlayerActions();
    this.resolveGameActions();

    this.currentTurn++;
    this.resolveEndTurnActions();
  });

  public initialize = action(() => {
    PlayerState.get().initializeBattle();
    this.initializeMonsters();
    this.initializeHand();
    this.battleState.cardsToShow = undefined;
    this.battleState.currentMana = PlayerState.get().maxMana;

    this.battleReactionDisposer = reaction(
      () => this.wonBattle,
      () => {
        if (this.wonBattle) {
          this.resolveEndCombatActions();
          playAudioClip(combatVictory);
        }
      }
    );
  });

  public endCombat = () => {
    this.resolveEndCombatActions();
  };

  public resolveEndCombatActions = () => {
    this.endCombatActions.forEach((action) => action());
  };

  selectCard = action((id?: string) => {
    this.battleState.selectedCardId = id;
    this.selectMonster();
  });

  selectMonster = action((ids?: string[]) => {
    this.battleState.selectedMonsterIds = ids;
  });

  selectAllMonsters = action(() => {
    this.battleState.selectedMonsterIds = this.monsters?.map(
      (monster) => monster.get.id
    );
  });

  setMonsters = action((monsters?: MonsterState[]) => {
    this.battleState.monsters = monsters;
  });

  moveCards = action(
    ({
      cards,
      to,
      from,
      position = DeckPosition.TOP,
    }: {
      cards: CardState[];
      to: PileOfCards;
      from: PileOfCards;
      position?: DeckPosition;
    }) => {
      const cardsCopy = clone(cards);
      cardsCopy.forEach((cardToMove) => {
        const toPile = getPileOfCards[to]();
        const fromPile = getPileOfCards[from]();

        const fromPileCopy = clone(fromPile);
        const toPileCopy = clone(toPile);
        if (fromPileCopy.map((card) => card.id).includes(cardToMove.id)) {
          const newFromPile = fromPileCopy.filter(
            (card) => card.id !== cardToMove.id
          );
          fromPile.length = 0;
          fromPile.push(...newFromPile);
          switch (position) {
            case DeckPosition.BOTTOM:
              toPile.length = 0;
              toPile.push(...[...toPileCopy, cardToMove]);
              break;
            case DeckPosition.TOP:
            default:
              toPile.length = 0;
              toPile.push(...[cardToMove, ...toPileCopy]);
              break;
          }
        } else {
          throw new Error("Tried to draw non-existant card");
        }
      });
    }
  );
}

const getPileOfCards = {
  [PileOfCards.DRAW]: () => BattleState.get().drawPile,
  [PileOfCards.DISCARD]: () => BattleState.get().discardPile,
  [PileOfCards.EXHAUST]: () => BattleState.get().exhaustPile,
  [PileOfCards.HAND]: () => BattleState.get().currentHand,
};
