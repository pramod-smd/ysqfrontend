import { setLoading } from "./loadingAction";
import { apiBaseURL, stockReportActionType,productQuantityReportActionType } from "../../constants";
import apiConfig from "../../config/apiConfig";
import { setTotalRecord } from "./totalRecordAction";
import requestParam from "../../shared/requestParam";
import { _ } from "lodash";

export const stockReportAction =
    (id, filter = {}, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        const stockReport = true;
        let url = apiBaseURL.STOCK_REPORT + "?warehouse_id=" + id;
        if (
            !_.isEmpty(filter) &&
            (filter.page ||
                filter.pageSize ||
                filter.search ||
                filter.order_By ||
                filter.created_at)
        ) {
            url += requestParam(filter, false, stockReport, null, url);
        }
        await apiConfig
            .get(url)
            .then((response) => {
                dispatch({
                    type: stockReportActionType.STOCK_REPORT,
                    payload: response.data.data,
                });
                dispatch(
                    setTotalRecord(
                        response.data.meta.total !== undefined &&
                            response.data.meta.total >= 0
                            ? response.data.meta.total
                            : response.data.data.total
                    )
                );
                if (isLoading) {
                    dispatch(setLoading(false));
                }
            })
            .catch(({ response }) => {
                // dispatch(addToast(
                //     {text: response.data.message, type: toastType.ERROR}));
            });
    };

    export const productInventoryQuantityReportAction =
    (filter = {}, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        let url =
            apiBaseURL.PRODUCT_STOCK_INVENTORY_REPORT
        if (!_.isEmpty(filter) && (filter.page || filter?.warehouse_id || filter.pageSize)) {
            url += requestParam(filter, false, false, true, url);
        }
        await apiConfig
            .get(url)
            .then((response) => {                               
                dispatch({
                    type: productQuantityReportActionType.QUANTITY_REPORT,
                    payload: response?.data?.data?.data,
                });
                dispatch(
                    setTotalRecord(
                            response.data?.meta?.total !== undefined &&
                                response?.data.total >= 0
                                ? response?.data?.total
                                : response?.data?.data?.total
                        )
                );
                if (isLoading) {
                    dispatch(setLoading(false));
                }
            })
            .catch(({response}) => {                  
                dispatch(addToast(
                    {text: response?.data?.message, type: toastType.ERROR}));
            });
    };

