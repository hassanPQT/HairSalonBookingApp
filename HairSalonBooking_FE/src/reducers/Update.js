export const updateUserReducer = (state = false, action) => {
  switch (action.type) {
    case "UPDATE_USER":
      return !state;
    default:
      return state;
  }
};

export const updateStylistReducer = (state = false, action) => {
  switch (action.type) {
    case "UPDATE_STYLIST":
      return !state;
    default:
      return state;
  }
};

export const updateStaffReducer = (state = false, action) => {
  switch (action.type) {
    case "UPDATE_STAFF":
      return !state;
    default:
      return state;
  }
};

export const updateManagerReducer = (state = false, action) => {
  switch (action.type) {
    case "UPDATE_MANAGER":
      return !state;
    default:
      return state;
  }
};

export const updateServiceReducer = (state = false, action) => {
  switch (action.type) {
    case "UPDATE_SERVICE":
      return !state;
    default:
      return state;
  }
};

export const updateVoucherReducer = (state = false, action) => {
  switch (action.type) {
    case "UPDATE_VOUCHER":
      return !state;
    default:
      return state;
  }
};

export const updateBranchReducer = (state = false, action) => {
  switch (action.type) {
    case "UPDATE_BRANCH":
      return !state;
    default:
      return state;
  }
};

export const updateSlotReducer = (state = false, action) => {
  switch (action.type) {
    case "UPDATE_SLOT":
      return !state;
    default:
      return state;
  }
};

export const updateCustomerReducer = (state = false, action) => {
  switch (action.type) {
    case "UPDATE_CUSTOMER":
      return !state;
    default:
      return state;
  }
};

export const updateBookingReducer = (state = false, action) => {
  switch (action.type) {
    case "UPDATE_BOOKING":
      return !state;
    default:
      return state;
  }
};
