import {constants} from '../../constants';
import { _ } from "lodash";

export const setDateFormat = (format) => {
    return {type: constants.SET_DATE_FORMAT, payload: format};
};
