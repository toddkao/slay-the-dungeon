import { clone, random, range, sampleSize, shuffle } from "lodash";
import { action, computed, observable } from "mobx";
import { Card, CardEffectType } from "../Cards/Card";
import { IStatus, StatusType } from "../Common/StatusBar";
import { IntentType, Monster } from "../Entities/Monster/Monster";
import { Player } from "../Entities/Player/Player";
import { Map } from "../Map/Map";
import { AppHistory } from "../../Router";

enum DeckPosition {
  top,
  bottom,
}

interface IPileOfCards {
  [index: string]: Card[];
}

export enum PileOfCards {
  deck,
  draw,
  discard,
  exhaust,
  hand,
}

export interface IBattleState {
  selectedCardId: string | undefined;
  selectedMonsterIds?: string[];
  selectedSelf?: boolean;
  monsters: Monster[] | undefined;
  currentHand: Card[];
  currentMana: number;
  drawPile: Card[];
  discardPile: Card[];
  exhaustPile: Card[];
  endTurnActions: Function[];
  cardsToShow?: Card[];
}
export class Battle {
  private static instance: Battle;
  public static get(): Battle {
    if (!Battle.instance) Battle.instance = new Battle();
    return Battle.instance;
  }

  private constructor(
    private battleState: IBattleState = observable({
      selectedCardId: undefined,
      selectedMonsterIds: undefined,
      selectedSelf: undefined,
      currentMana: Player.get().maxMana,
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
  cardResolveQueue: (() => void)[] = [];

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
  get selectedCard(): Card | undefined {
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

  @computed
  get drawPile() {
    return this.battleState.drawPile;
  }
  set drawPile(cards: Card[]) {
    this.battleState.drawPile = cards;
  }

  @computed
  get discardPile() {
    return this.battleState.discardPile;
  }
  set discardPile(cards: Card[]) {
    this.battleState.discardPile = cards;
  }

  @computed
  get exhaustPile() {
    return this.battleState.exhaustPile;
  }

  @computed
  get cardsToShow() {
    return this.battleState.cardsToShow;
  }

  public setCardsToShow(cards?: Card[]) {
    this.battleState.cardsToShow = cards;
  }

  public getMonsterById = (monsterId: string) => {
    return this.monsters?.find((monster) => monster.get.id === monsterId);
  };

  public log = () => {
    console.log(
      "draw",
      this.battleState.drawPile.map((card) => card.get.id)
    );
    console.log(
      "hand",
      this.battleState.currentHand.map((card) => card.get.id)
    );
    console.log(
      "discard",
      this.battleState.discardPile.map((card) => card.get.id)
    );
    console.log(
      "exhaust",
      this.battleState.exhaustPile.map((card) => card.get.id)
    );
  };

  private getCardFromId = (cardId: string) => {
    return Player.get().get.deck.find((card) => card.get.id === cardId);
  };

  private drawCards = action((cards: Card[]) => {
    if (
      !cards.every((card) =>
        this.battleState.drawPile
          .map((drawCard) => drawCard.get.id)
          .includes(card.get.id)
      )
    ) {
      throw new Error("Trying to draw cards that don't exist in draw pile");
    } else {
      this.moveCards({ cards, from: PileOfCards.draw, to: PileOfCards.hand });
    }
  });

  private initializeMonsters = action(() => {
    const mapState = Map.get();
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
    this.battleState.drawPile = Player.get().get.deck;
    this.battleState.drawPile = shuffle(this.battleState.drawPile);
    this.draw(5);
  });

  public draw = action((count: number = 1) => {
    let cards: Card[] = [];
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
      from: PileOfCards.hand,
      to: PileOfCards.discard,
    });
  };

  public exhaustCards(cards: Card[]) {
    cards.forEach((card) => {
      this.battleState.drawPile = this.battleState.drawPile.filter(
        (drawCard) => drawCard.get.id !== card.get.id
      );
      this.battleState.currentHand = this.battleState.currentHand.filter(
        (handCard) => handCard.get.id !== card.get.id
      );
      this.battleState.discardPile = this.battleState.discardPile.filter(
        (exhaustCard) => exhaustCard.get.id !== card.get.id
      );
      this.battleState.exhaustPile = [...this.battleState.exhaustPile, card];
    });
  }

  public resolveCardEffect = action(async (card: Card) => {
    switch (card.get.effect) {
      case CardEffectType.SpecificEnemy:
        if (card.damage)
          this.resolveSingleTargetDamage({
            card: card,
            selectedMonster: this.selectedMonsters?.[0],
          });
        if (card.get.block) {
          Player.get().addBlock(card.evaluateBlock());
        }
        break;
      case CardEffectType.AllEnemies:
        this.monsters?.forEach((monster) => {
          if (card.damage) {
            this.resolveSingleTargetDamage({
              card: card,
              selectedMonster: monster,
            });
          }
        });
        break;
      case CardEffectType.Self:
        if (card.get.block && card.get.targetSelf) {
          Player.get().addBlock(card.evaluateBlock());
        }
        break;
      case CardEffectType.Random:
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
    if (card.get.cardSelection) {
      if (card.get.cardSelection.from().length <= 1) {
        card.get.cardSelection.selectCards(card.get.cardSelection.from());
      } else {
        this.battleState.cardsToShow = card.get.cardSelection.from();
        return;
      }
    }
    if (card.get.specialEffect) {
      card.get.specialEffect();
    }
    this.selectedCard?.playAudioClips();
    this.callNextAction();
  });

  public calculateDamage = action(
    ({ damage, statuses }: { damage: number; statuses: IStatus[] }) => {
      let amount = damage;
      const vulnerable = statuses?.find(
        (s) => s.type === StatusType.vulnerable
      );
      if (vulnerable && vulnerable.amount && vulnerable.amount >= 1) {
        amount = Math.floor(amount * 1.5);
      }

      return amount;
    }
  );

  private resolveSingleTargetDamage({
    card,
    selectedMonster,
  }: {
    card: Card;
    selectedMonster?: Monster;
  }) {
    if (!selectedMonster && this.monstersAlive) {
      selectedMonster = this.monstersAlive[
        random(0, this.monstersAlive.length - 1)
      ];
    }

    if (card.damage && selectedMonster) {
      selectedMonster.takeDamage(
        this.calculateDamage({
          damage: card.evaluateDamage(),
          statuses: selectedMonster.get.statuses,
        })
      );
      const status = card.get.status?.();
      if (status && selectedMonster) {
        switch (status.target) {
          case CardEffectType.SpecificEnemy:
            selectedMonster.addStatus(status.type, status.amount);
            break;
          case CardEffectType.AllEnemies:
            this.monstersAlive?.forEach((monster) =>
              monster.addStatus(status.type, status.amount)
            );
            break;
          case CardEffectType.Random:
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
    this.monsters?.forEach((monster) => {
      switch (monster.get.currentIntent?.type) {
        case IntentType.Attack:
          Player.get().takeDamage(this.calculateDamage(monster.get));
          break;
        case IntentType.GainStrength:
          if (monster.get.currentIntent.amount) {
            monster.addStatus(
              StatusType.strength,
              monster.get.currentIntent.amount
            );
          }
          break;
        default:
          break;
      }
      if (Player.get().health <= 0) {
        AppHistory.push("/defeat");
      }
      monster.updateStatuses();
      monster.cleanupStatuses();
      monster.pickRandomIntent();
    });
  });

  private resolvePlayerActions = action(() => {
    const player = Player.get();

    player.cleanupStatuses();
    player.updateStatuses();
    player.clearBlock();
  });

  private resolveGameActions = action(() => {
    this.battleState.currentMana = Player.get().maxMana;
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

  public initializeCardResolveQueue = () => {
    this.cardResolveQueue = [];
    this.cardResolveQueue.push(
      () => this.useMana(this.selectedCardManaCost),
      () => {
        this.moveCards({
          cards: [this.selectedCard as Card],
          from: PileOfCards.hand,
          to: PileOfCards.discard,
        });
        this.callNextAction();
      },
      () => this.resolveCardEffect(this.selectedCard as Card),
      () => {
        this.selectCard();
        this.callNextAction();
      },
      () => {
        this.selectMonster();
        this.callNextAction();
      }
    );
  };

  public playSelectedCard = action(() => {
    console.log(this.cardResolveQueue);
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
    this.resolveEndTurnActions();
  });

  public initialize = action(() => {
    this.initializeMonsters();
    this.initializeHand();
    Player.get().clearBlock();
    this.battleState.cardsToShow = undefined;
    this.battleState.currentMana = Player.get().maxMana;
  });

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

  setMonsters = action((monsters?: Monster[]) => {
    this.battleState.monsters = monsters;
  });

  moveCards = action(
    ({
      cards,
      to,
      from,
      position = DeckPosition.top,
    }: {
      cards: Card[];
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
        if (
          fromPileCopy.map((card) => card.get.id).includes(cardToMove.get.id)
        ) {
          const newFromPile = fromPileCopy.filter(
            (card) => card.get.id !== cardToMove.get.id
          );
          fromPile.length = 0;
          fromPile.push(...newFromPile);
          switch (position) {
            case DeckPosition.bottom:
              toPile.length = 0;
              toPile.push(...[...toPileCopy, cardToMove]);
              break;
            case DeckPosition.top:
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
  [PileOfCards.deck]: () => Player.get().get.deck,
  [PileOfCards.draw]: () => Battle.get().drawPile,
  [PileOfCards.discard]: () => Battle.get().discardPile,
  [PileOfCards.exhaust]: () => Battle.get().exhaustPile,
  [PileOfCards.hand]: () => Battle.get().currentHand,
};
