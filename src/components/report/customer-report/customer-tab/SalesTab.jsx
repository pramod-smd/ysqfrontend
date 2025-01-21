import React, { useCallback,useEffect } from "react";
import moment from "moment";
import { connect } from "react-redux";
import ReactDataTable from "../../../../shared/table/ReactDataTable";
import { fetchSales } from "../../../../store/action/salesAction";
import {
    currencySymbolHandling,
    getFormattedDate,
    getFormattedMessage,
} from "../../../../shared/sharedMethod";
import { fetchFrontSetting } from "../../../../store/action/frontSettingAction";
import { customerSaleReportPDF,customerSaleReportExcel } from "../../../../store/action/customerReportAction";

const SalesTab = (props) => {
    const {
        sales,
        fetchSales,
        totalRecord,
        isLoading,
        fetchFrontSetting,
        frontSetting,
        isCallSaleApi,
        allConfigData,
        customerId,
        customerSaleReportPDF,
        customerSaleReportExcel,
    } = props;

    useEffect(() => {
        fetchFrontSetting();
    }, []);

    const currencySymbol =
        frontSetting &&
        frontSetting.value &&
        frontSetting.value.currency_symbol;

    // fetch all sale
    const onChange = (filter) => {
        fetchSales(filter, true);
    };

    // onClick pdf function
    const onReportPdfClick = (id) => {
        // customerSaleReportPDF(id);
    };

    const onExcelClick = useCallback((id) => {
        customerSaleReportExcel(id);
    },[]);

    const itemsValue =
        currencySymbol &&
        sales.length >= 0 &&
        sales.map((sale) => ({
            date: getFormattedDate(
                sale.attributes.date,
                allConfigData && allConfigData
            ),
            // date_for_payment: sale.attributes.date,
            time: moment(sale.attributes.created_at).format("LT"),
            reference_code: sale.attributes.reference_code,
            customer_name: sale.attributes.customer_name,
            warehouse_name: sale.attributes.warehouse_name,
            status: sale.attributes.status,
            salesman: sale.attributes?.salesmanDetails,
            payment_status: sale.attributes.payment_status,
            payment_type: sale.attributes.payment_type,
            grand_total: sale.attributes.grand_total,
            paid_amount: sale.attributes.paid_amount
                ? sale.attributes.paid_amount
                : (0.0).toFixed(2),
            id: sale.id,
            currency: currencySymbol,
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
                name: getFormattedMessage("dashboard.recentSales.reference.label"),
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
          
            {
                        name: getFormattedMessage("select.payment-type.label"),
                        sortField: "payment_type",
                        sortable: false,
                        cell: (row) => {
                            return (
                                (row.payment_type === 1 && (
                                    <span className="badge bg-light-primary">
                                        <span>{getFormattedMessage("cash.label")}</span>
                                    </span>
                                )) ||
                                (row.payment_type === 2 && (
                                    <span className="badge bg-light-primary">
                                        <span>
                                            {getFormattedMessage(
                                                "payment-type.filter.cheque.label"
                                            )}
                                        </span>
                                    </span>
                                )) ||
                                (row.payment_type === 3 && (
                                    <span className="badge bg-light-primary">
                                        <span>
                                            {getFormattedMessage(
                                                "payment-type.filter.bank-transfer.label"
                                            )}
                                        </span>
                                    </span>
                                )) ||
                                (row.payment_type === 4 && (
                                    <span className="badge bg-light-primary">
                                        <span>
                                            {getFormattedMessage(
                                                "payment-type.filter.other.label"
                                            )}
                                        </span>
                                    </span>
                                )) ||
                                (row.payment_type === 5 && (
                                    <span className="badge bg-light-primary">
                                        <span>
                                        CREDIT LIMIT
                                        </span>
                                    </span>
                                ))
                            );
                        },
                    },
        ];
        

    return (
        <ReactDataTable
            columns={columns}
            items={itemsValue}
            isCallSaleApi={isCallSaleApi}
            onChange={onChange}
            totalRows={totalRecord}
            isLoading={isLoading}
            isEXCEL
            onExcelClick={()=>onExcelClick(customerId)}
            // isReportPdf
            customerId={customerId}
            // onReportPdfClick={() => onReportPdfClick(customerId)}
        />
    );
};

const mapStateToProps = (state) => {
    const {
        sales,
        totalRecord,
        isLoading,
        frontSetting,
        isCallSaleApi,
        allConfigData,
    } = state;
    return {
        sales,
        totalRecord,
        isLoading,
        frontSetting,
        isCallSaleApi,
        allConfigData,
    };
};

export default connect(mapStateToProps, {
    fetchSales,
    fetchFrontSetting,
    customerSaleReportPDF,
    customerSaleReportExcel,
})(SalesTab);
