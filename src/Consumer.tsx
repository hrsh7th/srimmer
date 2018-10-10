import React from "react";
import { Context, Select } from "./Context";

export type ConsumerProps<State, T = any> = {
  select: Select<State, T>;
  children: (selected: T) => React.ReactNode;
};

export function createConsumer<State>(
  Consumer: React.Consumer<State>,
  context: Context<State>
) {
  /**
   * SrimerConsumer.
   */
  return class SrimmerConsumer<T> extends React.Component<
    ConsumerProps<State, T>
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
      return <Consumer>{this.select}</Consumer>;
    }

    /**
     * select and versioning.
     */
    public select = (state: State) => {
      const bitState = context.getBitState(this.props.select);
      bitState.state = bitState.state || this.props.select(state);
      return (
        <Versioning version={bitState.version}>
          {() => this.props.children(bitState.state)}
        </Versioning>
      );
    };
  };
}

/**
 * Versioning selected state to avoid re-rendering.
 */
class Versioning extends React.Component<{
  version: number;
  children: () => React.ReactNode;
}> {
  public shouldComponentUpdate(props: { version: number }) {
    return this.props.version !== props.version;
  }

  public render() {
    return this.props.children();
  }
}
