import React from "react";
import styled from "styled-components";
import { Column, Spacer } from "../../../Layout";
import { useAtomValue } from "jotai";
import { playerAtom } from "./playerAtom";
import ironclad from "../../../Images/ironclad.png";
import { StatusBar } from "../../Common/StatusBar";
import { BattleState } from "../../Battle/BattleState";
import { HealthBar } from "../../Common/HealthBar";
import { ReticleWrapper } from "../../Common/ReticleWrapper";

export const RenderPlayer = () => {
  const playerState = useAtomValue(playerAtom);
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
