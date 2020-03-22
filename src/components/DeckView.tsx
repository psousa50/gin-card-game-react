import React from "react";
import * as Moves from "../gin-card-game/Moves/domain";
import { CardView } from "./CardView";
import { Card } from "../gin-card-game/Cards/model";
import { OnMove } from "../models";
import { PlayerId } from "../gin-card-game/Players/model";
import { MoveType } from "../gin-card-game/Moves/model";

require("./DeckView.css");

interface DeckViewProps {
  discardPile: Card[];
  playerId: PlayerId;
  onMove: OnMove;
  cardWidth: number;
}

export const DeckView: React.FC<DeckViewProps> = ({
  discardPile,
  onMove,
  playerId,
  cardWidth
}) => (
  <div className="deck">
    <div className="cards">
      <CardView
        width={cardWidth}
        onClick={() => onMove(playerId)(Moves.create(MoveType.DrawCard))}
      />
    </div>
    {discardPile.length > 0 ? (
      <div className="cards">
        <CardView
          card={discardPile[0]}
          width={cardWidth}
          onClick={() => onMove(playerId)(Moves.create(MoveType.PickCard))}
        />
      </div>
    ) : null}
  </div>
);
