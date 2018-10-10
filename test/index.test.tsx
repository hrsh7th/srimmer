import * as React from "react";
import { create } from "react-test-renderer";
import { define } from "../src";

let state: {
  consumer1: { value: number };
  consumer2: { value: number };
};
type State = typeof state;

beforeAll(() => {
  state = {
    consumer1: { value: 0 },
    consumer2: { value: 0 }
  };
});

test("Should re-rendering only part of consumers.", () => {
  const { Provider, update, select } = define<State>();
  const renderCount = { consumer1: 0, consumer2: 0 };
  const Consumer1 = select(state => state.consumer1);
  const Consumer2 = select(state => state.consumer2);
  const component = create(
    <Provider state={state}>
      <Consumer1>
        {state => (
          <div>
            {String(state.value)}
            {String(renderCount.consumer1++)}
          </div>
        )}
      </Consumer1>
      <Consumer2>
        {state => (
          <div>
            {String(state.value)}
            {String(renderCount.consumer2++)}
          </div>
        )}
      </Consumer2>
    </Provider>
  );
  update(state => state.consumer1.value++);
  expect(component.toJSON()).toMatchSnapshot();
  update(state => state.consumer2.value++);
  expect(component.toJSON()).toMatchSnapshot();
});

test("Should re-rendering only part of consumers if nested.", () => {
  const { Provider, update, select } = define<State>();
  const renderCount = { consumer1: 0, consumer2: 0 };
  const Consumer1 = select(state => state.consumer1);
  const Consumer2 = select(state => state.consumer2);
  const Test1 = () => (
    <Consumer1>
      {state => (
        <div>
          {String(state.value)}
          {String(renderCount.consumer1++)}
        </div>
      )}
    </Consumer1>
  );
  const Test2 = () => (
    <Consumer2>
      {state => (
        <div>
          {String(state.value)}
          {String(renderCount.consumer2++)}
        </div>
      )}
    </Consumer2>
  );
  const component = create(
    <Provider state={state}>
      <Test1 />
      <Test2 />
    </Provider>
  );
  update(state => state.consumer1.value++);
  expect(component.toJSON()).toMatchSnapshot();
  update(state => state.consumer2.value++);
  expect(component.toJSON()).toMatchSnapshot();
});
