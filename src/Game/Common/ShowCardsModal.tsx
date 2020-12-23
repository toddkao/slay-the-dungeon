import { observer } from "mobx-react";
import styled from "styled-components";
import { Row } from "../../Layout";
import { Typography } from "../../Typography";
import { Card } from "../Card";

const Wrapper = styled.div``;

interface ICards {
  cards: Card[];
}

export const ShowCardsModal = observer((props: ICards) => (
  <Wrapper>
    {props.cards.map((card) => card.render(`show-cards-${card.id}`))}
  </Wrapper>
));
