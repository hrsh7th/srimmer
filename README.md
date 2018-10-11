# Srimmer

Srimmer provides simple api to use react, immer and TypeScript.

inspired `react-copy-write`.

# API

```typescript
import { define, Select } from 'srimmer';

/**
 * Extract consumer's selected state. `Select<typeof Consumer>`
 */
export { Select };

/**
 * Your state.
 */
type State = { ... };

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
   * State updator.
   * @type {(updator: (state: State) => void) => void}
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
  get

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
  get
} = define<State>();

export { Select };
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
import { select, update, Select } from './state';

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
  update(state => {
    state.todos.push({
      name: `new todo ${state.todos.length}`,
      status: 'todo'
    });
  });
};
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
