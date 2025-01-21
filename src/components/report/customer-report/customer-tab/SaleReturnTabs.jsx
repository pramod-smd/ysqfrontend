import React, { useEffect } from "react";
import moment from "moment";
import { connect } from "react-redux";
import ReactDataTable from "../../../../shared/table/ReactDataTable";
import { fetchSalesReturn } from "../../../../store/action/salesReturnAction";
import {
    currencySymbolHandling,
    getFormattedDate,
    getFormattedMessage,
} from "../../../../shared/sharedMethod";
import { fetchFrontSetting } from "../../../../store/action/frontSettingAction";
import {customerSaleReturnReportExcel } from "../../../../store/action/customerReportAction";

const SaleReturnTabs = (props) => {
    const {
        salesReturn,
        fetchSalesReturn,
        totalRecord,
        isLoading,
        frontSetting,
        fetchFrontSetting,
        allConfigData,
        customerId,
        customerSaleReturnReportExcel,
    } = props;

    useEffect(() => {
        fetchFrontSetting();
    }, []);

    const currencySymbol =
        frontSetting &&
        frontSetting.value &&
        frontSetting.value.currency_symbol;

    // fetch all sale return
    const onChange = (filter) => {
        fetchSalesReturn(filter, true);
    };

    //onClick pdf function
    // const onReportPdfClick = (id) => {
    //     customerSaleReturnReportPDF(id);
    // };
    const onExcelClick = (id) => {
        customerSaleReturnReportExcel(id);
    };



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

    return (
        <ReactDataTable
            columns={columns}
            items={itemsValue}
            onChange={onChange}
            totalRows={totalRecord}
            customerId={customerId}
            isLoading={isLoading}
            isEXCEL
            onExcelClick={()=>onExcelClick(customerId)}            
        />
    );
};

const mapStateToProps = (state) => {
    const { salesReturn, totalRecord, isLoading, frontSetting, allConfigData } =
        state;
    return { salesReturn, totalRecord, isLoading, frontSetting, allConfigData };
};

export default connect(mapStateToProps, {
    fetchSalesReturn,
    fetchFrontSetting,
    customerSaleReturnReportExcel,
})(SaleReturnTabs);
