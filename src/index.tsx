import React from "react";
import ReactDOM from "react-dom";
import { AppHistory, MyRouter } from "./Router";
import { createGlobalStyle } from "styled-components";
import cursor from "./Images/cursor.png";
import { MapState } from "./Game/Map/MapState";

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
    cursor: url(${cursor}), default;
  }
  
  * {
    font-family: 'Kreon, serif';
    -moz-user-select: -moz-none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    ::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;

    /*
      Introduced in IE 10.
      See http://ie.microsoft.com/testdrive/HTML5/msUserSelect/
    */
    -ms-user-select: none;
    user-select: none;
  }
`;

const mapState = MapState.get();
if (!mapState.currentNode) {
  AppHistory.push("/");
}

ReactDOM.render(
  <>
    <GlobalStyle />
    <MyRouter />
  </>,
  document.getElementById("root")
);
