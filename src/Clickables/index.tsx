import styled from "styled-components";
import cancelButton from "../Images/cancel-button.png";
import { Typography } from "../Typography";

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
