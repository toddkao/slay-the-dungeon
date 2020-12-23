import { uniqueId } from "lodash";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import styled from "styled-components";
import { Row } from "../Layout";
import { Typography } from "../Typography";
import { BattleState } from "./BattleState";
import { ManaCost } from "./Common";
import { JawWorm, Louse } from "./Monster";
import background from "../Images/background.jpg";

const EndTurnButton = styled.button`
  background-color: lightgreen;
  border-radius: 5px;
  color: inherit;
  border: none;
  padding: 20px;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  position: absolute;
  top: 70%;
  right: 5%;
`;

const ManaAmount = styled(ManaCost)`
  position: absolute;
  left: 15%;
  top: 33%;
`;

const Wrapper = styled(Row)`
  ${`background: url(${background})`};
  background-position: bottom;
  position: relative;
  background-color: black;
  padding: 0 300px 0 300px;
  height: 100vh;
`;

const UnitContainer = styled(Row).attrs({
  align: "flex-end",
})`
  top: 50vh;
  gap: 10px;
  height: 200px;
`;

const CurrentHandContainer = styled(Row).attrs({
  align: "center",
  justify: "center",
})`
  position: absolute;
  width: 80vw;
  bottom: 0;
  height: 260px;
  transform: translateX(-50%);
  left: 50%;
`;

export const MonsterBattle = observer(() => {
  const battleState = new BattleState();
  const useMountEffect = (fun: () => any) => useEffect(fun, []);

  useMountEffect(() => {
    const battleState = new BattleState();
    battleState.setMonsters([Louse(uniqueId()), Louse(uniqueId())]);
  });
  return (
    <Wrapper align="center" justify="space-between">
      <UnitContainer>{battleState.player.render()}</UnitContainer>
      <UnitContainer>
        {new BattleState().monsters.map((monster) =>
          monster.render(monster.id)
        )}
      </UnitContainer>
      <CurrentHandContainer>
        {battleState.currentHand.map((card) => card.render(card.id))}
      </CurrentHandContainer>
      <EndTurnButton onClick={() => battleState.endTurn()}>
        <Typography fontSize={25}>End Turn</Typography>
      </EndTurnButton>
      <ManaAmount>
        {battleState.currentMana}/{battleState.player.maxMana}
      </ManaAmount>
      {/* <button onClick={() => player.loseHealth()}>
        Lose Health
      </button>
      <button onClick={() => {
        player.addCard();
      }}>
        Add Card
      </button>
      <button onClick={() => {
        console.log(player.hand)
      }}>
        Log hand
      </button> */}
    </Wrapper>
  );
});
