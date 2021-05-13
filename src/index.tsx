import React from "react";
import ReactDOM from "react-dom";
import { AppHistory, MyRouter } from "./Router";
import { createGlobalStyle } from "styled-components";
import customCursorImage from "./Images/cursor.png";
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
  }

  #customCursor {
    width: 64px;
    height: 64px;
    background: url(${customCursorImage});
    background-position: center;
    position: fixed;
    pointer-events: none;
    z-index: 999;
  }
  #customCursor.mouse-down {
    transform: rotate(-10deg);
  }

  * {
    /* cursor: none !important; */
    font-family: 'Kreon, serif';
    -moz-user-select: -moz-none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    ::-webkit-scrollbar {
      display: none;
    }
    user-select: none;
  }
`;

const mapState = MapState.get();
if (!mapState.currentNode) {
  AppHistory.push("/");
}

// const cursor = (e: any) => {
//   const mouseCursor: any = document.getElementById("customCursor");
//   if (!mouseCursor?.style) {
//     return;
//   }
//   mouseCursor.style.top = e.pageY + "px";
//   mouseCursor.style.left = e.pageX + "px";
// };

// const handleMouseDown = () => {
//   const mouseCursor: any = document.getElementById("customCursor");
//   mouseCursor.classList = ['mouse-down'];
// }

// const handleMouseUp = () => {
//   const mouseCursor: any = document.getElementById("customCursor");
//   mouseCursor.classList = [];
// }

// window.addEventListener("mousemove", cursor);
// window.addEventListener("mousedown", handleMouseDown);
// window.addEventListener("mouseup", handleMouseUp);

ReactDOM.render(
  <>
    {/* <div id="customCursor" /> */}
    <GlobalStyle />
    <MyRouter />
  </>,
  document.getElementById("root")
);
