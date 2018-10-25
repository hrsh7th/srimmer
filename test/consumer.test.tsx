import * as React from "react";
import { create } from "react-test-renderer";
import { define } from "../src";
import { State, createState } from "./fixtures";

test("Should re-rendering only part of consumers.", () => {
  const { Provider, update, select } = define<State>();
  const Consumer1 = select(state => state.tasks);
  const Consumer2 = select(state => state.option);
  const counter = { consumer1: 0, consumer2: 0 };
  const component = create(
    <Provider state={createState()}>
      <Consumer1>
        {tasks => (
          <div>
            {tasks[0].name}
            {counter.consumer1++}
          </div>
        )}
      </Consumer1>
      <Consumer2>
        {option => (
          <div>
            {option.name}
            {counter.consumer2++}
          </div>
        )}
      </Consumer2>
    </Provider>
  );
  update(state => (state.tasks[0].name = "modified task1"));
  expect(component.toJSON()).toMatchSnapshot();
  update(state => (state.option.name = "modified option name"));
  expect(component.toJSON()).toMatchSnapshot();
});

test("Should re-rendering only part of consumers if nested.", () => {
  const { Provider, update, select } = define<State>();
  const Consumer1 = select(state => state.tasks);
  const Consumer2 = select(state => state.option);
  const counter = { consumer1: 0, consumer2: 0 };
  const Test1 = () => (
    <Consumer1>
      {tasks => (
        <div>
          {tasks[0].name}
          {counter.consumer1++}
        </div>
      )}
    </Consumer1>
  );
  const Test2 = () => (
    <Consumer2>
      {option => (
        <div>
          {option.name}
          {counter.consumer2++}
        </div>
      )}
    </Consumer2>
  );
  const component = create(
    <Provider state={createState()}>
      <Test1 />
      <Test2 />
    </Provider>
  );
  update(state => (state.tasks[0].name = "modified task1"));
  expect(component.toJSON()).toMatchSnapshot();
  update(state => (state.option.name = "modified option name"));
  expect(component.toJSON()).toMatchSnapshot();
});
