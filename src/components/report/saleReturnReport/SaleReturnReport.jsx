import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import MasterLayout from "../../MasterLayout";
import TabTitle from "../../../shared/tab-title/TabTitle";
import ReactSelect from "../../../shared/select/reactSelect";
import moment from "moment";
import {
    currencySymbolHandling,
    getFormattedMessage,
    placeholderText,
} from "../../../shared/sharedMethod";
import ReactDataTable from "../../../shared/table/ReactDataTable";
import { fetchFrontSetting } from "../../../store/action/frontSettingAction";
import { fetchSales } from "../../../store/action/salesAction";
import { totalSaleReportExcel } from "../../../store/action/totalSaleReportExcel";
import TopProgressBar from "../../../shared/components/loaders/TopProgressBar";
import { fetchSalesReturn } from "../../../store/action/salesReturnAction";
import { saleReturnExcelAction } from "../../../store/action/salesReturnExcelAction";
import { fetchAllWarehouses } from "../../../store/action/warehouseAction";

const SaleReturnReport = (props) => {
    const {
        isLoading,
        totalRecord,
        fetchFrontSetting,
        fetchSalesReturn,
        salesReturn,
        frontSetting,
        dates,
        totalSaleReportExcel,
        saleReturnExcelAction,
        allConfigData,
        warehouses,
       fetchAllWarehouses
    } = props;
    const [isWarehouseValue, setIsWarehouseValue] = useState(false);
    const [warehouseValue, setWarehouseValue] = useState({label: 'All', value: null});
        const array = warehouses && warehouses
        const newFirstElement = {attributes: {name: getFormattedMessage("report-all.warehouse.label")}, id: null}
        const newArray = [newFirstElement].concat(array)
    
    const currencySymbol =
        frontSetting &&
        frontSetting.value &&
        frontSetting.value.currency_symbol;

    useEffect(() => {
        fetchAllWarehouses();
        fetchFrontSetting();
    }, []);

   
       useEffect(() => {
           if (isWarehouseValue === true) {
               saleReturnExcelAction(dates,warehouseValue, setIsWarehouseValue);
           }
       }, [isWarehouseValue]);

        const itemsValue =
        currencySymbol &&
        salesReturn.length >= 0 &&
        salesReturn.map((sale) => ({
            time: moment(sale.attributes.created_at).format("LT"),
            date: moment(sale.attributes.date).format("DD-MM-YYYY"),
            reference_code: sale.attributes.reference_code,
            sale_reference_code: sale.attributes?.sales?.reference_code,
            customer_name: sale.attributes.customer_name,
            warehouse_name: sale.attributes.warehouse_name,
            salesman: sale.attributes?.salesmanDetails,
            status: sale.attributes.status,
            payment_status: sale.attributes.payment_status,
            grand_total: sale.attributes.grand_total,
            paid_amount: sale.attributes.paid_amount
                ? sale.attributes.paid_amount
                : (0.0).toFixed(2),
            currency: currencySymbol,
            id: sale.id,
        }));

    const columns = [
        {
                            name: getFormattedMessage(
                                "globally.react-table.column.created-date.label"
                            ),
                            sortField: "date",
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
            name: "RETURN ID",
            sortField: "reference_code",
            sortable: false,
            cell: (row) => {
                return (
                    <span className="badge bg-light-danger">
                        <span>{row.reference_code}</span>
                    </span>
                );
            },
        },
        {
            name: getFormattedMessage("dashboard.recentSales.reference.label"),
            sortField: "reference_code",
            sortable: false,
            cell: (row) => {
                return (
                    <span className="badge bg-light-danger">
                        <span>{row.sale_reference_code}</span>
                    </span>
                );
            },
        },
        {
            name: "Amount",
            selector: (row) =>
                currencySymbolHandling(
                    allConfigData,
                    row.currency,
                    row.paid_amount
                ),
            sortField: "paid_amount",
            sortable: true,
        },
        {
            name: getFormattedMessage("customer.title"),
            selector: (row) => row.customer_name,
            sortField: "customer_name",
            sortable: false,
        },
        {
            name: "Warehouse",
            selector: (row) => row.warehouse_name,
            sortField: "warehouse_name",
            sortable: false,
        },
        {
            name: "Salesman",
            selector: (row) => row?.salesman?.first_name+" "+row?.salesman?.last_name,
            sortField: "salesman",
            sortable: false,
        },
        // {
        //     name: getFormattedMessage("purchase.select.status.label"),
        //     sortField: "status",
        //     sortable: false,
        //     cell: (row) => {
        //         return (
        //             (row.status === 1 && (
        //                 <span className="badge bg-light-success">
        //                     <span>
        //                         {getFormattedMessage(
        //                             "status.filter.complated.label"
        //                         )}
        //                     </span>
        //                 </span>
        //             )) ||
        //             (row.status === 2 && (
        //                 <span className="badge bg-light-primary">
        //                     <span>
        //                         {getFormattedMessage(
        //                             "status.filter.pending.label"
        //                         )}
        //                     </span>
        //                 </span>
        //             )) ||
        //             (row.status === 3 && (
        //                 <span className="badge bg-light-warning">
        //                     <span>
        //                         {getFormattedMessage(
        //                             "status.filter.ordered.label"
        //                         )}
        //                     </span>
        //                 </span>
        //             ))
        //         );
        //     },
        // },
        // {
        //     name: getFormattedMessage("purchase.grant-total.label"),
        //     selector: (row) =>
        //         currencySymbolHandling(
        //             allConfigData,
        //             row.currency,
        //             row.grand_total
        //         ),
        //     sortField: "grand_total",
        //     sortable: true,
        // },
       
    
    ];
   
        const onWarehouseChange = (obj) => {
            setWarehouseValue(obj);
        };

    const onChange = (filter) => {
        fetchSalesReturn(filter, true);
    };

    const onExcelClick = () => {
        setIsWarehouseValue(true);
    };

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText("sale.reports.title")} />
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
                totalRows={totalRecord}
                isShowDateRangeField
                isEXCEL
                warehouseValue={warehouseValue}
                isShowSearch={true}
                onExcelClick={onExcelClick}
            />
            </div>
        </MasterLayout>
    );
};
const mapStateToProps = (state) => {
    const {
        salesReturn,
        frontSetting,
        isLoading,
        totalRecord,
        dates,
        allConfigData,
        warehouses
    } = state;
    return {
        salesReturn,
        frontSetting,
        isLoading,
        totalRecord,
        dates,
        allConfigData,
        warehouses
    };
};

export default connect(mapStateToProps, {
    fetchFrontSetting,
    fetchSales,
    fetchSalesReturn,
    totalSaleReportExcel,
    saleReturnExcelAction,
    fetchAllWarehouses
})(SaleReturnReport);
