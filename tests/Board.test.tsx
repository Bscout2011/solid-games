import fc from 'fast-check';

import { BoardArray, Player, checkWin } from "../src/Board";

describe("<Board />", () => {

  it("should win horizontally", () => {
    const board: (Player | null)[] = ["X", "X", "X", null, null, null, null, null, null];

    const result = checkWin(board);

    expect(result).toBe(true);
  });
});
