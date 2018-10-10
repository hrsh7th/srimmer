import * as equals from "shallowequal";

/**
 * Mutate function.
 */
export type Update<State> = (state: State) => void;

/**
 * Select function.
 */
export type Select<State, T = any> = (state: State) => T;

/**
 * bit's state.
 */
export type BitState = {
  bit: number;
  version: number;
  state?: any;
};

/**
 * Context.
 */
export class Context<State> {
  /**
   * get state function(Provider#getState).
   */
  public getState?: () => State;

  /**
   * update state function(Provider#updateState).
   */
  public updateState?: (update: Update<State>) => void;

  /**
   * Consumer's select props as bitmask.
   */
  private bitmask: Map<Select<State>, BitState> = new Map();

  /**
   * calculate bitmask.
   */
  public calculateBitmask(nextState: State) {
    return Array.from(this.bitmask.entries()).reduce(
      (bits, [select, bitState]) => {
        const next = select(nextState);
        const isSame = equals.default(next, bitState.state);
        if (!isSame) {
          bitState.state = next;
          bitState.version++;
          return bits | bitState.bit;
        }
        return bits;
      },
      0
    );
  }

  /**
   * register select function.
   */
  public register(select: Select<State>) {
    this.bitmask.set(select, {
      bit: this.bitmask.size + 1,
      version: 1
    });
  }

  /**
   * getBitState.
   */
  public getBitState(select: (state: State) => any) {
    return this.bitmask.get(select)!;
  }
}
