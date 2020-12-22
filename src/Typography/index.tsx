import styled from "styled-components";

export const Typography = styled.p<{fontSize?: number}>`
  font-family: 'Ubuntu', sans-serif;
  ${({fontSize}) => fontSize ? `font-size:${fontSize}px` : 'font-size: 14px'};
`;