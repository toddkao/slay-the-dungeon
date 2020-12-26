import styled, { css } from "styled-components";

export const Typography = styled.p<{
  fontSize?: number;
  outline?: boolean;
  color?: string;
}>`
  margin: 0;
  font-family: "Kreon", serif;
  ${({ fontSize }) =>
    fontSize ? `font-size:${fontSize}px` : "font-size: 14px"};
  ${({ outline }) =>
    outline
      ? css`
          text-shadow: -1px -1px 0 #000, 0 -1px 0 #000, 1px -1px 0 #000,
            1px 0 0 #000, 1px 1px 0 #000, 0 1px 0 #000, -1px 1px 0 #000,
            -1px 0 0 #000;
        `
      : ""};
  ${({ color }) =>
  color ? `color: ${color};` : ""};
`;
