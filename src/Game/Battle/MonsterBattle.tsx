import { observer } from "mobx-react";
import React, { useEffect } from "react";
import styled from "styled-components";
import { horizontalCenterAbsolute, Row } from "../../Layout";
import { Typography } from "../../Typography";
import { Battle } from "./Battle";
import { ManaCost } from "../Common";
import background from "../../Images/background.jpg";
import { ShowCardsModal } from "../Common/ShowCardsModal";
import { useState } from "react";
import {
  DiscardPileWithNumber,
  DrawPileWithNumber,
  MapButton,
} from "../Common/icons";
import { Card } from "../Cards/Card";
import { RenderCard } from "../Cards/RenderCard";
import { RenderPlayer } from "../Entities/Player/RenderPlayer";
import { RenderMonster } from "../Entities/Monster/RenderMonster";
import { RenderMap } from "../Map/RenderMap";
import { Map } from "../Map/Map";
import { useHistory } from "react-router-dom";
import { RenderRewardsModal } from "./Rewards/RenderRewardsModal";
import { Player } from "../Entities/Player/Player";

export const RenderBattle = observer(() => {
  const battleState = Battle.get();
  const playerState = Player.get();
  const useMountEffect = (fun: () => any) => useEffect(fun, []);
  const history = useHistory();
  const mapState = new Map();

  useMountEffect(() => {
    const mapState = new Map();
    // redirects you to base path if currentNode is undefined (if you refresh the page)
    if (mapState.currentNode === undefined) {
      history.push("/");
    }
  });

  const onRightClick = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    battleState.selectCard(undefined);
  };

  return (
    <Wrapper align="center" justify="center" onContextMenu={onRightClick}>
      <UnitWrappers align="flex-end" justify="space-between">
        <UnitContainer>
          <RenderPlayer />
        </UnitContainer>
        <UnitContainer>
          {Battle.get().monsters?.map((monster) => (
            <RenderMonster monsterState={monster} />
          ))}
        </UnitContainer>
      </UnitWrappers>
      <CurrentHandContainer>
        {battleState.currentHand.map((card) => (
          <RenderCard cardState={card} />
        ))}
      </CurrentHandContainer>
      <EndTurnButton onClick={() => battleState.endTurn()}>
        <Typography fontSize={25}>End Turn</Typography>
      </EndTurnButton>
      <ManaAmount notEnoughMana={battleState.currentMana === 0}>
        {battleState.currentMana}/{playerState.maxMana}
      </ManaAmount>

      <DrawPile
        onClick={() => battleState.setCardsToShow(battleState.drawPile)}
        amount={battleState.drawPile.length}
      />

      <ExhaustPile
        onClick={() => battleState.setCardsToShow(battleState.exhaustPile)}
        amount={battleState.exhaustPile.length}
      />

      <DiscardPile
        onClick={() => battleState.setCardsToShow(battleState.discardPile)}
        amount={battleState.discardPile.length}
      />

      <OpenMap onClick={() => mapState.setShowingMap(true)} />

      {battleState.cardsToShow ? (
        <ShowCardsModal
          cards={battleState.cardsToShow}
          onClose={() => battleState.setCardsToShow(undefined)}
          cardsToSelect={battleState.selectedCard?.get.cardSelection?.amount}
          onFinishSelectingCards={battleState.selectedCard?.get.cardSelection?.selectCards}
        />
      ) : null}

      {mapState.showingMap ? (
        <RenderMap
          onClose={() => mapState.setShowingMap(false)}
        />
      ) : null}
      {battleState.wonBattle ? (
        <RenderRewardsModal onClickProceed={() => mapState.setShowingMap(true)} />
      ) : null}
    </Wrapper>
  );
});

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
  ${horizontalCenterAbsolute};
  width: 80vw;
  bottom: 0;
  height: 260px;
`;

const UnitWrappers = styled(Row)`
  width: 100%;
  margin-top: 100px;
`;

const DrawPile = styled(DrawPileWithNumber)`
  position: absolute;
  bottom: 0;
  left: 0;
`;

const DiscardPile = styled(DiscardPileWithNumber)`
  bottom: 0;
  right: 0;
  position: absolute;
`;

const ExhaustPile = styled(DiscardPileWithNumber)`
  bottom: 0;
  right: 100px;
  position: absolute;
`;

const OpenMap = styled(MapButton)`
  position: absolute;
  top: 0;
  right: 0;
`;
