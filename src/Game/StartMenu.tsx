import React from 'react';
import styled from 'styled-components';
import { Column, Row } from '../Layout';
import { Typography } from '../Typography';
import { Link } from 'react-router-dom';
import { Player } from './PlayerState';

const Wrapper = styled(Row)`
  width: 100vw;
  height: 100vh;
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
          { player.render() }
        </Link>
      </Column>
    </Wrapper>
  );
}
