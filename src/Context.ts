import * as equals from 'shallowequal';
import { Draft } from 'immer';

/**
 * Mutate function.
 */
export type Mutate<State> = (state: Draft<State>) => void;

/**
 * Select function.
 */
export type Select<State, T = any> = (state: State) => T;

/**
 * bit's state.
 */
export type BitState = {
  bit: number;
  state?: any;
};

/**
 * Context.
 */
export class Context<State> {

  /**
   * update state function(Provider#setState).
   */
  public updateState?: (mutate: Mutate<State>) => void;

  /**
   * Consumer's select props as bitmask.
   */
  private bitmask: Map<Select<State>, BitState> = new Map();

  /**
   * calculate bitmask.
   */
  public calculateBitmask(nextState: State) {
    return Array.from(this.bitmask.entries())
      .reduce((bits, [select, bitState]) => {
        return equals.default(select(nextState), bitState.state)
          ? bits
          : bits | bitState.bit;
      }, 0);
  }

  /**
   * register select function.
   */
  public register(select: Select<State>) {
    this.bitmask.set(select, {
      bit: this.bitmask.size + 1
    });
  }

  /**
   * getBitState.
   */
  public getBitState(select: (state: State) => any) {
    return this.bitmask.get(select)!;
  }

}

