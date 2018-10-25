export type State = {
  tasks: {
    id: number;
    name: string;
    parentId?: number;
    status: {
      done: boolean;
    };
  }[];
  option: {
    name: string;
  };
};

export const createState = (): State => {
  return {
    tasks: [
      {
        id: 1,
        name: "task1",
        status: {
          done: true
        }
      },
      {
        id: 2,
        name: "task2",
        status: {
          done: false
        }
      },
      {
        id: 3,
        name: "task1-1",
        parentId: 1,
        status: {
          done: false
        }
      }
    ],
    option: {
      name: "option name"
    }
  };
};

export const remove = (
  id: number,
  update: (updater: (state: State) => void) => void
) => {
  update(state => {
    // find the task.
    const task = state.tasks.find(t => t.id === id)!;

    // find and remove children.
    state.tasks
      .filter(t => t.parentId === task.id)
      .forEach(t => remove(t.id, update));

    state.tasks.splice(state.tasks.indexOf(task), 1);
  });
};
