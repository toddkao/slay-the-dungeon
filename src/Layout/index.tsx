import styled, { css } from "styled-components";

interface ILayoutProps {
  align?: string;
  justify?: string;
}

const layoutProps = css<ILayoutProps>`
  ${({ align }) => (align ? `align-items: ${align}` : "")};
  ${({ justify }) => (justify ? `justify-content: ${justify}` : "")};
`;

export const Row = styled.div<ILayoutProps>`
  ${layoutProps};
  display: flex;
`;

export const Column = styled.div<ILayoutProps>`
  ${layoutProps};
  display: flex;
  flex-direction: column;
`;

export const Spacer = styled.div<{ size: number }>`
  ${({ size }) =>
    css`
      margin: ${size}px;
    `};
`;

export const RelativeWrapper = styled.div<ILayoutProps>`
  position: relative;
`;

export const horizontalCenterAbsolute = css`
  transform: translateX(-50%);
  left: 50%;
  position: absolute;
`;
