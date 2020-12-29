import styled from "styled-components";
import cancelButton from "../Images/cancel-button.png";
import { Typography } from "../Typography";
import peekButton from '../Images/UI/peek_button.png';

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
