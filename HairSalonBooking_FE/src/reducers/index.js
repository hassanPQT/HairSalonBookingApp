import {combineReducers} from "redux";
import collapseReducer from "./Collapse";
import { updateBookingReducer, updateCustomerReducer, updateManagerReducer, updateServiceReducer, updateStaffReducer, updateStylistReducer, updateUserReducer, updateVoucherReducer } from "./Update";

const allReducers = combineReducers({
    collapseReducer,
    updateUserReducer,
    updateStylistReducer,
    updateServiceReducer,
    updateVoucherReducer,
    updateCustomerReducer,
    updateStaffReducer,
    updateManagerReducer,
    updateBookingReducer,
});

export default allReducers;