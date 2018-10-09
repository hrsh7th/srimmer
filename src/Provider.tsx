import React from "react";
import { produce } from "immer";
import { Context, Update } from "./Context";

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
      context.getState = this.getState;
      context.updateState = this.updateState;
    }

    /**
     * render.
     */
    public render() {
      return (
        <Provider value={this.state.state}>{this.props.children}</Provider>
      );
    }

    /**
     * state getter.
     */
    public getState = () => {
      return this.state.state;
    };

    /**
     * state updator.
     */
    public updateState = (update: Update<State>) => {
      this.setState({
        state: produce<State>(this.state.state, function(state) {
          update(state as State);
        })
      });
    };
  };
}
