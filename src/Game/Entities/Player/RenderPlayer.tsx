import React from "react";
import styled, { css } from "styled-components";
import { Column, Spacer } from "../../../Layout";
import { PlayerState } from "./PlayerState";
import ironclad from "../../../Images/ironclad.png";
import { StatusBar } from "../../Common/StatusBar";
import { observer } from "mobx-react";
import { BattleState } from "../../Battle/BattleState";
import { HealthBar } from "../../Common/HealthBar";
import { ReticleWrapper } from "../../Common/ReticleWrapper";

export const RenderPlayer = observer(() => {
  const playerState = PlayerState.get();
  const battleState = BattleState.get();
  const { health, block, maxHealth, statuses } = playerState;
  if (health === 0) {
    return null;
  }
  return (
    <PlayerWrapper
      onClick={() => {
        if (battleState.targetSelf) {
          battleState.playSelectedCard();
        }
      }}
    >
      <ReticleWrapper selected={battleState.selectedSelf ?? false}>
        <img src={ironclad} draggable={false} alt="Player" />
        <HealthBar block={block} health={health} maxHealth={maxHealth} />
        <Spacer size={10} />
        <StatusBar statuses={statuses as any} />
      </ReticleWrapper>
    </PlayerWrapper>
  );
});

const PlayerWrapper = styled(Column)`
  position: relative;
  z-index: 0;
`;
