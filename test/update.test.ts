import { State, createState, remove } from "./fixtures";
import { define } from "../src";

test("update", () => {
  const { update, set, get } = define<State>();
  set(createState());
  update(state => (state.tasks[0].name = "modified task1"));
  expect(get()!).toMatchSnapshot();
});

test("update recursive", () => {
  const { update, set, get } = define<State>();
  set(createState());
  remove(1, update);
  expect(get()!).toMatchSnapshot();
});
