import apiConfig from '../../config/apiConfig';
import {toastType} from '../../constants';
import {addToast} from './toastAction';
import {setLoading} from './loadingAction';

export const saleReturnExcelAction = (warehouse, setIsWarehouseValue, filter = {}, isLoading = true) => async (dispatch) => {
    if (isLoading) {
        dispatch(setLoading(true))
    }
    await apiConfig.get(`sales-return-report-excel?warehouse_id=${warehouse}`)
        .then((response) => {
            window.open(response.data.data.sale_return_excel_url, '_blank');
            setIsWarehouseValue(false);
            if (isLoading) {
                dispatch(setLoading(false))
            }
        })
        .catch(({response}) => {
            dispatch(addToast(
                {text: response.data.message, type: toastType.ERROR}));
        });
};
export const giftExcelAction = (dates,warehouseValue, setIsWarehouseValue, filter = {}, isLoading = true) => async (dispatch) => {
    if (isLoading) {
        dispatch(setLoading(true))
    }
    await apiConfig.get(`total-gift-report-excel?start_date=${dates.start_date ? dates.start_date : null }&end_date=${dates.end_date ? dates.end_date : null}&warehouse_id=${warehouseValue?.value ? warehouseValue?.value : null}`)     
        .then((response) => {
            window.open(response.data.data.gift_excel_url, '_blank');
            setIsWarehouseValue(false);
            if (isLoading) {
                dispatch(setLoading(false))
            }
        })
        .catch(({response}) => {
            dispatch(addToast(
                {text: response.data.message, type: toastType.ERROR}));
        });
};

export const MileageExcelAction = (dates,warehouse, setIsWarehouseValue, filter = {}, isLoading = true) => async (dispatch) => {
    if (isLoading) {
        dispatch(setLoading(true))
    }
    
    await apiConfig.get(`total-mileage-report-excel?start_date=${dates.start_date ? dates.start_date : null }&end_date=${dates.end_date ? dates.end_date : null}&warehouse_id=${warehouse}`)
        .then((response) => {
            window.open(response.data.data.mileage_excel_url, '_blank');
            setIsWarehouseValue(false);
            if (isLoading) {
                dispatch(setLoading(false))
            }
        })
        .catch(({response}) => {
            dispatch(addToast(
                {text: response.data.message, type: toastType.ERROR}));
        });
};

export const CashAssignExcelAction = (dates,warehouse, setIsWarehouseValue, filter = {}, isLoading = true) => async (dispatch) => {
    if (isLoading) {
        dispatch(setLoading(true))
    }
    await apiConfig.get(`total-cashassign-report-excel?start_date=${dates.start_date ? dates.start_date : null }&end_date=${dates.end_date ? dates.end_date : null}&warehouse_id=${warehouse}`)
        .then((response) => {
            window.open(response.data.data.cash_excel_url, '_blank');
            setIsWarehouseValue(false);
            if (isLoading) {
                dispatch(setLoading(false))
            }
        })
        .catch(({response}) => {
            dispatch(addToast(
                {text: response.data.message, type: toastType.ERROR}));
        });
};