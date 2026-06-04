import test from "node:test";
import assert from "node:assert";
import {getUserIds} from "./storage.js";
import { sortBookmarksByDate } from "./bookmarkUtils.js";

test("User count is correct", () => {
  assert.equal(getUserIds().length, 5);
});


// Sorts bookmarks newest first
test("sorts bookmarks newest first", () => {
  const input = [
    { timestamp: "2023-01-01T10:00:00.000Z" },
    { timestamp: "2023-01-03T10:00:00.000Z" },
    { timestamp: "2023-01-02T10:00:00.000Z" }
  ];

  const result = sortBookmarksByDate(input);

  assert.deepStrictEqual(
    result.map(b => b.timestamp),
    [
      "2023-01-03T10:00:00.000Z",
      "2023-01-02T10:00:00.000Z",
      "2023-01-01T10:00:00.000Z"
    ]
  );
});