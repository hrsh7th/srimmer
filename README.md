# srimmer.
Srimmer provides simple api to use react and immer.

inspired `react-copy-write`.

# usage.

## entrypoint
```typescript
import React from 'react';
import ReactDOM from 'react-dom';
import { define } from 'srimmer';

type Todo = {
  id: number;
  name: string;
  status: string;
};

type State = {
  todos: Todo[];
};

const {
  Provider,
  Consumer,
  update
} = define<State>();

export {
  Provider,
  Consumer,
  update
};

ReactDOM.render((
  <Provider state={createInitialState()}>
    <App />
  </Provider>
), document.getElementById('app')!);
```

## component
```typescript
import { create } from './path/to/entrypoint';

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

# todo
- Refactoring.
- Remove create api if improved typescript inference.

