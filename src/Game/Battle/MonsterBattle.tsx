import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";
import { horizontalCenterAbsolute, Row } from "../../Layout";
import { BattleState } from "./BattleState";
import { ManaCost } from "../Common";
import background from "../../Images/background.jpg";
import { ShowCardsModal } from "../Common/ShowCardsModal";
import {
  DiscardPileWithNumber,
  DrawPileWithNumber,
  EndTurnButton,
  MapButton,
} from "../Common/Clickables";
import { CardState } from "../Cards/CardState";
import { RenderCard } from "../Cards/RenderCard";
import { RenderPlayer } from "../Entities/Player/RenderPlayer";
import { RenderMonster } from "../Entities/Monster/RenderMonster";
import { RenderMap } from "../Map/RenderMap";
import { MapState } from "../Map/MapState";
import { RenderRewardsModal } from "./Rewards/RenderRewardsModal";
import { PlayerState } from "../Entities/Player/PlayerState";

export const RenderBattle = observer(() => {
  const battleState = BattleState.get();
  const playerState = PlayerState.get();
  const mapState = MapState.get();

  const onRightClick = (e: { preventDefault: () => void }) => {
    // TODO Move logic onto onReleaseDrag on card
    e.preventDefault();
    // battleState.selectCard();
    // battleState.selectedSelf = false;
  };

  return (
    <Wrapper align="center" justify="center" onContextMenu={onRightClick}>
      <UnitWrappers align="flex-end" justify="space-between">
        <UnitContainer>
          <RenderPlayer />
        </UnitContainer>
        <UnitContainer>
          {BattleState.get().monsters?.map((monster) => (
            <RenderMonster monsterState={monster} />
          ))}
        </UnitContainer>
      </UnitWrappers>
      {mapState.showingMap ? (
        <RenderMap onClose={() => mapState.setShowingMap(false)} />
      ) : null}
      {battleState.wonBattle ? (
        <RenderRewardsModal
          onClickProceed={() => mapState.setShowingMap(true)}
        />
      ) : (
        <>
          <CurrentHandContainer>
            {battleState.currentHand.map((card) => (
              <RenderCard
                cardState={card}
                showIfCastable
                draggable
                calculateStatusesInCardText
              />
            ))}
          </CurrentHandContainer>
          <EndTurnButton
            onClick={() => battleState.endTurn()}
            noOptionsLeft={
              battleState.currentMana === 0 ||
              battleState.currentHand.every(
                (card) => card.manaCost > battleState.currentMana
              ) || battleState.currentHand.length === 0
            }
          >
            End Turn
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
              cardsToSelect={battleState.selectedCard?.cardSelection?.amount}
              onFinishSelectingCards={(cards: CardState[]) => {
                battleState.selectedCard?.cardSelection?.selectCards(cards);
                battleState.setCardsToShow();
              }}
              showReturnButton={!battleState.selectedCard?.cardSelection}
              calculateStatusesInCardText={
                // we want to calculate statuses in card text during combat
                // but not during card reward screen
                !!battleState.selectedCard?.cardSelection
              }
            />
          ) : null}
        </>
      )}
    </Wrapper>
  );
});

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
  gap: 70px;
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
