import { Player, checkWin } from "../src/Board";

describe("checkWin", () => {
  it("should win horizontally", () => {
    const board: Player[] = ["X", "X", "X", null, null, null, null, null, null];

    const result = checkWin(board);

    expect(result).toBe(true);
  });
});
