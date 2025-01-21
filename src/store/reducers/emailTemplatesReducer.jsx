import { emailTemplatesActionType } from "../../constants";

export default (state = [], action) => {
    switch (action.type) {
        case emailTemplatesActionType.FETCH_EMAIL_TEMPLATES:
            return action.payload;
        case emailTemplatesActionType.ADD_EMAIL_TEMPLATE:
            return action.payload;
        case emailTemplatesActionType.FETCH_ADMIN_EMAIL_TEMPLATES:
            return action.payload;
        case emailTemplatesActionType.FETCH_ADMIN_EMAIL_DETAILS:
            return action.payload;
        case emailTemplatesActionType.UPDATE_ADMIN_EMAIL_TEMPLATE:
            return {
                ...state,
                emailTemplates: state.emailTemplates.map((template) =>
                    template.id === action.payload.id
                        ? { ...template, ...action.payload }
                        : template
                ),
            };
        case emailTemplatesActionType.ADD_ADMIN_EMAIL_TEMPLATE:
            return action.payload;
        case emailTemplatesActionType.FETCH_EMAIL_TEMPLATE:
            return [action.payload];
        case emailTemplatesActionType.SET_ACTIVE_DE_ACTIVE:
            return state.map((item) =>
                item.id === +action.payload.id ? action.payload : item
            );
        default:
            return state;
    }
};
