import { Singleton } from "@taipescripeto/singleton";
import { random, range, shuffle } from "lodash";
import { action, computed, observable } from "mobx";
import { Card, CardEffectType } from "../Cards/Card";
import { IStatus, StatusType } from "../Common/StatusBar";
import { IntentType, Monster } from "../Entities/Monster/Monster";
import { Player } from "../Entities/Player/Player";
import { Map } from "../Map/Map";
export interface IBattleState {
  selectedCardId: string | undefined;
  selectedMonsterId: string | undefined;
  monsters: Monster[];
  currentHand: Card[];
  currentMana: number;
  drawPile: Card[];
  discardPile: Card[];
  exhaustPile: Card[];
  endTurnActions: Function[];
}
@Singleton()
export class Battle {
  player = new Player();
  constructor(
    private battleState: IBattleState = observable({
      selectedCardId: undefined,
      selectedMonsterId: undefined,
      currentMana: new Player().maxMana,
      monsters: [],
      currentHand: [],
      drawPile: [],
      discardPile: [],
      exhaustPile: [],
      endTurnActions: [],
    })
  ) { }

  @computed
  get wonBattle() {
    return this.monsters.length === 0;
  }

  @computed
  get currentMana() {
    return this.battleState.currentMana;
  }

  @computed
  get targetSelf() {
    return (
      this.selectedCard?.get.targetEnemy === false ||
      this.selectedCardId === undefined
    );
  }

  @computed
  get targetEnemy() {
    return (
      this.selectedCard?.get.targetEnemy === true ||
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
    return this.selectedCard?.get.manaCost ?? 0;
  }

  @computed
  get selectedMonsterId() {
    return this.battleState.selectedMonsterId;
  }

  @computed
  get selectedMonster() {
    return this.monsters.find(
      (monster) => monster.get.id === this.battleState.selectedMonsterId
    );
  }

  @computed
  get monsters() {
    return this.battleState.monsters ?? [];
  }

  @computed
  get currentHand() {
    return this.battleState.currentHand;
  }

  @computed
  get drawPile() {
    return this.battleState.drawPile;
  }

  @computed
  get discardPile() {
    return this.battleState.discardPile;
  }

  @computed
  get exhaustPile() {
    return this.battleState.exhaustPile;
  }

  public log = () => {
    console.log("draw", this.battleState.drawPile.map(card => card.get.id));
    console.log("hand", this.battleState.currentHand.map(card => card.get.id));
    console.log("discard", this.battleState.discardPile.map(card => card.get.id));
    console.log("exhaust", this.battleState.exhaustPile.map(card => card.get.id));
  };

  private getCardFromId = (cardId: string) => {
    return this.player.get.deck.find((card) => card.get.id === cardId);
  };

  private drawCards = action((cards: Card[]) => {
    console.log(cards, this.battleState.drawPile);
    console.log(cards.map(card => card.get.id), this.battleState.drawPile.map(card => card.get.id));
    if (!cards.every(card => this.battleState.drawPile.map(drawCard => drawCard.get.id).includes(card.get.id))) {
      throw new Error("Trying to draw cards that don't exist in draw pile");
    } else {
      cards.forEach((card) => {
        this.battleState.currentHand = [...this.battleState.currentHand, card];
        this.battleState.drawPile = this.battleState.drawPile.filter(drawCard => drawCard.get.id !== card.get.id);
      });
    }
  });

  private initializeMonsters = action(() => {
    const mapState = new Map();
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
    this.battleState.drawPile = this.player.get.deck;
    this.battleState.drawPile = shuffle(this.battleState.drawPile);
    this.draw(5);
  });

  public draw = action((count: number = 1) => {
    let cards: Card[] = [];

    let shuffleIndex = 0;
    range(0, count).forEach((index) => {
      if (this.battleState.drawPile.length === 0) {
        this.reshuffleDiscardPile();
        shuffleIndex = index;
      }

      cards.push(this.drawPile[index - shuffleIndex]);
    });

    this.drawCards(cards);
    return cards;
  });

  private removeCardsFromHand = (cards: Card[]) => {
    cards.forEach((cardToRemove) => {
      this.battleState.currentHand = this.battleState.currentHand.filter(
        (card) => card.get.id !== cardToRemove.get.id
      );
      this.battleState.discardPile.push(cardToRemove);
    });
  };

  public exhaustCards(cards: Card[]) {
    cards.forEach(card => {
      this.battleState.drawPile = this.battleState.drawPile.filter(drawCard => drawCard.get.id !== card.get.id);
      this.battleState.currentHand = this.battleState.currentHand.filter(handCard => handCard.get.id !== card.get.id);
      this.battleState.discardPile = this.battleState.discardPile.filter(exhaustCard => exhaustCard.get.id !== card.get.id);
      this.battleState.exhaustPile = [...this.battleState.exhaustPile, card];
    });
  }

  public resolveTargetedCard = action((cards: Card[]) => {
    cards.forEach(card => {
      switch (card.get.effect) {
        case CardEffectType.SingleTarget:
          if (card.get.damage) //TODO: add a new card type for cards that has no damage
            this.resolveSingleTargetDamage({
              card: card,
              selectedMonster: this.selectedMonster,
            });
          break;
        case CardEffectType.MultiTarget:
          this.monsters.forEach((monster) => {
            if (card.get.damage) {
              this.resolveSingleTargetDamage({ card: card, selectedMonster: monster });
            }
          });
          break;
        case CardEffectType.AddBlock:
          if (card.get.block && card.get.targetSelf) {
            this.player.addBlock(card.get.block + this.player.extrablock);
          }
          break;
        default:
          break;
      }
      if (card.get.special) {
        card.get.special(this.battleState);
      }
    });

  });

  public calculateDamage = action(
    ({
      damage,
      extradamage = 0,
      statuses,
    }: {
      damage: number;
      extradamage?: number;
      statuses: IStatus[];
    }) => {
      let amount = damage + extradamage;
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
    if (!selectedMonster) {
      selectedMonster = this.monsters[random(0, this.monsters.length - 1)];
    }

    if (card.get.damage && selectedMonster) {
      selectedMonster.takeDamage(
        this.calculateDamage({
          damage: card.evaluateDamage(),
          extradamage: this.player.extradamage,
          statuses: selectedMonster.get.statuses,
        })
      );
      if (card.get.status && selectedMonster) {
        selectedMonster.addStatus(card.get.status.type, card.get.status.amount);
      }
      if (selectedMonster.get.health === 0) {
        this.setMonsters(
          this.monsters.filter(
            (monster) => monster.get.id !== selectedMonster?.id
          )
        );
      }
    }
  }

  private resolveMonsterActions = action(() => {
    this.monsters.forEach((monster) => {
      switch (monster.get.currentIntent?.type) {
        case IntentType.Attack:
          this.player.takeDamage(this.calculateDamage(monster.get));
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
      monster.updateStatuses();
      monster.cleanupStatuses();
      monster.pickRandomIntent();
    });
  });

  private resolvePlayerActions = action(() => {
    this.player.cleanupStatuses();
    this.player.updateStatuses();
    this.player.clearBlock();
  });

  private resolveGameActions = action(() => {
    this.battleState.currentMana = this.player.maxMana;
    this.removeCardsFromHand(this.currentHand);
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
  });

  public playSelectedCard = action(() => {
    if (
      !this.selectedCardId ||
      this.selectedCardManaCost > this.currentMana ||
      !this.selectedCard
    ) {
      return;
    }
    this.useMana(this.selectedCardManaCost);
    this.selectedCard.playAudioClip();
    this.resolveTargetedCard([this.selectedCard]);
    this.removeCardsFromHand([this.selectedCard]);
    this.selectCard(undefined);
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
    this.battleState.currentMana = this.player.maxMana;
  });

  selectCard = action((id: string | undefined) => {
    this.battleState.selectedCardId = id;
    this.selectMonster(undefined);
  });

  selectMonster = action((id: string | undefined) => {
    this.battleState.selectedMonsterId = id;
  });

  setMonsters = action((monsters: Monster[] | undefined) => {
    if (monsters) {
      this.battleState.monsters = monsters;
    }
  });
}
