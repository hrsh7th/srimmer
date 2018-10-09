import React from "react";
import { Context, Select } from "./Context";

export type ConsumerProps<State, T = any> = {
  select: Select<State, T>;
  children: (selected: T) => React.ReactNode;
};

export type ConsumerState = {
  bit: number;
};

export function createConsumer<State>(
  Consumer: React.Consumer<State>,
  context: Context<State>
) {
  /**
   * SrimerConsumer.
   */
  return class SrimmerConsumer<T> extends React.Component<
    ConsumerProps<State, T>,
    ConsumerState
  > {
    /**
     * initialize bitmask.
     */
    public constructor(props: ConsumerProps<State>) {
      super(props);
      context.register(props.select);
    }

    /**
     * rednder.
     */
    public render() {
      const { select, children } = this.props;
      const bitState = context.getBitState(select);
      return (
        <Consumer unstable_observedBits={bitState.bit}>
          {state => children((bitState.state = select(state)))}
        </Consumer>
      );
    }
  };
}
