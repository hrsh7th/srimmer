import React from "react";
import { Context, Mutate, Select } from "./Context";
import { createConsumer } from "./Consumer";
import { createProvider } from "./Provider";

export function define<State extends object>() {
  const context = new Context<State>();
  const { Provider, Consumer } = React.createContext<State>(
    {} as any,
    (_, next) => context.calculateBitmask(next)
  );
  const SrimmerProvider = createProvider<State>(Provider, context);
  const SrimmerConsumer = createConsumer<State>(Consumer, context);

  return {
    Provider: SrimmerProvider as any,
    Consumer: SrimmerConsumer as any,
    get: () => {
      return context.getState ? context.getState() : null;
    },
    update: (mutator: Mutate<State>) => {
      if (context.updateState) {
        context.updateState(mutator);
      }
    },
    create: function create<T>(select: Select<State, T>) {
      return (props: {
        children: (s: ReturnType<typeof select>) => React.ReactNode;
      }) => (
        <SrimmerConsumer<T> select={select}>{props.children}</SrimmerConsumer>
      );
    }
  };
}
