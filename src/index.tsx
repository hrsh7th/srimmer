import React from "react";
import { PatchListener } from "immer";
import { Context, Select } from "./Context";
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
  const { Provider, Consumer } = React.createContext<State>({} as any);
  const SrimmerProvider = createProvider<State>(Provider, context);
  const SrimmerConsumer = createConsumer<State>(Consumer, context);

  return {
    Provider: SrimmerProvider,
    Consumer: SrimmerConsumer,
    get: context.getState,
    set: context.setState,
    update: context.updateState,
    patches: (patchListener: PatchListener) => {
      context.patchListener = patchListener;
    },
    select: function select<T>(select: Select<State, T>) {
      return (props: { children: (s: T) => React.ReactNode }) => (
        <SrimmerConsumer<T> select={select}>{props.children}</SrimmerConsumer>
      );
    }
  };
}
