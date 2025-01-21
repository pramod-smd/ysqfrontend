import { subAreaActionType } from "../../constants";

export default (state = [], action) => {
    switch (action.type) {
        case subAreaActionType.ADD_SUB_AREA:
            return action.payload;
        case subAreaActionType.FETCH_SUB_AREA:
            return action.payload;
        case subAreaActionType.FETCH_SUB_AREA_LIST:
            return action.payload;
        case subAreaActionType.FETCH_SUB_AREA_DETAILS:
            return action.payload;

        case subAreaActionType.UPDATE_SUB_AREA:
            return state.map((item) =>
                item.id === action.payload.id
                    ? { ...item, sub_area_name: action.payload.sub_area_name }
                    : item
            );
        default:
            return state;
    }
};
