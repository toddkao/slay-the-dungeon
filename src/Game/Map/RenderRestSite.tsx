import React from "react";
import styled from "styled-components";
import sleep from "../../Images/restsite/sleep.png";
import smith from "../../Images/restsite/smith.png";
import overShoulder from "../../Images/restsite/shoulder.png";
import { Column, Row } from "../../Layout";
import { Typography } from "../../Typography";
import { Player } from "../Entities/Player/Player";
import { useState } from "react";
import {
  ProceedButtonWrapper,
  RewardBannerText,
} from "../Battle/Rewards/RenderRewardsModal";
import proceedButton from "../../Images/UI/reward/proceedButton.png";
import { RenderMap } from "./RenderMap";
import { Map } from "./Map";
import { observer } from "mobx-react";
import { ShowCardsModal } from "../Common/ShowCardsModal";
import { Card } from "../Cards/Card";

enum RestSiteOptionType {
  SLEEP,
  SMITH,
}

interface IRestSiteOption {
  type: RestSiteOptionType;
  img: string;
  description: () => string;
  onClick: () => void;
}

export const RenderRestSite = observer(() => {
  const restSiteOptions: IRestSiteOption[] = [
    {
      type: RestSiteOptionType.SLEEP,
      img: sleep,
      description: () =>
        `Heal for 30% of your max HP. (${thirtyPercentMaxHp}) \n Current Health: ${playerState.get.health}/${playerState.get.maxHealth}`,
      onClick: () => {
        if (
          playerState.get.health + thirtyPercentMaxHp >=
          playerState.get.maxHealth
        ) {
          playerState.get.health = playerState.get.maxHealth;
        } else {
          playerState.get.health += thirtyPercentMaxHp;
        }
        setOptionUsed(true);
      },
    },
    {
      type: RestSiteOptionType.SMITH,
      img: smith,
      description: () => "Upgrade 1 card of your choice",
      onClick: () => {
        setShowDeck(true);
      },
    },
  ];

  const [hoveredOption, selectHoveredOption] = useState(restSiteOptions[0]);
  const [optionUsed, setOptionUsed] = useState(false);
  const [showDeck, setShowDeck] = useState(false);

  const mapState = Map.get();
  const playerState = Player.get();

  const thirtyPercentMaxHp = playerState.get.maxHealth * 0.3;

  return (
    <ScreenWrapper>
      <Column style={{ width: "100vw" }} align="center">
        {showDeck && !optionUsed ? (
          <ShowCardsModal
            cards={Player.get().deck.map((card) => new Card(card))}
            onClose={() => setShowDeck(false)}
            cardsToSelect={1}
            onFinishSelectingCards={(cards: Card[]) => {
              Player.get().deck = Player.get().deck.map((card) => {
                if (card.id === cards[0].id) {
                  card.upgraded = true;
                }
                return card;
              });
              setShowDeck(false);
              setOptionUsed(true);
            }}
          />
        ) : null}

        {optionUsed ? (
          <>
            {mapState.showingMap ? (
              <RenderMap onClose={() => mapState.setShowingMap(false)} />
            ) : null}
            <ProceedButtonWrapper onClick={() => mapState.setShowingMap(true)}>
              <img src={proceedButton} alt="proceed" draggable={false} />
              <RewardBannerText fontSize={40} outline style={{ top: 36 }}>
                Proceed
              </RewardBannerText>
            </ProceedButtonWrapper>
          </>
        ) : (
          <>
            <Typography
              color="white"
              outline
              fontSize={50}
              as="pre"
              style={{ textAlign: "center", position: "absolute", top: "25vh" }}
            >
              {hoveredOption?.description()}
            </Typography>
            <Row style={{ width: "520px", flexWrap: "wrap" }}>
              {restSiteOptions.map((option) => (
                <Option
                  onMouseEnter={() => selectHoveredOption(option)}
                  onClick={() => option.onClick()}
                  src={option.img}
                  alt={option.description()}
                  draggable={false}
                />
              ))}
            </Row>
          </>
        )}
      </Column>
      <img
        src={overShoulder}
        alt="over-shoulder"
        style={{ pointerEvents: "none", position: "absolute", bottom: 0 }}
        draggable={false}
      />
    </ScreenWrapper>
  );
});

const Option = styled.img`
  animation: transform 1.2;
  &:hover {
    transform: scale(1.1);
  }
`;

const ScreenWrapper = styled(Row).attrs({
  align: "center",
  justify: "center",
})`
  width: 100vw;
  height: 100vh;
  background-color: black;
  overflow: hidden;
`;
