import { State, createState, remove } from "./fixtures";
import { define, Patch } from "../src";

test("patches", () => {
  const { update, onPatches, set } = define<State>();
  set(createState());
  onPatches(patches => {
    expect(patches.length).toBe(1);
  });
  update(state => (state.tasks[0].name = "modified task1"));
});

test("patches with recursive update", () => {
  const { update, set, onPatches } = define<State>();
  set(createState());
  onPatches(patches => {
    expect(patches.length).toBe(2);
  });
  remove(1, update);
});

test("apply patches", () => {
  const { update, set, get, applyPatches, onPatches } = define<State>();
  set(createState());
  let patches = [] as Patch[];
  onPatches((_, inverse) => (patches = [...patches, ...inverse]));
  remove(1, update);
  expect(get()!).toMatchSnapshot();
  applyPatches(patches);
  expect(get()!).toMatchSnapshot();
});
