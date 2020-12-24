import strike from "../../Images/strike.png";
import defend from "../../Images/defend.png";
import { Card, CardEffectType, CardType } from "./Card";
import { StatusType } from "../Common/StatusBar";

const Strike = (id: string) =>
    new Card({
        id,
        name: "Strike",
        manaCost: 1,
        damage: 6,
        image: strike,
        type: CardType.Attack,
        effect: CardEffectType.SingleTarget,
        description: `Deal {} damage`,
        descriptionVariables: ["damage"],
        targetEnemy: true,
    });

const Bash = (id: string) =>
    new Card({
        id,
        name: "Bash",
        manaCost: 2,
        damage: 8,
        status: {
            type: StatusType.vulnerable,
            amount: 2,
            degrades: true,
        },
        image: strike,
        type: CardType.Attack,
        effect: CardEffectType.SingleTarget,
        description: `Deal {} damage.\nApply 2 vulnerable.`,
        descriptionVariables: ["damage"], //TODO: how to change 2 to status.amount?
        targetEnemy: true,
    });

const Defend = (id: string) =>
    new Card({
        id,
        name: "Defend",
        manaCost: 1,
        block: 5,
        image: defend,
        type: CardType.Skill,
        effect: CardEffectType.AddBlock,
        description: "Gain {} Block",
        descriptionVariables: ["block"],
        targetEnemy: false,
    });

export const cards = { strike: Strike, defend: Defend, bash: Bash }