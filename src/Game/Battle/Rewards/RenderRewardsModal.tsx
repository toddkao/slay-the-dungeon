import { range, sample, uniqueId } from "lodash";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { cardsByRarity, rarityChance } from "../../Cards/CardDefinitions";
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
import { PlayerState } from "../../Entities/Player/PlayerState";
import proceedButton from "../../../Images/UI/reward/proceedButton.png";
import { CardState } from "../../Cards/CardState";

import { Chance } from "chance";

export const RenderRewardsModal = observer(
  ({ onClickProceed }: { onClickProceed: () => void }) => {
    const player = PlayerState.get();
    const [selectedReward, setSelectedReward] = useState<IReward | undefined>();
    const rewardList = [
      {
        id: uniqueId(),
        type: RewardTypes.CARD,
        cards: range(0, 3).map(
          () =>
            new CardState({
              name:
                sample(
                  new Chance().weighted(
                    Object.values(cardsByRarity),
                    rarityChance
                  )
                )?.name || "",
              id: uniqueId(),
              upgraded: false,
            })
        ),
      },
    ];
    const [rewards, setRewards] = useState<IReward[]>(rewardList);

    const renderCardReward = (reward: IReward) => {
      return (
        <RewardItem onClick={() => setSelectedReward(reward)}>
          <RewardListItemPanel src={rewardListItemPanel} />
          <RewardItemDetails>
            <img
              src={normalCardReward}
              alt="Normal Card Reward"
              draggable={false}
            />
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
                      case RewardTypes.CARD:
                        return renderCardReward(reward);
                      default:
                        break;
                    }
                    return null;
                  })}
                </RewardsWrapper>
              </RelativeWrapper>
              <ProceedButtonWrapper onClick={onClickProceed}>
                <img src={proceedButton} alt="proceed" draggable={false} />
                <RewardBannerText fontSize={40} outline style={{ top: 36 }}>
                  Proceed
                </RewardBannerText>
              </ProceedButtonWrapper>
            </Column>
          ) : selectedReward?.type === RewardTypes.CARD ? (
            <Column align="center">
              <RelativeWrapper style={{ zIndex: 1 }}>
                <RewardBanner src={selectBanner} style={{ marginBottom: 0 }} />
                <RewardBannerText fontSize={40} outline>
                  Choose a card!
                </RewardBannerText>
              </RelativeWrapper>
              <Row style={{ gap: 50 }}>
                {selectedReward?.cards?.map((card) => (
                  <RenderCard
                    cardState={card}
                    onClick={() => {
                      player.addCardToDeck(card.get.name);
                      setRewards(
                        rewards.filter(
                          (reward) => reward.id !== selectedReward.id
                        )
                      );
                      setSelectedReward(undefined);
                    }}
                  />
                ))}
              </Row>
              <Spacer size={70} />
              <SkipButtonWrapper onClick={() => setSelectedReward(undefined)}>
                <SkipButton
                  src={takeAll}
                  alt="skip"
                  style={{ zIndex: 1 }}
                  draggable={false}
                />
                <RewardBannerText fontSize={40} outline style={{ top: 5 }}>
                  Skip
                </RewardBannerText>
              </SkipButtonWrapper>
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

export const RewardBannerText = styled(Typography)`
  position: relative;
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

export const ProceedButtonWrapper = styled(RelativeWrapper)`
  filter: brightness(80%);
  &:hover {
    filter: brightness(100%);
  }
  right: 100px;
  bottom: 150px;
  position: absolute;
`;

const SkipButtonWrapper = styled(RelativeWrapper)`
  filter: brightness(80%);
  &:hover {
    filter: brightness(100%);
  }
`;

const SkipButton = styled.img``;
