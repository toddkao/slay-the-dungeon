import React from 'react';
import styled from 'styled-components';
import { Row } from '../Layout';
import { Player } from './Entities/Player';

const Wrapper = styled(Row)`
  width: 100vw;
  height: 100vh;
`;

const MapNode = styled.div`
`;

export function Map() {
  const player = new Player();
  return (
    <Wrapper align="center" justify="center">
      <MapNode />
    </Wrapper>
  );
}
