import React from "react";
import styled, { css } from "styled-components";
import deck from "../../Images/UI/deck.png";
import drawPile from "../../Images/UI/drawPile.png";
import discardPile from "../../Images/UI/discardPile.png";
import map from "../../Images/UI/map.png";
import { RelativeWrapper } from "../../Layout/index";
import cancelButton from "../../Images/cancel-button.png";
import peekButton from "../../Images/UI/peek_button.png";
import endTurnButton from "../../Images/UI/endTurnButton.png";
import { Typography } from "../../Typography";

export const DeckWithNumber = ({
  amount,
  ...props
}: {
  amount: number;
  onClick: () => void;
}) => IconWithBadge({ amount, props, renderIcon: <DeckIcon /> });

export const DrawPileWithNumber = ({
  amount,
  ...props
}: {
  amount: number;
  onClick: () => void;
}) => IconWithBadge({ amount, props, renderIcon: <DrawPileIcon /> });

export const DiscardPileWithNumber = ({
  amount,
  ...props
}: {
  amount: number;
  onClick: () => void;
}) =>
  IconWithBadge({
    amount,
    props,
    renderIcon: <DiscardPileIcon />,
    right: false,
  });

export const MapButton = ({ ...props }: { onClick: () => void }) =>
  IconWithBadge({
    props,
    renderIcon: <MapIcon />,
  });

const IconWithBadge = ({
  amount,
  renderIcon,
  props,
  right = true,
}: {
  amount?: number;
  renderIcon: React.ReactElement;
  right?: boolean;
  props?: any;
}) => {
  return (
    <div {...props}>
      <RelativeWrapper>
        {renderIcon}
        {amount !== undefined ? (
          <NumberBadge right={right}>{amount}</NumberBadge>
        ) : null}
      </RelativeWrapper>
    </div>
  );
};

const NumberBadge = styled.div<{ right: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  color: white;
  background-color: indianred;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  bottom: 25px;
  font-size: 22px;
  ${({ right }) =>
    right
      ? css`
          right: 5px;
        `
      : css`
          left: 5px;
        `}
`;

const iconStyles = css`
  &:hover {
    transform: scale(1.2);
  }
  background-size: contain;
  background-repeat: no-repeat;
  width: 120px;
  height: 120px;
`;

const DrawPileIcon = styled.div`
  background: url(${drawPile});
  ${iconStyles};
`;

const DiscardPileIcon = styled.div`
  background: url(${discardPile});
  ${iconStyles};
`;

export const DeckIcon = styled.div`
  background: url(${deck});
  ${iconStyles};
  width: 64px;
  height: 64px;
`;

export const MapIcon = styled.div`
  background: url(${map});
  ${iconStyles};
  width: 64px;
  height: 64px;
`;

export const ReturnButton = styled(Typography).attrs({
  fontSize: 30,
  outline: true,
})`
  background: url(${cancelButton});
  color: white;
  width: 270px;
  height: 135px;
  position: absolute;
  bottom: 200px;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PeekButton = styled(Typography)`
  background: url(${peekButton});
  background-repeat: no-repeat;
  z-index: 9;
  color: white;
  width: 130px;
  height: 120px;
  position: absolute;
  bottom: 50%;
  transform: translateY(50%);
  left: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: brightness(70%);
  &:hover {
    filter: brightness(100%);
  }
`;

export const EndTurnButton = styled(Typography).attrs({
  fontSize: 25,
})`
  background: url(${endTurnButton});
  background-repeat: no-repeat;
  background-position: center;
  z-index: 9;
  color: white;
  width: 210px;
  height: 90px;
  position: absolute;
  position: absolute;
  top: 70%;
  right: 10%;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: brightness(70%);
  &:hover {
    filter: brightness(100%);
  }
`;
