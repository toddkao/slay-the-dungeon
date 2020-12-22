import { observable } from "mobx";
import { Card, Defend, Strike } from "./Card";
import { sampleSize, times } from "lodash";
import ironclad from "../Images/ironclad.png";
import { Singleton } from "@taipescripeto/singleton";
import { Column } from "../Layout";
import React from "react";
import { HealthBar } from "./Common";

export enum PlayerClass {
  Ironclad,
  Silent,
}

interface IPlayer {
  health: number;
  maxHealth: number;
  mana: number;
  class: PlayerClass;
  deck: Card[];

  // While playing
  drawPile: Card[];
  hand: Card[];
  graveyard: Card[];
}

@Singleton()
export class Player {

  render = () => {
    return (
      <Column>
        <img src={ironclad} />
        <HealthBar health={this.stats.health} maxHealth={this.stats.maxHealth} />
      </Column>
    );
  };

  newHand = () => {
    const randomCards = sampleSize(this.stats.deck, 5);
    randomCards.forEach(card => {
      this.stats.hand.push(card)
    })
  };

  newTurn = () => {};

  constructor(
    public stats: IPlayer = observable({
      health: 80,
      maxHealth: 80,
      mana: 3,
      deck: [],
      class: PlayerClass.Ironclad,
      hand: [],
      drawPile: [],
      graveyard: [],
    })
  ) {

    times(5, () => stats.deck.push(Strike));
    times(5, () => stats.deck.push(Defend));
  }
}
