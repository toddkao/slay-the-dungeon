import styled, { css } from "styled-components";
import deck from "../../Images/UI/deck.png";
import drawPile from "../../Images/UI/drawPile.png";
import discardPile from "../../Images/UI/discardPile.png";
import map from "../../Images/UI/map.png";
import { RelativeWrapper } from '../../Layout/index';
import React from 'react';

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
