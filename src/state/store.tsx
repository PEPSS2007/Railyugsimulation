'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode, Dispatch } from 'react';
import { AppState, Action } from '@/types';
import { railyugReducer, getInitialState } from './reducer';

interface RailyugContextType {
  state: AppState;
  dispatch: Dispatch<Action>;
}

const RailyugContext = createContext<RailyugContextType | undefined>(undefined);

export function RailyugProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(railyugReducer, undefined, getInitialState);

  // Timer loop for Tatkal seat hold countdown
  useEffect(() => {
    if (state.hold.status !== 'Processing' || !state.hold.expiresAtSeconds) {
      return;
    }

    const intervalId = setInterval(() => {
      const nowSec = Math.floor(Date.now() / 1000);
      dispatch({ type: 'TICK_HOLD', currentTimestampSeconds: nowSec });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [state.hold.status, state.hold.expiresAtSeconds]);

  return (
    <RailyugContext.Provider value={{ state, dispatch }}>
      {children}
    </RailyugContext.Provider>
  );
}

export function useRailyug(): RailyugContextType {
  const context = useContext(RailyugContext);
  if (!context) {
    throw new Error('useRailyug must be used within a RailyugProvider');
  }
  return context;
}
