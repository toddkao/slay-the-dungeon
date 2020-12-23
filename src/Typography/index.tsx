import styled from "styled-components";

export const Typography = styled.p<{fontSize?: number}>`
  margin: 0;
  font-family: 'Kreon', serif;
  ${({fontSize}) => fontSize ? `font-size:${fontSize}px` : 'font-size: 14px'};
`;