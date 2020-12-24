import { Singleton } from "@taipescripeto/singleton";
import { sampleSize } from "lodash";
import { action, computed, observable } from "mobx";
import { Card, CardEffectType } from "./Cards/Card";
import { IStatus, StatusType } from "./Common/StatusBar";
import { IntentType, Monster } from "./Entities/Monster";
import { Player } from "./Entities/Player";

interface IBattleState {
  selectedCardId: string | undefined;
  selectedMonsterId: string | undefined;
  monsters: Monster[];
  currentHand: Card[];
  currentMana: number;
  drawPile: Card[];
  graveyard: Card[];
}
@Singleton()
export class BattleState {
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
    })
  ) {
    this.initializeHand();
  }

  @computed
  get currentMana() {
    return this.battleState.currentMana;
  }

  @computed
  get targetSelf() {
    return (
      this.selectedCard?.targetEnemy === false ||
      this.selectedCardId === undefined
    );
  }

  @computed
  get targetEnemy() {
    return (
      this.selectedCard?.targetEnemy === true ||
      this.selectedCardId === undefined
    );
  }

  @computed
  get selectedCardId() {
    return this.battleState.selectedCardId;
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
  get selectedMonsterId() {
    return this.battleState.selectedMonsterId;
  }

  @computed
  get selectedMonster() {
    return this.monsters.find(
      (monster) => monster.id === this.battleState.selectedMonsterId
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
    return this.player.deck.find((card) => card.id === cardId);
  };

  private drawCards = action((cards: Card[]) => {
    if (this.battleState.drawPile.length === 0) {
      this.initializeHand();
    } else {
      cards.forEach((card) => {
        this.battleState.drawPile = this.battleState.drawPile.filter(
          (card) => !cards.map((card) => card.id).includes(card.id)
        );
        this.battleState.currentHand.push(card);
      });
    }
  });

  private initializeHand = action(() => {
    this.battleState.drawPile = this.player.deck;
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
        (card) => card.id !== cardToRemove.id
      );
      this.battleState.graveyard.push(cardToRemove);
    });
  };

  private resolveTargetedCard = action((card: Card) => {
    switch (card.effect) {
      case CardEffectType.SingleTarget:
        if (card.damage && this.selectedMonster) {
          this.selectedMonster.takeDamage(this.calculateDamage({ damage: card.damage, extradamage: this.player.extradamage, statuses: this.selectedMonster.statuses }));
          if (card.status && this.selectedMonster) {
            this.selectedMonster.addStatus(card.status.type, card.status.amount);
          }
          if (this.selectedMonster.health === 0) {
            this.setMonsters(
              this.monsters.filter(
                (monster) => monster.id !== this.selectedMonsterId
              )
            );
          }
        }
        break;
      case CardEffectType.AddBlock:
        if (card.block && card.targetSelf) {
          this.player.addBlock(card.block + this.player.extrablock);
        }
        break;
      default:
        break;
    }
  });

  private calculateDamage = action(({ damage, extradamage = 0, statuses }: { damage: number, extradamage?: number, statuses: IStatus[] }) => {
    let amount = damage + extradamage;
    const vulnerable = statuses?.find(s => s.type === StatusType.vulnerable);
    if (vulnerable && vulnerable.amount && vulnerable.amount >= 1) {
      amount = Math.floor(amount * 1.5);
    }

    console.log("test", amount, vulnerable);
    return amount;
  });

  private resolveMonsterActions = action(() => {
    this.monsters.forEach((monster) => {
      switch (monster.currentIntent?.type) {
        case IntentType.Attack:
          this.player.takeDamage(this.calculateDamage(monster));
          break;
        case IntentType.GainStrength:
          if (monster.currentIntent.amount) {
            monster.addStatus(StatusType.strength, monster.currentIntent.amount)
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
  });

  public endTurn = action(() => {
    this.resolveMonsterActions();
    this.resolvePlayerActions();
    this.resolveGameActions();
  });

  selectCard = action((id: string | undefined) => {
    this.battleState.selectedCardId = id;
    this.selectMonster(undefined);
  });

  selectMonster = action((id: string | undefined) => {
    this.battleState.selectedMonsterId = id;
  });

  setMonsters = action((monsters: Monster[]) => {
    this.battleState.monsters = monsters;
  });
}
