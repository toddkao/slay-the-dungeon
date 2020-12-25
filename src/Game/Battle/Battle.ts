import { Singleton } from "@taipescripeto/singleton";
import { sampleSize } from "lodash";
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
  graveyard: Card[];
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
      graveyard: [],
      endTurnActions: [],
    })
  ) {}

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
  get graveyard() {
    return this.battleState.graveyard;
  }

  private getCardFromId = (cardId: string) => {
    return this.player.get.deck.find((card) => card.get.id === cardId);
  };

  private drawCards = action((cards: Card[]) => {
    if (this.battleState.drawPile.length === 0) {
      this.initializeHand();
    } else {
      cards.forEach((card) => {
        this.battleState.drawPile = this.battleState.drawPile.filter(
          (card) => !cards.map((card) => card.get.id).includes(card.get.id)
        );
        this.battleState.currentHand.push(card);
      });
    }
  });

  private initializeMonsters = action(() => {
    const mapState = new Map();
    this.setMonsters(mapState.currentEncounter);
  });

  private initializeHand = action(() => {
    this.removeCardsFromHand(this.currentHand);
    this.battleState.drawPile = this.player.get.deck;
    this.drawRandomCards(5);
    this.battleState.graveyard = [];
  });

  private drawRandomCards = action((number: number) => {
    const randomCards = sampleSize(this.drawPile, number);
    this.drawCards(randomCards);
  });

  private removeCardsFromHand = (cards: Card[]) => {
    cards.forEach((cardToRemove) => {
      this.battleState.currentHand = this.battleState.currentHand.filter(
        (card) => card.get.id !== cardToRemove.get.id
      );
      this.battleState.graveyard.push(cardToRemove);
    });
  };

  private resolveTargetedCard = action((card: Card) => {
    switch (card.get.effect) {
      case CardEffectType.SingleTarget:
        this.resolveSingleTargetDamage({
          card,
          selectedMonster: this.selectedMonster as Monster,
        });
        break;
      case CardEffectType.MultiTarget:
        this.monsters.forEach((monster) => {
          this.resolveSingleTargetDamage({ card, selectedMonster: monster });
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

  private calculateDamage = action(
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
    selectedMonster: Monster;
  }) {
    if (card.get.damage && selectedMonster) {
      selectedMonster.takeDamage(
        this.calculateDamage({
          damage: card.evaluateDamage(this.player),
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
            (monster) => monster.get.id !== selectedMonster.id
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
    this.drawRandomCards(5);
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
    this.removeCardsFromHand([this.selectedCard]);
    this.useMana(this.selectedCardManaCost);
    this.selectedCard.playAudioClip();
    this.resolveTargetedCard(this.selectedCard);
    this.selectCard(undefined);
  });

  public endTurn = action(() => {
    this.resolveMonsterActions();
    this.resolvePlayerActions();
    this.resolveGameActions();
    this.resolveEndTurnActions();
  });

  public initialize = action(() => {
    this.resolveGameActions();
    this.initializeMonsters();
    this.initializeHand();
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
