import React from "react";
import styled from "styled-components";
import corpse from "../../Images/corpse.png";
import { Row } from "../../Layout";
import { AppHistory } from "../../Router";
import { Typography } from "../../Typography";
import { Player } from "../Entities/Player/Player";
import { Map } from "./Map";
import { Battle } from "../Battle/Battle";

export const RenderDefeatScreen = () => {
  const resetGame = () => {
    Map.get().reset();
    const battleState = Battle.get();
    battleState.battleReactionDisposer?.();
    battleState.setMonsters(undefined);
    battleState.setCardsToShow();
    Player.get().reset();
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
