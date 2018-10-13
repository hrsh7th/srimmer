# Srimmer

Srimmer provides simple api to use react, immer and TypeScript.

inspired `react-copy-write`.

# API

```typescript
import { define, Select } from "srimmer";

/**
 * Extract consumer's selected state. `Select<typeof Consumer>`
 */
export { Select };

/**
 * Your state.
 */
type State = {
  todos: {
    name: string;
    status: string;
  }[];
};

/**
 * Define some state utilities from your state type.
 */
const defined = define<State>();

export const {
  /**
   * State provider.
   * @type {React.ComponentType<{ state: State; }>}
   */
  Provider,

  /**
   * State updater.
   * @type {(updater: (state: State) => void) => void}
   */
  update,

  /**
   * State selector.
   * @type {<T>(select: (state: State) => T) => Consumer<T>}
   */
  select,

  /**
   * State getter.
   * Note: Carefully. It makes implicit depends to state values.
   * @type {() => State}
   */
  get,

  /**
   * State setter.
   * Note: For testing.
   * @type {(state: State) => void}
   */
  set
} = defined;
```

# Real World Usage

## define your state (src/state/index.ts)

```typescript
import { define, Select } from 'srimmer';

export type State = { ... };

export const {
  Provider,
  select,
  update,
  get,
  set
} = define<State>();

export { Select };
```

## define your action (src/action/index.ts)

```typescript
import { update } from "../../state";

export const addNewTask = () => {
  update(state => {
    state.todos.push({
      name: `new todo ${state.todos.length}`,
      status: "todo"
    });
  });
};
```

## bootstrap (src/index.tsx)

```typescript
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "./state";

ReactDOM.render(
  <Provider state={createInitialState()}>
    <App />
  </Provider>,
  document.getElementById("app")!
);

function createInitialState() {
  return JSON.stringify(document.getElementById("app")!.getAttribute("data"));
}
```

## consume state (src/component/\*_/_.tsx)

```typescript
import { select, Select } from '../../state';
import { addNewTask } from '../action';

const Consumer = select(state => ({
  todos: state.todos
}));

export default () => (
  <Consumer>
    {state => (
      <button onClick={() => onAddButtonClick(state)}>add</button>
      <div>{todos(state)}</div>
    )}
  </Consumer>
);

const todos = (state: Select<typeof Consumer>) => {
  return state.todos.map(todo => (
    <div key={todo.id}>{todo.name} - {todo.status}</div>
  ));
}

const onAddButtonClick = () => {
  addNewTask();
};
```

## testing your updater (test/action/index.test.ts)

```typescript
import diff from 'snapshot-diff'; # https://github.com/jest-community/snapshot-diff
import { set, get } from '../../../src/state';
import { addNewTask } from '../../../src/action';

beforeEach(() => {
  set({ ...fixture });
});

test('addNewTask', () => {
  const state = get()!;
  addNewTask();
  expect(diff(state, get()!)).toMatchSnapshot();
});
```

# Recommended Structure

```bash
/src
  /state      # State schemas and querying utility functions.
    index.ts
  /action     # State updators.
    index.ts
  /component  # State selectors.
    index.tsx
  index.tsx   # Bootstrap.
```

See `hrsh7th/ganttcharty`.
