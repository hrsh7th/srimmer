import { State, createState, remove } from "./fixtures";
import { define } from "../src";

test("patches", () => {
  const { update, patches, set } = define<State>();
  set(createState());
  patches(patches => {
    expect(patches.length).toBe(1);
  });
  update(state => (state.tasks[0].name = "modified task1"));
});

test("patches with recursive update", () => {
  const { update, set, patches } = define<State>();
  set(createState());
  patches(patches => {
    expect(patches.length).toBe(2);
  });
  remove(1, update);
});
