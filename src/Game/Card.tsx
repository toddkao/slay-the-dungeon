import styled from "styled-components";
import cardImage from "../Images/card.png";

const Image = styled.div<{src: string}>`
  background: ${({src}) => `url(${src})`};
  background-size: contain;
  background-repeat: no-repeat;
  width: 155px;
  height: 200px;
`;

interface ICard {
  name: string;
  manaCost: number;
  damage?: number;
  block?: number;
  effect?: number;
}

export class Card {
  constructor(
    public card: ICard,
  ) {}

  render = () => {
    return (
      <Image src={cardImage} />
    )
  }
}

export const Strike = new Card({
  name: 'Strike',
  manaCost: 1,
  damage: 6,
});
export const Defend = new Card({
  name: 'Defend',
  manaCost: 1,
  block: 5,
});
