import React from "react";
import styled, { css } from "styled-components";
import { Column, Row } from "../../Layout";
import { Modal } from "../Common/Modal";
import Xarrow from "react-xarrows";
import cancelButton from "../../Images/cancel-button.png";
import { mapNodeType, mapNodeTypeToImage, Map } from "./Map";
import { observer } from "mobx-react";

export const RenderMap = observer(
  ({
    onClose,
    hideReturn = false,
  }: {
    onClose?: () => void,
    hideReturn?: boolean,
  }) => {
    const map = new Map();

    const { matrix, paths } = map.currentFloor;
    const { selectNode, selectableNodeIds, traversedNodeIds } = map;

    return (
      <Modal>
        <Wrapper>
          {hideReturn ? null : (
            <ReturnButton onClick={onClose}>Return</ReturnButton>
          )}

          <Column style={{ gap: 200, maxHeight: "80vh", overflow: "auto" }}>
            {matrix.map((row, rowIndex) => {
              return (
                <Row
                  key={`row=${rowIndex}`}
                  style={{ gap: 100, position: "relative", width: "60vw" }}
                >
                  {row.map((node) => (
                    <MapNode
                      id={node.id}
                      key={node.id}
                      onClick={() => selectNode(node.id)}
                      style={{
                        left: node.left,
                        top: node.top,
                      }}
                      selectable={selectableNodeIds.includes(node.id)}
                      alreadyTraveledTo={traversedNodeIds.includes(node.id)}
                      nodeType={node.type}
                    />
                  ))}
                  {paths.map((path) => {
                    return (
                      <Xarrow
                        key={`${path.start}-${path.end}`}
                        start={path.start}
                        end={path.end}
                        path="straight"
                        headSize={0}
                        dashness={true}
                        lineColor="black"
                      />
                    );
                  })}
                </Row>
              );
            })}
          </Column>
        </Wrapper>
      </Modal>
    );
  }
);

const ReturnButton = styled.div`
  font-size: 30px;
  background: url(${cancelButton});
  text-shadow: -1px -1px 0 #000, 0 -1px 0 #000, 1px -1px 0 #000, 1px 0 0 #000,
    1px 1px 0 #000, 0 1px 0 #000, -1px 1px 0 #000, -1px 0 0 #000;
  color: white;
  width: 270px;
  height: 135px;
  position: absolute;
  bottom: 200px;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  background-color: beige;
`;

const MapNode = styled.div<{
  nodeType: mapNodeType;
  selectable: boolean;
  alreadyTraveledTo: boolean;
}>`
  @keyframes grow {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }

  ${({ selectable }) =>
    selectable
      ? css`
          animation: grow 1s infinite;

          &:hover {
            background-color: white;
            border-radius: 50%;
          }
        `
      : ""}

  ${({ alreadyTraveledTo }) =>
    alreadyTraveledTo
      ? css`
          opacity: 0.3;
        `
      : ""}

  background: url(${({ nodeType }) => mapNodeTypeToImage[nodeType]});
  background-size: contain;
  background-size: 100px 100px;
  background-position: center;
  height: 80px;
  width: 80px;
  position: absolute;
`;
