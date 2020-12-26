import { observer } from "mobx-react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import React from 'react';

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

interface IModal {
  children: React.ReactElement | React.ReactElement[];
}

export const Modal = observer((props: IModal) => {
  return ReactDOM.createPortal(
    <Wrapper>{props.children}</Wrapper>,
    document.body
  );
});
