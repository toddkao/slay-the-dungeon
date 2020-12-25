import React from 'react';
import styled from 'styled-components';
import { Column, Row } from '../Layout';
import { Typography } from '../Typography';
import { Link } from 'react-router-dom';
import { Player } from './Entities/Player/Player';
import { RenderPlayer } from './Entities/Player/RenderPlayer';
import background from "../Images/background.jpg";
import { RenderMap } from './Map/RenderMap';

const Wrapper = styled(Row)`
  ${`background: url(${background})`};
  overflow: hidden;
  background-position: bottom;
  position: relative;
  height: 100vh;
  width: 100vw;
`;

export function StartMenu() {
  const player = new Player();
  return (
    <Wrapper align="center" justify="center">
      <Column align="center" justify="center">
        <Typography fontSize={24}>
          Select your character
        </Typography>
        <Link to="/battle" >
          <RenderPlayer playerState={player} />
        </Link>
      </Column>
      <RenderMap onClose={() => undefined} hideReturn />
    </Wrapper>
  );
}
