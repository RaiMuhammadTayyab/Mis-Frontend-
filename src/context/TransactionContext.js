import { createContext, useReducer, useContext } from 'react';
import reducer from './reducer';

const initialState = {
  transactions: []
};

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <TransactionContext.Provider value={{ state, dispatch }}>
      {children}
    </TransactionContext.Provider>
  );
};
export const useTransaction = () => useContext(TransactionContext);