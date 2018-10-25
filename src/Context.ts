import produce, { PatchListener } from "immer";
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
 * Changed listener.
 */
export type ChangedListener<State> = (state: State) => void;

/**
 * Context.
 */
export class Context<State> {
  /**
   * patche listener.
   */
  public patchListener?: PatchListener;

  /**
   * current state.
   */
  private state?: State;

  /**
   * current draft state.
   */
  private draft?: State;

  /**
   * listeners.
   */
  private changed: ChangedListener<State>[] = [];

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
    // avoid produce when recursive call.
    if (this.draft) {
      update(this.draft);
      return;
    }

    // produce.
    this.state = produce(
      this.state,
      state => {
        this.draft = state as State;
        update(state as State);
        this.draft = undefined;
      },
      this.patchListener
    );

    // calculate changes selector.
    const changed = Array.from(this.selects.entries()).reduce(
      (changed, [select, info]) => {
        const next = select(this.state!);
        if (!equals(next, info.state)) {
          info.state = next;
          info.version++;
          return true;
        }
        return changed;
      },
      false
    );

    // notify if state changes.
    if (changed) {
      this.changed.forEach(changed => changed(this.state!));
    }
  };

  /**
   * subscribe state change.
   */
  public subscribe(changed: ChangedListener<State>) {
    this.changed.push(changed);
  }

  /**
   * unsubscribe state change.
   */
  public unsubscribe(changed: ChangedListener<State>) {
    const idx = this.changed.indexOf(changed);
    if (idx > -1) {
      this.changed.splice(idx, 1);
    }
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
