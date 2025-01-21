import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import MasterLayout from "../../MasterLayout";
import { useNavigate,Link  } from "react-router-dom";
import ReactDataTable from "../../../shared/table/ReactDataTable";
import TabTitle from "../../../shared/tab-title/TabTitle";
import ReactSelect from "../../../shared/select/reactSelect";
import moment from "moment";
import {   currencySymbolHandling,
    getFormattedDate,
    getFormattedMessage,
    placeholderText,
    getAvatarName,
} from "../../../shared/sharedMethod";
import ActionButton from "../../../shared/action-buttons/ActionButton";
import TopProgressBar from "../../../shared/components/loaders/TopProgressBar";
import { fetchAllCashHistory } from "../../../store/action/cashAction";
import { CashAssignExcelAction } from "../../../store/action/salesReturnExcelAction";
import { fetchAllWarehouses } from "../../../store/action/warehouseAction";
import { fetchFrontSetting } from "../../../store/action/frontSettingAction";
const CashAssignReport = (props) => {
    const {
        expenses,
        totalRecord,
        isLoading,
        frontSetting,
        allConfigData,
        CashAssignExcelAction,
        cashlist,
        fetchAllCashHistory,
        warehouses,
        fetchAllWarehouses,
        fetchFrontSetting,
        dates
        

    } = props;
    const [deleteModel, setDeleteModel] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    const navigate = useNavigate();
    const [isWarehouseValue, setIsWarehouseValue] = useState(false);
    const [warehouseValue, setWarehouseValue] = useState({label: 'All', value: null});
            const array = warehouses && warehouses
            const newFirstElement = {attributes: {name: getFormattedMessage("report-all.warehouse.label")}, id: null}
            const newArray = [newFirstElement].concat(array)
        useEffect(() => {
            if (isWarehouseValue === true) {
                
                CashAssignExcelAction(dates,warehouseValue?.value, setIsWarehouseValue);
            }
        }, [isWarehouseValue]);

    useEffect(() => {
        fetchAllWarehouses();
        fetchFrontSetting();
        fetchAllCashHistory();
    }, []);
    
    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };

    const onChange = (filter) => {
        fetchAllCashHistory(filter,true);
    };

        const onDetailsClick = (item) => {
            navigate(`/app/gift-history-details/${item}`);
        };

        const currencySymbol =
    frontSetting &&
    frontSetting.value &&
    frontSetting.value.currency_symbol;

          const itemsValue =
                 cashlist.length >= 0 &&
                 cashlist.map((item) => ({
                     cash: currencySymbol+" "+ item?.cash,
                     name: item.sales_man?.first_name + " " + item.sales_man?.last_name,
                     type: item?.type,
                     unique_id: item?.unique_id,
                     time: moment(item.created_at).format("LT"),
                     date: moment(item.created_at).format("DD-MM-YYYY"),
                     id: item?.id,
                 }));
             const columns = [
                  {
                        name: getFormattedMessage(
                            "globally.react-table.column.created-date.label"
                        ),
                        sortField: "false",
                        sortable: true,
                        cell: (row) => {
                            return (
                                <span className="badge bg-light-primary">
                                    <div className="mb-1">{row.time}</div>
                                    <div>{row.date}</div>
                                </span>
                            );
                        },
                },
                {
                    name: "Cash ID",
                    selector: (row) => row?.unique_id,
                    sortable: false,
                    sortField: "name",
                },
                {
                     name: getFormattedMessage("globally.input.sales_mane.label"),
                     selector: (row) => row?.name,
                     sortable: false,
                     sortField: "name",
                 },
                 {
                     name: getFormattedMessage("globally.input.cash.label"),
                     selector: (row) => row?.cash,
                     sortable: false,
                     sortField: "cash",
                 },
                 {
                     name: getFormattedMessage("globally.input.cash_type.label"),
                     selector: (row) => row.type && row?.type.replace(/^./, char => char.toUpperCase()),
                     sortField: "type",
                     sortable: false,
                 },
              
             ];


        const onWarehouseChange = (obj) => {
            setWarehouseValue(obj);
        };

        const onExcelClick = () => {
            setIsWarehouseValue(true);
        };
    
        return (
            <MasterLayout>
                <TopProgressBar />
                <TabTitle title={placeholderText('region.title')}/>
                <div className='mx-auto mb-md-5 col-12 col-md-4'>
                {newArray &&
                    <ReactSelect data={newArray} onChange={onWarehouseChange} defaultValue={newArray[0] ? {
                        label: newArray[0].attributes.name,
                        value: newArray[0].id
                    } : ''}
                                 title={getFormattedMessage('warehouse.title')} errors={''} isRequired
                                 placeholder={placeholderText('purchase.select.warehouse.placeholder.label')}/>}
                </div>
                <div className='pt-md-7'>
                <ReactDataTable 
                columns={columns} 
                items={itemsValue}
                onChange={onChange} 
                isLoading={isLoading}
                isShowDateRangeField
                isEXCEL
                isShowSearch
                warehouseValue={warehouseValue}
                // isShowFilterField
                onExcelClick={onExcelClick}
                totalRows={totalRecord} />
               </div> 
            </MasterLayout>
        )};

const mapStateToProps = (state) => {
    const {cashlist, frontSetting,expenses,dates, totalRecord, isLoading,warehouses,allConfigData } =
        state;
    return {cashlist,frontSetting, expenses,dates, totalRecord, isLoading,warehouses,allConfigData};
};

export default connect(mapStateToProps, {fetchAllCashHistory,fetchAllWarehouses,CashAssignExcelAction,fetchFrontSetting})(CashAssignReport);
