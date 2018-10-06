import * as React from "react";
import { create as render } from "react-test-renderer";
import { define } from "../src";

const state = {
  consumer1: {
    value: 0
  },
  consumer2: {
    value: 0
  },
  array: [{ name: 1 }, { name: 2 }]
};
type State = typeof state;

test("Should re-rendering only part of consumers.", () => {
  const { Provider, update, create } = define<State>();
  let count1 = 0;
  let count2 = 0;
  const Consumer1 = create(state => state.consumer1);
  const Consumer2 = create(state => state.consumer2);
  const component = render(
    <Provider state={state}>
      <Consumer1>
        {state => (
          <div>
            consumer1-
            {state.value}
            {count1++}
          </div>
        )}
      </Consumer1>
      <Consumer2>
        {state => (
          <div>
            consumer2-
            {state.value}
            {count2++}
          </div>
        )}
      </Consumer2>
    </Provider>
  );
  update(state => (state.consumer1.value = state.consumer1.value + 1));
  expect(component.toJSON()).toMatchSnapshot();
  update(state => (state.consumer2.value = state.consumer2.value + 1));
  expect(component.toJSON()).toMatchSnapshot();
  update(state => removeArray(state.array));

  function removeArray(names: State["array"]) {
    names.pop();
  }
});
