const collapseReducer = (state = false, action) => {
    switch (action.type) {
      case "SET_COLLAPSE":
        return !state;
      default:
        return state;
    }
  };
  
  export default collapseReducer;
  