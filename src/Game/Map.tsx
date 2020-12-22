import React from 'react';
import styled from 'styled-components';
import { Row } from '../Layout';
import { Player } from './PlayerState';

const Wrapper = styled(Row)`
  width: 100vw;
  height: 100vh;
`;

const MapNode = styled.div`
`;

export function Map() {
  const player = new Player();
  console.log(player);
  return (
    <Wrapper align="center" justify="center">
      <MapNode />
    </Wrapper>
  );
}
