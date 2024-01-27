import fc from "fast-check";

import {
  TicTacToe,
  BoardArray,
  Player,
  checkWin,
  initBoard,
} from "../src/TicTacToe";
import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { it } from "vitest";

describe("<TicTacToe />", () => {
  it("should render the board", () => {
    render(() => <TicTacToe />);

    const board = screen.getByTestId("tic-tac-toe-board");
    expect(board).toBeInTheDocument();
  });

  it("should change the boardSize", () => {
    render(() => <TicTacToe />);

    const board = screen.getByTestId("tic-tac-toe-board");
    expect(board).toBeInTheDocument();
    expect(board.children.length).toBe(3 ** 2);

    const optionsButton = screen.getByTestId("board-options-button");
    expect(optionsButton).toBeInTheDocument();
    fireEvent.click(optionsButton);

    const boardSizeButton = screen.getByTestId("board-size-button");
    expect(boardSizeButton).toBeInTheDocument();
    fireEvent.click(boardSizeButton);

    expect(board.children.length).toBe(4 ** 2);
  });

  it("should win horizontally", () => {
    for (const boardSize of [3, 4]) {
      for (let rowIndex = 0; rowIndex < boardSize; rowIndex++) {
        rowIndex = rowIndex % boardSize;
        const board = initBoard(boardSize as 3 | 4);
        const occupant = "X";

        for (let i = 0; i < boardSize; i++) {
          board[rowIndex * boardSize + i] = occupant;
        }

        expect(checkWin(board)).toBe(true);
      }
    }
  });

  it("should win vertically", () => {
    for (const boardSize of [3, 4]) {
      for (let columnIndex = 0; columnIndex < boardSize; columnIndex++) {
        const board = initBoard(boardSize as 3 | 4);
        const occupant = "X";

        for (let i = 0; i < boardSize; i++) {
          board[i * boardSize + columnIndex] = occupant;
        }

        expect(checkWin(board)).toBe(true);
      }
    }
  });

  it("should win diagonally", () => {
    for (const boardSize of [3, 4]) {
      const board = initBoard(boardSize as 3 | 4);
      const occupant = "X";

      for (let i = 0; i < boardSize; i++) {
        board[i * boardSize + i] = occupant;
      }

      expect(checkWin(board)).toBe(true);
    }
  });

  it("should win diagonally (right)", () => {
    for (const boardSize of [3, 4]) {
      const board = initBoard(boardSize as 3 | 4);
      const occupant = "X";

      for (let i = 0; i < boardSize; i++) {
        board[i * boardSize + (boardSize - 1 - i)] = occupant;
      }

      expect(checkWin(board)).toBe(true);
    }
  });

  it("should not win", () => {
    for (const boardSize of [3, 4]) {
      const board = initBoard(boardSize as 3 | 4);
      expect(checkWin(board)).toBe(false);
    }
  });
});
