import React from 'react';
import styled from 'styled-components';
import { Row } from '../../Layout';
import { Modal } from '../Common/Modal';
import { Player } from '../Entities/Player';

const Wrapper = styled(Row)`
  width: 100vw;
  height: 100vh;
`;

const MapNode = styled.div`
  background-color: black;
  height: 40px;
  width: 40px;
`;

export function Map() {
  const player = new Player();
  return (
    <Modal>
      <MapNode />
    </Modal>
  );
}
