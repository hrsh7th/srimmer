import React from 'react';
import { produce, Draft } from 'immer';
import { Context } from './Context';

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
  return class SrimmerProvider extends React.Component<ProviderProps<State>, ProviderState<State>> {
    /**
     * props to state.
     */
    public constructor(props: ProviderProps<State>) {
      super(props);
      this.state = { state: props.state };
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
     * state updator.
     */
    public updateState = (mutator: (state: Draft<State>) => void) => {
      this.setState({
        state: produce<State>(this.state.state, function() {
          mutator(this as Draft<State>);
        })
      });
    };
  }

};

