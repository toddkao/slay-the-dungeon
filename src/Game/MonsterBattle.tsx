import React from 'react';
import styled from 'styled-components';
import { Row } from '../Layout';
import { JawWorm, Louse } from './Monster';
import { Player } from './PlayerState';

const Wrapper = styled(Row)`
  position: relative;
  background-color: black;
  padding: 0 100px 0 100px;
  height: 100vh;
`;

const UnitContainer = styled(Row).attrs({
  align: 'flex-end'
})`
  top: 50vh;
  gap: 10px;
  height: 200px;
`;

const CurrentHandContainer = styled(Row).attrs({
  align: 'center',
  justify: 'center',
})`
  position: absolute;
  width: 80vw;
  bottom: 0;
  height: 200px;
  transform: translateX(-50%);
  left: 50%;
`;

export function MonsterBattle() {
  const player = new Player();
  player.newHand();
  console.log(player);
  return (
    <Wrapper align="center" justify="space-between">
      <UnitContainer>
        { player.render() }
      </UnitContainer>
      <UnitContainer>
        { Louse.render() }
        { JawWorm.render() }
      </UnitContainer>
      <CurrentHandContainer>
        { player.stats.hand.map(card => card.render())}
      </CurrentHandContainer>
    </Wrapper>
  );
}
