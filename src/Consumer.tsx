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
    public shouldComponentUpdate() {
      return false;
    }

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
      return (
        <Consumer>
          {_ => {
            const state = context.getSelectState(this.props.select);
            return (
              <Versioning version={state.version}>
                {() => this.props.children(state.state)}
              </Versioning>
            );
          }}
        </Consumer>
      );
    }
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
