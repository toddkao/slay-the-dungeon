import { observer } from "mobx-react";
import React from "react";
import styled, { css } from "styled-components";
import { Column, Spacer } from "../../../Layout";
import { Typography } from "../../../Typography";
import { Battle } from "../../Battle/Battle";
import { HealthBar } from "../../Common/HealthBar";
import { StatusBar } from "../../Common/StatusBar";
import { IntentType, Monster } from "./Monster";

export const RenderMonster = observer(
  ({ monsterState }: { monsterState: Monster }) => {
    const battleState = new Battle();

    const {
      get: { id, currentIntent, damage, image },
      statuses,
      health,
      maxHealth,
      extradamage,
    } = monsterState;

    if (health === 0) {
      return null;
    }

    const renderIntentNumber = () => {
      switch (currentIntent?.type) {
        case IntentType.Attack:
          return (
            <IntentNumber> {damage + extradamage} </IntentNumber>
          );
        default:
          return null;
      }
    };
    return (
      <MonsterWrapper
        id={`monster-${id}`}
        key={`monster-${id}`}
        onClick={() => {
          if (battleState.targetEnemy) {
            battleState.selectMonster(id);
            battleState.playSelectedCard();
          }
        }}
        disabled={battleState.targetSelf}
        selected={id === battleState.selectedMonsterId}
      >
        <MonsterIntentWrapper>
          <img
            src={currentIntent?.intentImage}
            width={45}
            height={45}
            draggable={false}
            alt="intent"
          />
          {renderIntentNumber()}
        </MonsterIntentWrapper>
        <img
          src={image}
          width={150}
          height={150}
          draggable={false}
          alt="monster"
        />
        <HealthBar health={health} maxHealth={maxHealth} />
        <Spacer size={10} />
        <StatusBar statuses={statuses as any} />
      </MonsterWrapper>
    );
  }
);

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
