import { observer } from "mobx-react";
import React, { useRef } from "react";
import styled, { css } from "styled-components";
import { Column, Spacer } from "../../../Layout";
import { Typography } from "../../../Typography";
import { BattleState } from "../../Battle/BattleState";
import { HealthBar } from "../../Common/HealthBar";
import { StatusBar } from "../../Common/StatusBar";
import { IntentType, MonsterState } from "./MonsterState";
import { ReticleWrapper } from "../../Common/ReticleWrapper";

export const RenderMonster = observer(
  ({ monsterState }: { monsterState: MonsterState }) => {
    const battleState = BattleState.get();

    const {
      get: {
        id,
        image: { src, height },
      },
      currentIntent,
      statuses,
      health,
      maxHealth,
      dead,
    } = monsterState;
    const monsterRef = useRef(null);
    monsterState.ref = monsterRef;

    const renderIntentNumber = () => {
      switch (currentIntent?.type) {
        case IntentType.ATTACK:
          return (
            <IntentNumber>
              {currentIntent?.amount ?? 0}
            </IntentNumber>
          );
        default:
          return null;
      }
    };

    const selected = battleState.selectedMonsterIds?.includes(id) ?? false;

    return (
      <MonsterWrapper
        ref={monsterRef}
        id={`monster-${id}`}
        key={`monster-${id}`}
        dead={dead}
        disabled={battleState.targetSelf}
      >
        <ReticleWrapper selected={selected}>
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
            src={src}
            width="auto"
            height={height}
            draggable={false}
            alt="monster"
          />
          <HealthBar health={health} maxHealth={maxHealth} />
          <Spacer size={10} />
          <StatusBar statuses={statuses as any} />
        </ReticleWrapper>
      </MonsterWrapper>
    );
  }
);

const MonsterWrapper = styled(Column)<{
  disabled: boolean;
  dead?: boolean;
}>`
  position: relative;

  z-index: 0;
  height: 100%;
  width: 100%;
  ${({ dead }) =>
    dead
      ? css`
          transition: opacity 0.5s ease-in-out;
          opacity: 0;
        `
      : ""};
  ${({ disabled, dead }) => (disabled || dead ? "pointer-events: none" : "")}
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
