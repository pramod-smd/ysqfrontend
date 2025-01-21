import React, { useEffect, useState } from "react";
import MasterLayout from "../../MasterLayout";
import TabTitle from "../../../shared/tab-title/TabTitle";
import {
    currencySymbolHandling,
    getFormattedMessage,
    placeholderText,
} from "../../../shared/sharedMethod";
import ReactDataTable from "../../../shared/table/ReactDataTable";
import { connect } from "react-redux";
import ReactSelect from "../../../shared/select/reactSelect";
import { fetchAllWarehouses } from "../../../store/action/warehouseAction";
import { fetchFrontSetting } from "../../../store/action/frontSettingAction";
import {productInventoryQuantityReportAction } from "../../../store/action/stockReportAction";
import { totalStockReportExcel } from "../../../store/action/totalStockReportExcel";
import TopProgressBar from "../../../shared/components/loaders/TopProgressBar";

const StockReport = (props) => {
    const {
        isLoading,
        totalRecord,
        fetchFrontSetting,
        stockReports,
        fetchAllWarehouses,
        totalStockReportExcel,
        frontSetting,
        warehouses,
        allConfigData,
        productInventoryQuantityReportAction,
        productQuantityReport,
    } = props;
     const [isWarehouseValue, setIsWarehouseValue] = useState(false);
    const [warehouseValue, setWarehouseValue] = useState({label: 'All', value: null});
    const currencySymbol =
        frontSetting &&
        frontSetting.value &&
        frontSetting.value.currency_symbol;
    const array = warehouses && warehouses
    const newFirstElement = {attributes: {name: getFormattedMessage("report-all.warehouse.label")}, id: null}
    const newArray = [newFirstElement].concat(array)


    useEffect(() => {
        fetchAllWarehouses();
    }, []);

    useEffect(() => {
        fetchFrontSetting();
    }, []);

    

    useEffect(() => {
        if (isWarehouseValue === true) {
            totalStockReportExcel(
                warehouseValue?.value,
                setIsWarehouseValue
            );
            setIsWarehouseValue(false);
        }
    }, [isWarehouseValue]);

    const itemsValue = productQuantityReport && productQuantityReport.length >= 0 && productQuantityReport.map(quantityReport => ({
        code: quantityReport && quantityReport?.product?.code,
        name: quantityReport && quantityReport?.product?.name,
        warehouse: quantityReport && quantityReport?.warehouse?.name,
        quantity: quantityReport && quantityReport?.warehouse_quantities,
        stockAlert: quantityReport && quantityReport?.product?.stock_alert,
        product_unit: quantityReport && quantityReport?.product?.product_unit?.name
    }));

    const onChange = (filter) => {        
        productInventoryQuantityReportAction(filter,true);
    };
    const onWarehouseChange = (obj) => {
        setWarehouseValue(obj);
    };

    const onExcelClick = () => {
        setIsWarehouseValue(true);
    };


    const columns = [
        {
            name: getFormattedMessage("globally.react-table.column.code.label"),
            sortField: "code",
            sortable: false,
            cell: (row) => {
                return (
                    <span className="badge bg-light-danger">
                        <span>{row.code}</span>
                    </span>
                );
            },
        },
        {
            name: getFormattedMessage("supplier.table.name.column.title"),
            selector: (row) => row.name,
            sortField: "name",
            sortable: false,
        },
        {
            name: "Warehouse",
            selector: (row) => row?.warehouse,
            sortField: "name",
            sortable: false,
        },
        // {
        //     name: getFormattedMessage("product.product-details.category.label"),
        //     selector: (row) => row?.product_category_name,
        //     sortField: "product_category_name",
        //     sortable: false,
        // },
   
        {
            name: getFormattedMessage("current.stock.label"),
            sortField: "current_stock",
            sortable: false,
            cell: (row) => {
                return (
                    <div>
                        <div className="badge bg-light-info me-2">
                            <span>{row?.quantity}</span>
                        </div>

                        <span className="badge bg-light-success me-2">
                            <span>{row?.product_unit}</span>
                        </span>
                    </div>
                );
            },
        },
        // {
        //     name: getFormattedMessage("react-data-table.action.column.label"),
        //     right: true,
        //     ignoreRowClick: true,
        //     allowOverflow: true,
        //     button: true,
        //     width: "115px",
        //     cell: (row) => (
        //         <button
        //             className="btn btn-sm btn-primary"
        //             variant="primary"
        //             onClick={() => onReportsClick(row)}
        //         >
        //             {getFormattedMessage("reports.title")}
        //         </button>
        //     ),
        // },
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText("stock.reports.title")} />
            <div className='mx-auto mb-md-5 col-12 col-md-4'>
                {newArray &&
                    <ReactSelect data={newArray} onChange={onWarehouseChange} defaultValue={newArray[0] ? {
                        label: newArray[0].attributes.name,
                        value: newArray[0].id
                    } : ''}
                                 title={getFormattedMessage('warehouse.title')} errors={''} isRequired
                                 placeholder={placeholderText('purchase.select.warehouse.placeholder.label')}/>}
                </div>
            <div className="pt-md-7">
                <ReactDataTable
                    columns={columns}
                    items={itemsValue}
                    onChange={onChange}
                    isLoading={isLoading}
                    totalRows={totalRecord}
                    isEXCEL
                    onExcelClick={onExcelClick}
                    warehouseValue={warehouseValue}  
                    isShowSearch

                />
            </div>
        </MasterLayout>
    );
};
const mapStateToProps = (state) => {
    const {
        isLoading,
        totalRecord,
        warehouses,
        frontSetting,
        allConfigData,
        productQuantityReport,
    } = state;
    return {
        isLoading,
        totalRecord,
        warehouses,
        frontSetting,
        allConfigData,
        productQuantityReport
    };
};

export default connect(mapStateToProps, {
    fetchAllWarehouses,
    totalStockReportExcel,
    fetchFrontSetting,
    productInventoryQuantityReportAction
})(StockReport);
