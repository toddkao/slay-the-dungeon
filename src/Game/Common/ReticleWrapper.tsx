import styled, { css } from "styled-components";
import reticleCorner from "../../Images/combat/reticleCorner.png";

const ReticleRight = styled.span<{
  selected: boolean;
}>`
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  animation: fadeIn 1 ease-in-out;
  ${({ selected }) =>
    selected
      ? css`
          &::before {
            content: "";
            position: absolute;
            background: url(${reticleCorner});
            transform: rotate(90deg);
            background-repeat: no-repeat;
            width: 36px;
            height: 36px;
            top: 0;
            right: -20px;
          }
          &::after {
            content: "";
            position: absolute;
            background: url(${reticleCorner});
            transform: rotate(180deg);
            background-repeat: no-repeat;
            width: 36px;
            height: 36px;
            bottom: 0;
            right: -20px;
          }
        `
      : ""};
`;

const ReticleLeft = styled(ReticleRight)`
  ${({ selected }) =>
    selected
      ? css`
          &::before {
            transform: unset;
            top: 0;
            left: -20px;
          }
          &::after {
            transform: rotate(270deg);
            bottom: 0;
            left: -20px;
          }
        `
      : ""};
`;

interface IProps {
  children: React.ReactElement | React.ReactElement[];
  selected: boolean;
}

export const ReticleWrapper = (props: IProps) => {
  const { children, selected } = props;
  return (
    <ReticleRight selected={selected}>
      <ReticleLeft selected={selected}>{children}</ReticleLeft>
    </ReticleRight>
  );
};
