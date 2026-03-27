export interface Card {
  id: string;
  title: string;
  details: string;
  columnId: string;
}

export interface Column {
  id: string;
  title: string;
}

export interface BoardState {
  columns: Column[];
  cards: Card[];
}

export type BoardAction =
  | { type: "RENAME_COLUMN"; columnId: string; title: string }
  | { type: "ADD_CARD"; columnId: string; title: string; details: string }
  | { type: "DELETE_CARD"; cardId: string }
  | { type: "MOVE_CARD"; cardId: string; toColumnId: string; toIndex: number };
