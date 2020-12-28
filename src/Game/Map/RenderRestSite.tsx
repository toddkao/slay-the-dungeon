import React from "react";
import styled from "styled-components";
import sleep from "../../Images/restsite/sleep.png";
import smith from "../../Images/restsite/smith.png";
import overShoulder from "../../Images/restsite/shoulder.png";
import { Column, Row } from "../../Layout";
import { Typography } from "../../Typography";
import { Player } from "../Entities/Player/Player";
import { useState } from "react";
import { Battle } from "../Battle/Battle";

enum RestSiteOptionType {
  SLEEP,
  SMITH,
}

interface IRestSiteOption {
  type: RestSiteOptionType;
  img: string;
  description: () => string;
  onClick: () => void;
}

export const RenderRestSite = () => {
  const [hoveredOption, selectHoveredOption] = useState<
    IRestSiteOption | undefined
  >();
  const [optionUsed, setOptionUsed] = useState(false);

  const restSiteOptions: IRestSiteOption[] = [
    {
      type: RestSiteOptionType.SLEEP,
      img: sleep,
      description: () =>
        `Heal for 30% of your max HP. (${
          Player.get().maxHealth * 0.3
        }) \n Current Health: ${Player.get().health}/${Player.get().maxHealth}`,
      onClick: () => {
        if (
          Player.get().get.health + Player.get().maxHealth * 0.3 >=
          Player.get().get.maxHealth
        ) {
          Player.get().get.health = Player.get().get.maxHealth;
        } else {
          Player.get().get.health += Player.get().maxHealth * 0.3;
        }
        setOptionUsed(true);
      },
    },
    {
      type: RestSiteOptionType.SMITH,
      img: smith,
      description: () => "Upgrade 1 card of your choice",
      onClick: () => null,
    },
  ];

  return (
    <ScreenWrapper>
      <Column style={{ width: "100vw" }} align="center">
        {optionUsed ? (
          <>hi</>
        ) : (
          <>
            <Typography
              color="white"
              outline
              fontSize={50}
              as="pre"
              style={{ textAlign: "center", position: "absolute", top: "25vh" }}
            >
              {hoveredOption?.description()}
            </Typography>
            <Row style={{ zIndex: 2, width: "520px", flexWrap: "wrap" }}>
              {restSiteOptions.map((option) => (
                <Option
                  onMouseEnter={() => selectHoveredOption(option)}
                  onClick={option.onClick}
                  src={option.img}
                  alt={option.description()}
                  draggable={false}
                />
              ))}
            </Row>
          </>
        )}
      </Column>
      <img
        src={overShoulder}
        alt="over-shoulder"
        style={{ position: "absolute" }}
        draggable={false}
      />
    </ScreenWrapper>
  );
};

const Option = styled.img`
  animation: transform 1.2;
  &:hover {
    transform: scale(1.1);
  }
`;

const ScreenWrapper = styled(Row).attrs({
  align: "center",
  justify: "center",
})`
  width: 100vw;
  height: 100vh;
  background-color: black;
`;
