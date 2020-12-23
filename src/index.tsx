import React from "react";
import ReactDOM from "react-dom";
import { Router } from "./Router";
import { BrowserRouter } from "react-router-dom";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Kreon, serif';
    font-style: normal;
    font-weight: 400;
    src: local('Kreon, serif'), local('Kreon, serif'),
        url('../src/Typography/Kreon-VariableFont_wght.ttf') format('truetype'), /* Safari, Android, iOS */
  }

  body {
    margin: 0;
  }
  * {
    font-family: 'Kreon, serif';
  }
`;

ReactDOM.render(
  <>
    <GlobalStyle />
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  </>,
  document.getElementById("root")
);
