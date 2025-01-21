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
import { fetchAllMileageHistory } from "../../../store/action/mileageAction";
import { MileageExcelAction } from "../../../store/action/salesReturnExcelAction";
import { fetchAllWarehouses } from "../../../store/action/warehouseAction";
import { fetchFrontSetting } from "../../../store/action/frontSettingAction";
const MileageReport = (props) => {
    const {
        totalRecord,
        isLoading,
        frontSetting,
        allConfigData,
        MileageExcelAction,
        mileagelist,
        fetchAllMileageHistory,
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
                MileageExcelAction(dates,warehouseValue?.value, setIsWarehouseValue);
            }
        }, [isWarehouseValue]);

    useEffect(() => {
        fetchAllWarehouses();
        fetchFrontSetting();
        fetchAllMileageHistory();
    }, []);
    
    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };

    const onChange = (filter) => {
        fetchAllMileageHistory(filter,true);
    };

        const onDetailsClick = (item) => {
            navigate(`/app/gift-history-details/${item}`);
        };

        const currencySymbol =
    frontSetting &&
    frontSetting.value &&
    frontSetting.value.currency_symbol;

    const itemsValue =
            mileagelist.length >= 0 &&
            mileagelist.map((item) => ({
                time: moment(item.uploaded_date).format("LT"),
                date: moment(item.uploaded_date).format("DD-MM-YYYY"),
                vehicle_image: item?.vehicle_image,
                mileage_image: item?.mileage_image,
                mileage: item?.mileage + " Km",
                sales_man:
                    item?.sales_man?.first_name + " " + item?.sales_man?.last_name,
                type: item?.type,
                uploaded_date: item?.uploaded_date,
                created_at: getFormattedDate(
                    item?.created_at,
                    allConfigData && allConfigData
                ),
                id: item?.id,
            }));
    
        const columns = [
             {
                                name: getFormattedMessage(
                                    "globally.react-table.column.created-date.label"
                                ),
                                sortField: "created_at",
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
                name: getFormattedMessage("globally.input.sales_mane.label"),
                selector: (row) => row?.sales_man,
                sortable: true,
                sortField: "sales_man_id",
            },
            {
                name: getFormattedMessage("globally.input.mileage.label"),
                selector: (row) => row?.mileage,
                sortable: true,
                sortField: "mileage",
            },
            {
                name: getFormattedMessage("globally.input.mileage_type.label"),
                selector: (row) => row.type && row?.type.replace(/^./, char => char.toUpperCase()),
                sortField: "type",
                sortable: true,
            },

            // {
            //     name: "Warehouse",
            //     selector: (row) => row.type && row?.type.replace(/^./, char => char.toUpperCase()),
            //     sortField: "type",
            //     sortable: true,
            // },
           
            // {
            //     name: getFormattedMessage("react-data-table.action.column.label"),
            //     right: true,
            //     ignoreRowClick: true,
            //     allowOverflow: true,
            //     button: true,
            //     cell: (row) => (
            //         <button
            //             className="btn btn-sm btn-primary"
            //             variant="primary"
            //             onClick={() => onMileageClick(row)}
            //         >
            //             {getFormattedMessage("mileage.details.title")}
            //         </button>
            //     ),
            // },
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
    const {mileagelist, frontSetting, dates,totalRecord, isLoading,warehouses,allConfigData } =
        state;
    return {mileagelist,frontSetting,dates, totalRecord, isLoading,warehouses,allConfigData};
};

export default connect(mapStateToProps, {fetchAllMileageHistory,fetchAllWarehouses,MileageExcelAction,fetchFrontSetting})(MileageReport);
