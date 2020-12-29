import React, { useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import { Column, Row } from "../../Layout";
import { Modal } from "../Common/Modal";
import Xarrow from "react-xarrows";
import { MapNodeType, mapNodeTypeToImage, MapState } from "./MapState";
import { observer } from "mobx-react";
import { BattleState } from "../Battle/BattleState";
import { ReturnButton } from "../Common/Clickables";

export const RenderMap = observer(
  ({
    onClose,
    hideReturn = false,
  }: {
    onClose?: () => void;
    hideReturn?: boolean;
  }) => {
    const mapState = MapState.get();
    const mapRef = useRef(null);

    useEffect(() => {
      const scrollToBottom = () => {
        (mapRef.current as any).scrollTop = (mapRef.current as any)?.scrollHeight;
      };
      scrollToBottom();
    }, []);

    const { matrix, paths } = mapState.currentFloor;
    const { selectNode, selectableNodeIds, traversedNodeIds } = mapState;

    return (
      <Modal>
        <Wrapper>
          {hideReturn ? null : (
            <ReturnButton onClick={onClose}>Return</ReturnButton>
          )}

          <Column
            ref={mapRef}
            style={{ gap: 200, maxHeight: "80vh", overflow: "auto" }}
          >
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
                      onClick={() => selectNode(node)}
                      style={{
                        left: node.left,
                        top: node.top,
                      }}
                      selectable={selectableNodeIds.includes(node.id)}
                      alreadyTraveledTo={traversedNodeIds.includes(node.id)}
                      nodeType={node.type}
                    />
                  ))}
                  {paths.map((path, index) => {
                    return (
                      <Xarrow
                        key={`${path.start}-${path.end}-${index}`}
                        start={path.start}
                        end={path.end}
                        path="straight"
                        headSize={3}
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

const Wrapper = styled.div`
  background-color: beige;
`;

const MapNode = styled.div<{
  nodeType: MapNodeType;
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
