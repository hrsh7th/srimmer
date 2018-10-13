import produce from "immer";
import equals from "shallowequal";

/**
 * Select function.
 */
export type Select<State, T = any> = (state: State) => T;

/**
 * select's state.
 */
export type SelectState = {
  state: any;
  version: number;
};

/**
 * Context.
 */
export class Context<State> {
  /**
   * current state.
   */
  private state?: State;

  /**
   * listeners.
   */
  private changed = (_: State) => {};

  /**
   * Consumer's select props.
   */
  private selects: Map<Select<State>, SelectState> = new Map();

  /**
   * set state.
   */
  public setState = (state: State) => {
    this.state = state;
  };

  /**
   * get state.
   */
  public getState = () => {
    return this.state;
  };

  /**
   * update state.
   */
  public updateState = (update: (state: State) => void) => {
    this.state = produce(this.state, state => {
      update(state as State);
    });

    Array.from(this.selects.entries()).forEach(([select, state]) => {
      const next = select(this.state!);
      if (!equals(next, state.state)) {
        state.state = next;
        state.version++;
      }
    });

    this.changed(this.state!);
  };

  /**
   * listen state change.
   */
  public listen(changed: (state: State) => void) {
    this.changed = changed;
  }

  /**
   * register select function.
   */
  public register(select: Select<State>) {
    this.selects.set(select, {
      state: select(this.state!),
      version: 1
    });
  }

  /**
   * getSelectState.
   */
  public getSelectState(select: Select<State>) {
    return this.selects.get(select)!;
  }
}
