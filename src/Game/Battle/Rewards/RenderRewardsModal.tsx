import { range, sample, uniqueId } from "lodash";
import { observer } from "mobx-react";
import React, { useState } from "react";
import {
  cardsByRarity,
  rarityChance,
} from "../../Cards/CardDefinitions";
import { RenderCard } from "../../Cards/RenderCard";
import { Modal } from "../../Common/Modal";
import rewardScreenSheet from "../../../Images/UI/reward/rewardScreenSheet.png";
import normalCardReward from "../../../Images/UI/reward/normalCardReward.png";
import rewardListItemPanel from "../../../Images/UI/reward/rewardListItemPanel.png";
import selectBanner from "../../../Images/UI/selectBanner.png";
import styled from "styled-components";
import {
  Column,
  horizontalCenterAbsolute,
  RelativeWrapper,
  Row,
  Spacer,
} from "../../../Layout";
import { Typography } from "../../../Typography";
import { IReward, RewardTypes } from "./RewardDefinition";
import takeAll from "../../../Images/UI/reward/takeAll.png";
import { Player } from "../../Entities/Player/Player";
import proceedButton from "../../../Images/UI/reward/proceedButton.png";
import { Card, ICard } from "../../Cards/Card";

import { Chance } from "chance";

export const RenderRewardsModal = observer(
  ({ onClickProceed }: { onClickProceed: () => void }) => {
    const player = Player.get();
    const [selectedReward, setSelectedReward] = useState<IReward | undefined>();
    const [rewards, setRewards] = useState<IReward[]>([
      {
        id: uniqueId(),
        type: RewardTypes.card,
        cards: () => {
          return range(0, 3).map(
            () =>
              new Card({
                ...(sample(
                  new Chance().weighted(
                    Object.values(cardsByRarity),
                    rarityChance
                  )
                ) as ICard),
                id: uniqueId(),
              })
          );
        },
      },
    ]);

    const renderCardReward = (reward: IReward) => {
      return (
        <RewardItem onClick={() => setSelectedReward(reward)}>
          <RewardListItemPanel src={rewardListItemPanel} />
          <RewardItemDetails>
            <img src={normalCardReward} alt="Normal Card Reward" />
            <Spacer size={10} />
            <Typography color="white" fontSize={20} outline>
              Add a card to your deck
            </Typography>
          </RewardItemDetails>
        </RewardItem>
      );
    };

    return (
      <Modal>
        <>
          {selectedReward === undefined ? (
            <Column align="center" justify="center">
              <RelativeWrapper style={{ zIndex: 1 }}>
                <RewardBanner src={selectBanner} />
                <RewardBannerText fontSize={40} outline>
                  Rewards!
                </RewardBannerText>
              </RelativeWrapper>
              <RelativeWrapper>
                <RewardBackdrop src={rewardScreenSheet} />
                <RewardsWrapper>
                  {rewards.map((reward) => {
                    switch (reward.type) {
                      case RewardTypes.card:
                        return renderCardReward(reward);
                      default:
                        break;
                    }
                  })}
                </RewardsWrapper>
              </RelativeWrapper>
              <ProceedButtonWrapper onClick={onClickProceed}>
                <img src={proceedButton} alt="proceed" />
                <RewardBannerText fontSize={40} outline style={{ top: 230 }}>
                  Proceed
                </RewardBannerText>
              </ProceedButtonWrapper>
            </Column>
          ) : selectedReward?.type === RewardTypes.card ? (
            <Column align="center">
              <RelativeWrapper style={{ zIndex: 1 }}>
                <RewardBanner src={selectBanner} style={{ marginBottom: 0 }} />
                <RewardBannerText fontSize={40} outline>
                  Choose a card!
                </RewardBannerText>
              </RelativeWrapper>
              <Row style={{ gap: 50 }}>
                {selectedReward?.cards()?.map((card) => (
                  <RenderCard
                    cardState={card}
                    onClick={() => {
                      player.addCardToDeck(card);
                      setRewards(
                        rewards.filter(
                          (reward) => reward.id !== selectedReward.id
                        )
                      );
                      setSelectedReward(undefined);
                    }}
                    showIfCastable={false}
                    draggable={false}
                  />
                ))}
              </Row>
              <RelativeWrapper style={{ zIndex: 1 }}>
                <SkipButton
                  src={takeAll}
                  alt="skip"
                  style={{ zIndex: 1 }}
                  onClick={() => setSelectedReward(undefined)}
                />
                <RewardBannerText fontSize={40} outline style={{ top: 100 }}>
                  Skip
                </RewardBannerText>
              </RelativeWrapper>
            </Column>
          ) : null}
        </>
      </Modal>
    );
  }
);

const RewardBanner = styled.img`
  margin-bottom: -190px;
  z-index: 1;
`;

const RewardBannerText = styled(Typography)`
  ${horizontalCenterAbsolute};
  text-align: center;
  color: white;
  top: 65px;
`;

const RewardBackdrop = styled.img``;

const RewardsWrapper = styled(Column)`
  position: absolute;
  top: 130px;
  left: 75px;
  width: 465px;
`;

const RewardItem = styled(Row)`
  opacity: 0.8;
  z-index: 1;
  &:hover {
    opacity: 1;
  }
`;

const RewardItemDetails = styled(Row).attrs({
  align: "center",
})`
  position: absolute;
  top: 15px;
  left: 25px;
  height: 75px;
`;

const RewardListItemPanel = styled.img``;

const ProceedButtonWrapper = styled(RelativeWrapper)`
  &:hover {
    transform: scale(1.2);
  }
  right: 0;
  bottom: 0;
  position: absolute;
`;

const SkipButton = styled.img``;
