import apiConfig from '../../config/apiConfig';
import {setLoading} from './loadingAction';
import { _ } from "lodash";

export const totalStockReportExcel = (warehouse, filter = {}, isLoading = true, setIsWarehouseValue) => async (dispatch) => {
    if (isLoading) {
        dispatch(setLoading(true))
    }
    await apiConfig.get(`stock-report-excel?warehouse_id=${warehouse}`)
        .then((response) => {
            window.open(response.data.data.stock_report_excel_url, '_blank');
            setIsWarehouseValue(false);
            if (isLoading) {
                dispatch(setLoading(false))
            }
        })
        .catch(() => {
        });
};

export const totalProductStockReportExcel = (warehouse, filter = {}, isLoading = true, setIsWarehouseValue) => async (dispatch) => {
    if (isLoading) {
        dispatch(setLoading(true))
    }
    await apiConfig.get(`product-stock-report-excel?warehouse_id=${warehouse}`)
        .then((response) => {
            window.open(response.data.data.product_stock_report_excel_url, '_blank');
            setIsWarehouseValue(false);
            if (isLoading) {
                dispatch(setLoading(false))
            }
        })
        .catch(() => {
        });
};


export const GiftInventoryReportExcel = (warehouse, filter = {}, isLoading = true, setIsWarehouseValue) => async (dispatch) => {
    if (isLoading) {
        dispatch(setLoading(true))
    }
    await apiConfig.get(`gift-stock-report-excel?warehouse_id=${warehouse}`)
        .then((response) => {
            window.open(response.data.data.gift_stock_report_excel_url, '_blank');
            setIsWarehouseValue(false);
            if (isLoading) {
                dispatch(setLoading(false))
            }
        })
        .catch(() => {
        });
};