import louse from "../Images/louse.png";
import jawworm from "../Images/jawworm.png";
import React from "react";
import { Column, Spacer } from "../Layout";
import { HealthBar } from "./Common";
import styled, { css } from "styled-components";
import { action, computed, observable } from "mobx";
import { BattleState } from "./BattleState";
import { random } from "lodash";
import attackIntent from "../Images/attack-intent.png";
import spellIntent from "../Images/spell-intent.png";
import Chance from "chance";
import { Typography } from "../Typography";
import { StatusBar } from "./Common/StatusBar";
import { Entity } from "./Common/entity";

export enum IntentType {
  Attack,
  Shield,
  GainStrength,
}

interface IIntent {
  intentImage: string;
  chance: number;
  type: IntentType;
  amount?: number;
}

interface IMonster {
  id: string;
  name: string;
  image: string;
  damage?: number;
  health: number;
  strength: number;
  dexterity: number;
  intent: IIntent[];
  currentIntent?: IIntent;
  effect?: any;
}

const MonsterWrapper = styled(Column)<{ selected: boolean; disabled: boolean }>`
  position: relative;
  height: 110px;
  ${({ selected }) => (selected ? "outline: 2px solid green;" : "")}
  ${({ disabled }) =>
    disabled
      ? "pointer-events: none"
      : css`
          &:hover {
            outline: 2px solid green;
          }
        `}
`;

const MonsterIntentWrapper = styled.div`
  position: absolute;
  transform: translateX(-50%);
  left: 50%;
`;

const IntentNumber = styled(Typography).attrs({
  fontSize: 20,
})`
  position: absolute;
  color: white;
  top: 0;
  right: 0;
`;

export class Monster extends Entity {
  constructor(private monster: IMonster) {
    super({ ...monster });
    this.pickRandomIntent();
  }

  @computed
  get currentIntent() {
    return this.monster.currentIntent;
  }

  pickRandomIntent = action(() => {
    const chance = new Chance();
    const intent: IIntent = chance.weighted(
      this.monster.intent,
      this.monster.intent.map((intent) => intent.chance)
    );
    this.setCurrentIntent(intent);
  });

  setCurrentIntent = action((intent: IIntent) => {
    this.monster.currentIntent = intent;
  });

  renderIntentNumber = () => {
    switch (this.currentIntent?.type) {
      case IntentType.Attack:
        return <> {this.damage} </>;
      default:
        return null;
    }
  };

  render = (key?: string) => {
    const battleState = new BattleState();
    if (this.monster.health <= 0) {
      return null;
    }
    return (
      <MonsterWrapper
        key={key}
        onClick={() => {
          if (battleState.targetEnemy) {
            battleState.selectMonster(this.monster.id);
            battleState.playSelectedCard();
          }
        }}
        disabled={battleState.targetSelf}
        selected={this.monster.id === battleState.selectedMonsterId}
      >
        <MonsterIntentWrapper>
          <img
            src={this.currentIntent?.intentImage}
            width={45}
            height={45}
            alt="intent"
          />
          <IntentNumber>{this.renderIntentNumber()}</IntentNumber>
        </MonsterIntentWrapper>
        <img src={this.monster.image} width={100} height={100} alt="monster" />
        <HealthBar health={this.health} maxHealth={this.maxHealth} />
        <Spacer size={10} />
        <StatusBar statuses={this.statuses} />
      </MonsterWrapper>
    );
  };
}

export const Louse = (id: string) => {
  const health = random(10, 15);
  return new Monster(
    observable({
      id,
      name: "Louse",
      health,
      maxHealth: health,
      strength: 0,
      dexterity: 0,
      damage: 6,
      image: louse,
      intent: [
        {
          type: IntentType.Attack,
          intentImage: attackIntent,
          chance: 0.75,
        },
        {
          type: IntentType.GainStrength,
          intentImage: spellIntent,
          chance: 0.25,
          amount: 3,
        },
      ],
    })
  );
};

export const JawWorm = (id: string) => {
  const health = random(40, 44);

  return new Monster(
    observable({
      id,
      name: "JawWorm",
      health,
      maxHealth: health,
      strength: 0,
      dexterity: 0,
      damage: 11,
      image: jawworm,
      intent: [
        {
          type: IntentType.Attack,
          intentImage: attackIntent,
          chance: 0.75,
        },
        {
          type: IntentType.GainStrength,
          intentImage: spellIntent,
          chance: 0.25,
        },
      ],
    })
  );
};