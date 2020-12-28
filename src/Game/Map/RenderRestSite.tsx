import React from "react";
import styled from "styled-components";
import corpse from "../../Images/corpse.png";
import overShoulder from "../../Images/restsite/shoulder.png";
import { Row } from "../../Layout";
import { AppHistory } from "../../Router";
import { Typography } from "../../Typography";
import { Player } from "../Entities/Player/Player";
import { Map } from "./Map";
import { Battle } from "../Battle/Battle";

export const RenderRestSite = () => {
  const resetGame = () => {
    Map.get().reset();
    const battleState = Battle.get();
    battleState.setMonsters(undefined);
    battleState.setCardsToShow();
    Player.get().reset();
    AppHistory.push("/");
  };
  return (
    <ScreenWrapper>
      <Typography onClick={resetGame} color="white" outline fontSize={50}>
        Try again?
      </Typography>
      <img
        src={overShoulder}
        alt="over-shoulder"
        style={{ position: "absolute" }}
      />
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
