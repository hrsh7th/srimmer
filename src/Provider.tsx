import React from "react";
import { Context } from "./Context";

export type ProviderProps<State> = {
  state: State;
  children: React.ReactNode;
};

export type ProviderState<State> = {
  state: State;
};

export function createProvider<State>(
  Provider: React.Provider<State>,
  context: Context<State>
) {
  /**
   * SrimmerProvider.
   */
  return class SrimmerProvider extends React.Component<
    ProviderProps<State>,
    ProviderState<State>
  > {
    /**
     * props to state.
     */
    public constructor(props: ProviderProps<State>) {
      super(props);
      this.state = { state: props.state };
      context.setState(props.state);
      context.listen(state => this.setState({ state }));
    }

    /**
     * render.
     */
    public render() {
      return (
        <Provider value={this.state.state}>{this.props.children}</Provider>
      );
    }
  };
}
