# srimmer.

Srimmer provides simple api to use react and immer.

inspired `react-copy-write`.

I love immer and react-copy-write.

# usage.

## state

```typescript
import { define } from 'srimmer';

export type State = { ... };

export const {
  Provider,
  Consumer,
  create,
  update,
  get
} = define<State>();
```

## entrypoint

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
```

## Consumer(with TypeScript type inference api).

```typescript
import { create } from './state';

const Consumer = create(state => {
  return {
    todos: state.todos
  };
});

export default (props: { ... }) => (
  <Consumer>
    {state => (
      {state.todos.map(todo => (
        <div key={todo.id}>{todo.name} - {todo.status}</div>
      ))}
    )}
  </Consumer>
);
```

## Consumer(default api).

```typescript
import { Consumer, State } from './state';

const select = (state: State) => {
  return {...};
};

export default (props: { ... }) => (
  <Consumer<ReturnType<typeof select>> select={select}>
    {state => (
      ...
    )}
  </Consumer>
);
```

# note

- If you use typescript, you should `create` api for type inference.
- This library based on React.Context API.
  - Supported unstable_observedBits.

# todo

- Refactoring.
