import React from "react";
import { Context, Update, Select } from "./Context";
import { createConsumer } from "./Consumer";
import { createProvider } from "./Provider";

export type Select<
  T extends React.ComponentType<{ children: any }>
> = T extends React.ComponentType<{
  children: (selected: infer R) => React.ReactNode;
}>
  ? R
  : never;

export function define<State extends object>() {
  const context = new Context<State>();
  const { Provider, Consumer } = React.createContext<State>(
    {} as any,
    (_, next) => context.calculateBitmask(next)
  );
  const SrimmerProvider = createProvider<State>(Provider, context);
  const SrimmerConsumer = createConsumer<State>(Consumer, context);

  return {
    Provider: SrimmerProvider,

    Consumer: SrimmerConsumer,

    get: () => {
      return context.getState && context.getState();
    },

    select: function select<T>(select: Select<State, T>) {
      return (props: { children: (s: T) => React.ReactNode }) => (
        <SrimmerConsumer<T> select={select}>{props.children}</SrimmerConsumer>
      );
    },

    update: (update: Update<State>) => {
      context.updateState && context.updateState(update);
    }
  };
}
