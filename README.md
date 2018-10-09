# Srimmer

Srimmer provides simple api to use react, immer and TypeScript.

inspired `react-copy-write`.

I love react, immer, react-copy-write and TypeScript.

# Usage

## State

```typescript
import { define } from 'srimmer';

export type State = { ... };

export const {
  Provider,
  Consumer,
  select,
  update,
  get
} = define<State>();
```

## Provider

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

## Consumer

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
        <div key={todo.id}> update(state => state.value++)}>{todo.name} - {todo.status}</div>
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

# Note

- This library based on React.Context API.
  - Supported unstable_observedBits.

# ToDo

- Refactoring.
