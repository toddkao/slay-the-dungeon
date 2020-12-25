import { observer } from "mobx-react";
import React, { useEffect } from "react";
import styled from "styled-components";
import { Row } from "../../Layout";
import { Typography } from "../../Typography";
import { Battle } from "./Battle";
import { ManaCost } from "../Common";
import background from "../../Images/background.jpg";
import { ShowCardsModal } from "../Common/ShowCardsModal";
import { useState } from "react";
import { DeckWithNumber, DiscardPileWithNumber, DrawPileWithNumber, MapIcon } from "../Common/deck";
import { Card } from "../Cards/Card";
import { RenderCard } from "../Cards/RenderCard";
import { RenderPlayer } from "../Entities/Player/RenderPlayer";
import { RenderMonster } from "../Entities/Monster/RenderMonster";
import { RenderMap } from "../Map/RenderMap";
import { Map } from "../Map/Map";
import { useHistory } from "react-router-dom";

export const RenderBattle = observer(() => {
  const battleState = new Battle();
  const useMountEffect = (fun: () => any) => useEffect(fun, []);
  const history = useHistory();
  const [cardToShow, setCardsToShow] = useState<Card[]>();

  const [showMap, setShowMap] = useState<boolean>();

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
          <RenderPlayer playerState={battleState.player} />
        </UnitContainer>
        <UnitContainer>
          {new Battle().monsters.map((monster) => (
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
        {battleState.currentMana}/{battleState.player.maxMana}
      </ManaAmount>
      <DrawPile
        onClick={() => setCardsToShow(battleState.drawPile)}
        amount={battleState.drawPile.length}
      />
      <Graveyard
        onClick={() => setCardsToShow(battleState.graveyard)}
        amount={battleState.graveyard.length}
      />

      <MapButton onClick={() => setShowMap(true)}>
        {/* {battleState.graveyard.length} */}
      </MapButton>

      {cardToShow ? (
        <ShowCardsModal
          cards={cardToShow}
          onClose={() => setCardsToShow(undefined)}
        />
      ) : null}

      {battleState.wonBattle || showMap ? (
        <RenderMap
          onClose={() => setShowMap(undefined)}
          hideReturn={battleState.wonBattle}
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

const DrawPile = styled(DrawPileWithNumber)`
  position: absolute;
  bottom: 0;
  left: 0;
`;

const Graveyard = styled(DiscardPileWithNumber)`
  bottom: 0;
  right: 0;
  position: absolute;
`;

const MapButton = styled(MapIcon)`
  position: absolute;
  top: 0;
  right: 0;
`;
