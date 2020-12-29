import React from "react";
import styled from "styled-components";
import corpse from "../../Images/corpse.png";
import { Row } from "../../Layout";
import { AppHistory } from "../../Router";
import { Typography } from "../../Typography";
import { PlayerState } from "../Entities/Player/PlayerState";
import { MapState } from "./MapState";
import { BattleState } from "../Battle/BattleState";

export const RenderDefeatScreen = () => {
  const resetGame = () => {
    MapState.get().reset();
    const battleState = BattleState.get();
    battleState.battleReactionDisposer?.();
    battleState.setMonsters(undefined);
    battleState.setCardsToShow();
    PlayerState.get().reset();
    AppHistory.push('/');
  }
  return (
    <ScreenWrapper>

      <Typography onClick={resetGame} color="white" outline fontSize={50}>
        Try again?
      </Typography>
      <img src={corpse} alt="game-over" draggable={false} />
    </ScreenWrapper>
  );
};

const ScreenWrapper = styled(Row).attrs({
  align: "center",
  justify: "center",
})`
  width: 100vw;
  height: 100vh;
  background-color: black;
`;
