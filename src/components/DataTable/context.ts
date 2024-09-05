"use client";

type DebounceFunction<TArgs extends any[]> = {
  (...args: TArgs): void;
  /**
   * Cancels the debounced function
   */
  cancel(): void;
  /**
   * Checks if there is any invocation debounced
   */
  isPending(): boolean;
  /**
   * Runs the debounced function immediately
   */
  flush(...args: TArgs): void;
};

import { createContext } from "react";
import { SearchParams } from ".";

export interface ContextValue {
  getSearchParams?: () => SearchParams;
  loadData?: DebounceFunction<[searchParams: any]>;
}

const DataTableContext = createContext<ContextValue>({});

export default DataTableContext;
