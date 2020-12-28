import React from "react";
import styled, { css } from "styled-components";
import { Column, Spacer } from "../../../Layout";
import { Player } from "./Player";
import ironclad from "../../../Images/ironclad.png";
import { StatusBar } from "../../Common/StatusBar";
import { observer } from "mobx-react";
import { Battle } from "../../Battle/Battle";
import { HealthBar } from "../../Common/HealthBar";
import { ReticleWrapper } from "../../Common/ReticleWrapper";

export const RenderPlayer = observer(() => {
  const playerState = Player.get();
  const battleState = Battle.get();
  const { health, block, maxHealth, statuses } = playerState;
  if (health === 0) {
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
      <ReticleWrapper selected={battleState.selectedSelf ?? false}>
        <img src={ironclad} draggable={false} alt="Player" />
        <HealthBar block={block} health={health} maxHealth={maxHealth} />
        <Spacer size={10} />
        <StatusBar statuses={statuses as any} />
      </ReticleWrapper>
    </PlayerWrapper>
  );
});

const PlayerWrapper = styled(Column)<{ disable: boolean }>`
  position: relative;
  z-index: 0;
  ${({ disable }) =>
    disable
      ? ""
      : css`
          &:hover {
            outline: 2px solid green;
          }
        `}
`;
