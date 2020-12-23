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

  body, html {
    margin: 0;
  }
  
  * {
    font-family: 'Kreon, serif';
    -moz-user-select: -moz-none;
    -khtml-user-select: none;
    -webkit-user-select: none;

    /*
      Introduced in IE 10.
      See http://ie.microsoft.com/testdrive/HTML5/msUserSelect/
    */
    -ms-user-select: none;
    user-select: none;
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
