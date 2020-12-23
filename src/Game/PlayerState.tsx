import { computed } from "mobx";
import { Card, Defend, Strike } from "./Card";
import { times, uniqueId } from "lodash";
import ironclad from "../Images/ironclad.png";
import { Singleton } from "@taipescripeto/singleton";
import { Column, Spacer } from "../Layout";
import React from "react";
import { HealthBar } from "./Common";
import styled, { css } from "styled-components";
import { BattleState } from "./BattleState";
import { Entity } from "./Common/entity";
import { StatusBar } from "./Common/StatusBar";

export enum PlayerClass {
  Ironclad,
  Silent,
}

interface IPlayer {
  maxMana: number;
  health: number;
  class: PlayerClass;
  deck: Card[];
}

const PlayerWrapper = styled(Column)<{ disable: boolean }>`
  ${({ disable }) =>
    disable
      ? ""
      : css`
          &:hover {
            outline: 2px solid green;
          }
        `}
`;

@Singleton()
export class Player extends Entity {
  constructor(
    private stats: IPlayer = {
      health: 80,
      maxMana: 3,
      class: PlayerClass.Ironclad,
      deck: [],
    }
  ) {
    super({ ...stats });
    times(5, () => stats.deck.push(Strike(uniqueId())));
    times(5, () => stats.deck.push(Defend(uniqueId())));
    this.gainStrength(1);
    this.gainDexterity(1);
  }

  @computed
  get maxMana() {
    return this.stats.maxMana;
  }

  @computed
  get deck() {
    return this.stats.deck;
  }

  render = () => {
    const battleState = new BattleState();
    if (this.health === 0) {
      return null;
    }
    return (
      <PlayerWrapper
        disable={battleState.targetSelf}
        onClick={() => {
          if (battleState.targetSelf) {
            battleState.playSelectedCard();
          }
        }}
      >
        <img src={ironclad} />
        <HealthBar
          block={this.block}
          health={this.health}
          maxHealth={this.maxHealth}
        />
        <Spacer size={10} />
        <StatusBar statuses={this.statuses} />
      </PlayerWrapper>
    );
  };
}
