import { apiBaseURL, toastType } from "../../constants";
import apiConfig from "../../config/apiConfig";
import {
    setTotalRecord,
    addInToTotalRecord,
    removeFromTotalRecord,
} from "./totalRecordAction";
import { addToast } from "./toastAction";
import requestParam from "../../shared/requestParam";
import { setLoading } from "./loadingAction";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { setSavingButton } from "./saveButtonAction";
import { subAreaActionType } from "../../constants";
import { _ } from "lodash";


export const addSubArea = (addSubArea,navigate) => async (dispatch) => {
    await apiConfig
        .post(apiBaseURL.ADD_SUB_AREA, addSubArea)
        .then((response) => {
            dispatch(
                addToast({
                    text: "subArea Added Successfully",
                })
            );
            dispatch(addInToTotalRecord(1));
            navigate("/app/sub-area");
        })
        .catch(({response}) => {
            dispatch(
                addToast({ text: response?.data.message, type: toastType.ERROR })
            );
        });
};


export const fetchSubAreas =
(filter = {}, isLoading = true) =>
async (dispatch) => {
    if (isLoading) {
        dispatch(setLoading(true));
    }
    const admin = true;
    let url = apiBaseURL.FETCH_SUB_AREA;
    if (
        !_.isEmpty(filter) &&
        (filter.page ||
            filter.pageSize ||
            filter.search ||
            filter.order_By ||
            filter.created_at)
    ) {
        url += requestParam(filter, admin, null, null, url);
    }
    apiConfig
        .get(url)
        .then((response) => {
            dispatch({
                type: subAreaActionType.FETCH_SUB_AREA,
                payload: response?.data?.data?.data,
            });
            dispatch(
                setTotalRecord(
                    response?.data?.data.meta?.total !== undefined &&
                    response.data?.data?.meta?.total >= 0
                    ? response.data?.data.meta?.total
                    : response.data?.data?.total
                )
            );
            if (isLoading) {
                dispatch(setLoading(false));
            }
        })
        .catch(({ response }) => {
            dispatch(
                // addToast({
                //     text: response?.data?.message,
                //     type: toastType.ERROR,
                // })
            );
        });
};


export const fetchSubAreasList =
(filter = {}, isLoading = true) =>
async (dispatch) => {
    if (isLoading) {
        dispatch(setLoading(true));
    }
    const admin = true;
    let url = apiBaseURL.FETCH_SUB_AREA_LIST;
    if (
        !_.isEmpty(filter) &&
        (filter.page ||
            filter.pageSize ||
            filter.search ||
            filter.order_By ||
            filter.created_at)
    ) {
        url += requestParam(filter, admin, null, null, url);
    }
    apiConfig
        .get(url)
        .then((response) => {
            dispatch({
                type: subAreaActionType.FETCH_SUB_AREA_LIST,
                payload: response?.data?.data?.data,
            });
            dispatch(
                setTotalRecord(
                    response?.data?.data.meta?.total !== undefined &&
                    response.data?.data?.meta?.total >= 0
                    ? response.data?.data.meta?.total
                    : response.data?.data?.total
                )
            );
            if (isLoading) {
                dispatch(setLoading(false));
            }
        })
        .catch(({ response }) => {
            dispatch(
                // addToast({
                //     text: response?.data?.message,
                //     type: toastType.ERROR,
                // })
            );
        });
};


export const fetchSubAreaDetails=
(id, isLoading = true) =>
async (dispatch) => {
    if (isLoading) {
        dispatch(setLoading(true));
    }
    apiConfig
        .get(apiBaseURL.FETCH_SUB_AREA_DETAILS + "/" + id)
        .then((response) => {
             console.log("sub area details:", response);
            dispatch({
                type:subAreaActionType.FETCH_SUB_AREA_DETAILS,
                payload: response.data?.data,
            });
            if (isLoading) {
                dispatch(setLoading(false));
            }
        })
        .catch(({ response }) => {
            dispatch(
                addToast({
                    text: response?.data?.message,
                    type: toastType.ERROR,
                })
            );
        });
};


export const updateSubAreaName = (updatedSubArea, navigate) => async (dispatch) => {
    await apiConfig
        .put(`${apiBaseURL.UPDATE_SUB_AREA}/${updatedSubArea.id}`, updatedSubArea)
        .then((response) => {
            dispatch(
                addToast({
                    text: "Sub-Area Updated Successfully",
                })
            );
            // navigate("#/app/sub-area");
        })
        .catch(({ response }) => {
            dispatch(
                // addToast({ text: response?.data?.message || "An error occurred", type: toastType.ERROR })
            );
        });
};
