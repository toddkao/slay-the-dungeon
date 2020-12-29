import { action, computed, observable } from "mobx";
import { ICard, ICardWithId } from "../../Cards/Card";
import { range, uniqueId } from "lodash";
import { Entity, IEntity } from "../entity";
import { cardMap } from "../../Cards/CardDefinitions";

export enum PlayerClass {
  IRONCLAD,
  SILENT,
}

export class Player extends Entity {
  private static instance: Player;
  public static get(): Player {
    if (!Player.instance) Player.instance = new Player();
    return Player.instance;
  }
  private constructor(
    private stats: IPlayer = observable({
      health: 80,
      maxHealth: 80,
      statuses: [],
      maxMana: 9,
      class: PlayerClass.IRONCLAD,
      deck: [],
      block: 0,
      damage: 0,
      id: uniqueId(),
    })
  ) {
    super(stats);
    // times(6, () => stats.deck.push(cardMap.bash(uniqueId())));
    // times(6, () => stats.deck.push(cardMap.defend(uniqueId())));
    // times(6, () => stats.deck.push(cardMap.anger(uniqueId())));
    // times(6, () => stats.deck.push(cardMap.bodySlam(uniqueId())));
    // times(6, () => stats.deck.push(cardMap.cleave(uniqueId())));
    // times(6, () => stats.deck.push(cardMap.clothesline(uniqueId())));
    // times(6, () => stats.deck.push(cardMap.flex(uniqueId())));
    //range(0, 6).forEach(() => stats.deck.push(cardMap.clash(uniqueId())));
    //range(0, 6).forEach(() => stats.deck.push(cardMap.havoc(uniqueId())));
    //range(0, 6).forEach(() => stats.deck.push(cardMap.heavyBlade(uniqueId())));
    // range(0, 4).forEach(() =>
    //   stats.deck.push(new Card({ ...cardMap.ironWave, id: uniqueId() }))
    // );
    //range(0, 6).forEach(() => stats.deck.push(cardMap.perfectedStrike(uniqueId())));
    //range(0, 6).forEach(() => stats.deck.push(cardMap.pommelStrike(uniqueId())));
    //range(0, 6).forEach(() => stats.deck.push(cardMap.shrugItOff(uniqueId())));
    //range(0, 6).forEach(() => stats.deck.push(cardMap.swordBoomerang(uniqueId())));
    //range(0, 6).forEach(() => stats.deck.push(cardMap.thunderclap(uniqueId())));

    // range(0, 5).forEach(() =>
    //   stats.deck.push(new Card({ ...cardMap.strike, id: uniqueId() }))
    // );
    // range(0, 4).forEach(() =>
    //   stats.deck.push(new Card({ ...cardMap.defend, id: uniqueId() }))
    // );
    // range(0, 1).forEach(() =>
    //   stats.deck.push(new Card({ ...cardMap.bash, id: uniqueId() }))
    // );

    //   range(0, 5).forEach(() =>
    //   stats.deck.push(new Card({ ...cardMap.swordBoomerang, id: uniqueId() }))
    // );
    range(0, 4).forEach(() => stats.deck.push({...cardMap["Strike"], id: uniqueId()}));

    range(0, 4).forEach(() => stats.deck.push({...cardMap["Flex"], id: uniqueId()}));

    stats.deck.push({...cardMap["Armament"], id: uniqueId()});
    // range(0, 5).forEach(() =>
    //   stats.deck.push(new Card({ ...cardMap.clothesline, id: uniqueId() }))
    // );
  }

  @computed
  get get() {
    return this.stats;
  }

  @computed
  get deck() {
    return this.stats.deck;
  }
  set deck(newDeck: ICardWithId[]) {
    this.stats.deck = newDeck;
  }

  @computed
  get maxMana() {
    return this.stats.maxMana;
  }

  public initializeBattle = action(() => {
    this.stats.block = 0;
    this.stats.statuses = [];
  });

  addCardToDeck = action((cardName: string) => {
    const card = {
      ...cardMap[cardName],
      id: uniqueId(),
    };
    if (card) {
      this.stats.deck = [...this.stats.deck, card];
    }
  });
}

interface IPlayer extends IEntity {
  maxMana: number;
  health: number;
  class: PlayerClass;
  deck: ICardWithId[];
}
