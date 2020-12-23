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
import { ShowCardsModal } from "./Common/ShowCardsModal";
import { useState } from "react";
import { Card } from "./Card";

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
  top: 40%;
`;

const Wrapper = styled(Row)`
  ${`background: url(${background})`};
  overflow: hidden;
  background-position: bottom;
  position: relative;
  background-color: black;
  padding: 0 300px 0 300px;
  height: 100vh;
`;

const UnitContainer = styled(Row).attrs({
  align: "flex-end",
})`
  top: 80vh;
  gap: 30px;
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

const UnitWrappers = styled(Row)`
  width: 100%;
  margin-top: 100px;
`;

const DrawPile = styled.div`
  background-color: green;
  padding: 20px;
  position: absolute;
  top: 0;
  left: 0;
`;

const Graveyard = styled.div`
  background-color: grey;
  padding: 20px;
  top: 0;
  right: 0;
  position: absolute;
`;

export const MonsterBattle = observer(() => {
  const battleState = new BattleState();
  const useMountEffect = (fun: () => any) => useEffect(fun, []);
  const [cardToShow, setCardsToShow] = useState<Card[]>();

  useMountEffect(() => {
    const battleState = new BattleState();
    battleState.setMonsters([Louse(uniqueId()), Louse(uniqueId())]);
  });

  const onRightClick = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    battleState.selectCard(undefined);
    console.log("right click");
  };

  return (
    <Wrapper align="center" justify="center" onContextMenu={onRightClick}>
      <UnitWrappers align="flex-end" justify="space-between">
        <UnitContainer>{battleState.player.render()}</UnitContainer>
        <UnitContainer>
          {new BattleState().monsters.map((monster) =>
            monster.render(monster.id)
          )}
        </UnitContainer>
      </UnitWrappers>
      <CurrentHandContainer>
        {battleState.currentHand.map((card) => card.render(card.id))}
      </CurrentHandContainer>
      <EndTurnButton onClick={() => battleState.endTurn()}>
        <Typography fontSize={25}>End Turn</Typography>
      </EndTurnButton>
      <ManaAmount notEnoughMana={battleState.currentMana === 0}>
        {battleState.currentMana}/{battleState.player.maxMana}
      </ManaAmount>
      <DrawPile onClick={() => setCardsToShow(battleState.drawPile)}>
        Draw pile {battleState.drawPile.length}
      </DrawPile>
      <Graveyard onClick={() => setCardsToShow(battleState.graveyard)}>
        Graveyard {battleState.graveyard.length}
      </Graveyard>
      {cardToShow ? (
        <ShowCardsModal
          cards={cardToShow}
          onClose={() => setCardsToShow(undefined)}
        />
      ) : null}
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
