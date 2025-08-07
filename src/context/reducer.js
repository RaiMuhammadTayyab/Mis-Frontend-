const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] };
    case 'REMOVE_TRANSACTION':
      return { ...state, transactions: state.transactions.filter((_, i) => i !== action.payload) };
    case 'CLEAR_TRANSACTIONS':
      return { ...state, transactions: [] };
      case'UNIQUE_NAMES':
      return{...state,uniqueCustomerNames:action.payload}
      
    default:
      return state;
  }
};

export default reducer;
