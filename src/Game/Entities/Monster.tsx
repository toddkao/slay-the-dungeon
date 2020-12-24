import louse from "../../Images/louse.png";
import jawworm from "../../Images/jawworm.png";
import React from "react";
import { Column, Spacer } from "../../Layout";
import { HealthBar } from "../Common";
import styled, { css } from "styled-components";
import { action, computed, observable } from "mobx";
import { BattleState } from "../BattleState";
import { random } from "lodash";
import attackIntent from "../../Images/attack-intent.png";
import spellIntent from "../../Images/spell-intent.png";
import Chance from "chance";
import { Typography } from "../../Typography";
import { StatusBar } from "../Common/StatusBar";
import { Entity, IEntity } from "./entity";

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

interface IMonster extends IEntity {
  name: string;
  image: string;
  intent: IIntent[];
  currentIntent?: IIntent;
  effect?: any;
}

const MonsterWrapper = styled(Column)<{ selected: boolean; disabled: boolean }>`
  position: relative;
  z-index: 0;
  height: 100%;
  width: 100%;
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
  @keyframes bounce {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-5px);
    }
    100% {
      transform: translateY(0);
    }
  }

  animation: bounce 1.5s ease-in-out infinite reverse;

  position: absolute;
  top: -20px;
  left: 50%;
`;

const IntentNumber = styled(Typography).attrs({
  fontSize: 20,
})`
  position: absolute;
  color: white;
  bottom: 0;
  left: -10px;
  text-shadow: -1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black,
    1px 1px 0 black;

  padding: 2px;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
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
        return <IntentNumber> {this.damage + this.extradamage} </IntentNumber>;
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
          {this.renderIntentNumber()}
        </MonsterIntentWrapper>
        <img src={this.monster.image} width={150} height={150} alt="monster" />
        <HealthBar health={this.health} maxHealth={this.maxHealth} />
        <Spacer size={10} />
        <StatusBar statuses={this.statuses as any} />
      </MonsterWrapper>
    );
  };
}

export const Louse = (id: string) => {
  const health = random(10, 9999);
  return new Monster(
    observable({
      id,
      name: "Louse",
      health,
      maxHealth: health,
      strength: 0,
      dexterity: 0,
      damage: 6,
      block: 0,
      image: louse,
      statuses: [],
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
      block: 0,
      maxHealth: health,
      strength: 0,
      dexterity: 0,
      statuses: [],
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
