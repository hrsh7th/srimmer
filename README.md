# Srimmer

Srimmer provides simple api to use react, immer and TypeScript.

inspired `react-copy-write`.

# API

```typescript
import { define } from 'srimmer';

type State = { ... };

const {

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
   * @type {(select: <T>(state: State) => T) => Consumer<T>}
   */
  select,

  /**
   * State getter.
   * Note: Carefully. It makes implicit depends to state values.
   * @type {() => State}
   */
  get

} = define<State>();
```

# Usage

## define your state

```typescript
import { define } from 'srimmer';

export type State = { ... };

export const {
  Provider,
  select,
  update,
  get
} = define<State>();
```

## bootstrap

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

## consume state with selecter everywhere

```typescript
import { select, update } from './state';

const Consumer = select(state => ({
  todos: state.todos
}));

export default () => (
  <Consumer>
    {state => (
      <button onClick={onAddButtonClick}>add</button>
      {state.todos.map(todo => (
        <div key={todo.id}>{todo.name} - {todo.status}</div>
      ))}
    )}
  </Consumer>
);

const onAddButtonClick = () => {
  update(state => {
    state.todos.push({
      name: 'new todo',
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
