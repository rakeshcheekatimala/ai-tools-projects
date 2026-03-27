import { BoardState, BoardAction, Card } from "./types";

/**
 * Pure reducer for all board state mutations.
 * Returns a new state object; never mutates the original.
 */
export function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case "RENAME_COLUMN":
      return {
        ...state,
        columns: state.columns.map((col) =>
          col.id === action.columnId ? { ...col, title: action.title } : col
        ),
      };

    case "ADD_CARD": {
      const newCard: Card = {
        id: `card-${Date.now()}`,
        title: action.title.trim(),
        details: action.details.trim(),
        columnId: action.columnId,
      };
      return { ...state, cards: [...state.cards, newCard] };
    }

    case "DELETE_CARD":
      return {
        ...state,
        cards: state.cards.filter((c) => c.id !== action.cardId),
      };

    case "MOVE_CARD": {
      const card = state.cards.find((c) => c.id === action.cardId);
      if (!card) return state;

      const otherCards = state.cards.filter((c) => c.id !== action.cardId);
      const destColumnCards = otherCards.filter((c) => c.columnId === action.toColumnId);
      const restCards = otherCards.filter((c) => c.columnId !== action.toColumnId);

      const updatedCard = { ...card, columnId: action.toColumnId };
      const clampedIndex = Math.min(action.toIndex, destColumnCards.length);
      const newDestCards = [
        ...destColumnCards.slice(0, clampedIndex),
        updatedCard,
        ...destColumnCards.slice(clampedIndex),
      ];

      return { ...state, cards: [...restCards, ...newDestCards] };
    }

    default:
      return state;
  }
}
