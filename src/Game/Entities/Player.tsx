import { computed } from "mobx";
import { Card } from "../Cards/Card";
import { times, uniqueId } from "lodash";
import ironclad from "../../Images/ironclad.png";
import { Singleton } from "@taipescripeto/singleton";
import { Column, Spacer } from "../../Layout";
import React from "react";
import { HealthBar } from "../Common";
import styled, { css } from "styled-components";
import { BattleState } from "../BattleState";
import { Entity } from "../Entities/entity";
import { StatusBar, StatusType } from "../Common/StatusBar";
import { cards } from "../Cards/CardDefinitions";

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

const PlayerWrapper = styled(Column) <{ disable: boolean }>`
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
      maxMana: 99,
      class: PlayerClass.Ironclad,
      deck: [],
    }
  ) {
    super({
      block: 0,
      damage: 0,
      health: stats.health,
      id: uniqueId(),
      maxHealth: stats.health,
      statuses: []
    });
    times(6, () => stats.deck.push(cards["bash"](uniqueId())));
    times(6, () => stats.deck.push(cards["strike"](uniqueId())));
    times(6, () => stats.deck.push(cards["defend"](uniqueId())));
    this.addStatus(StatusType.strength);
    this.addStatus(StatusType.dexterity);
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
        <img src={ironclad} draggable={false} />
        <HealthBar
          block={this.block}
          health={this.health}
          maxHealth={this.maxHealth}
        />
        <Spacer size={10} />
        <StatusBar statuses={this.statuses as any} />
      </PlayerWrapper>
    );
  };
}
