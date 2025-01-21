import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import moment from "moment/moment";
import ReactDataTable from "../../../../shared/table/ReactDataTable";
import {
    currencySymbolHandling,
    getFormattedMessage,
} from "../../../../shared/sharedMethod";
import { productDetailsSaleTabAction } from "../../../../store/action/stockDetailsSaleTabAction";
import { fetchFrontSetting } from "../../../../store/action/frontSettingAction";
import { stockDetailsSaleExcel } from "../../../../store/action/stockDetailsSaleExcel";

const SaleTabs = (props) => {
    const {
        isLoading,
        totalRecord,
        productDetailsSaleTabAction,
        frontSetting,
        fetchFrontSetting,
        warehouseValue,
        stockDetailsSaleExcel,
        stockDetailsSales,
        id,
        allConfigData,
    } = props;
    const currencySymbol =
        frontSetting &&
        frontSetting.value &&
        frontSetting.value.currency_symbol;
    const [isWarehouseValue, setIsWarehouseValue] = useState(false);

    useEffect(() => {
        if (isWarehouseValue === true) {
            stockDetailsSaleExcel(id, setIsWarehouseValue);
        }
    }, [isWarehouseValue]);

    useEffect(() => {
        fetchFrontSetting();
    }, [warehouseValue]);
     
    const itemsValue =
        currencySymbol &&
        stockDetailsSales.length >= 0 &&
        stockDetailsSales.map((sale) => ({
            time: moment(sale.attributes.created_at).format("LT"),
            date: moment(sale.attributes.date).format("YYYY-MM-DD"),
            reference_code: sale.attributes.reference_code,
            customer_name: sale.attributes.customer_name,
            warehouse_name: sale.attributes.warehouse_name,
            payment_type: sale.attributes.payment_type,
            salesman: sale.attributes?.salesmanDetails,
            id: sale.id,
            sale_items: sale.attributes.sale_items.map((item) => ({
                name: item.product_id && item.product_id[0]?.name,
                sub_total: item.sub_total,
                quantity: item.quantity,
                product_id: item.product_id &&  item.product_id[0]?.main_product_id,
                product_unit_name: item.product_id &&  item.product_id[0]?.product_unit_name?.name,
                
            })),
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
            name: getFormattedMessage("supplier.table.name.column.title"),
            sortField: "name",
            sortable: false,
            cell: (row) => {
                return row.sale_items.map((item) =>                    
                     item.product_id == Number(id) ? item.name : ""
                );
            },
        },
        {
            name: getFormattedMessage("globally.detail.quantity"),
            sortField: "quantity",
            sortable: false,
            cell: (row) => {
                return row.sale_items.map((item) =>
                    item.product_id == Number(id) ? (
                        <span className="badge bg-light-info">
                            <span>{item?.quantity +' '+item?.product_unit_name}</span>
                        </span>
                    ) : (
                        ""
                    )
                );
            },
        },
        
        {
            name: "Amount",
            sortField: "sub_total",
            sortable: false,
            cell: (row) => {
                return row.sale_items.map((item) =>
                    item?.product_id == Number(id)
                        ? currencySymbolHandling(
                              allConfigData,
                              row.currency,
                              item.sub_total
                          )
                        : ""
                );
            },
        },
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
        {
            name: getFormattedMessage("customer.title"),
            selector: (row) => row.customer_name,
            sortField: "customer_name",
            sortable: false,
        },
        {
            name: "Salesman",
            selector: (row) => row?.salesman?.first_name+" "+row?.salesman?.last_name,
            sortField: "salesman",
            sortable: false,
        },
        {
            name: getFormattedMessage("warehouse.title"),
            selector: (row) => row.warehouse_name,
            sortField: "warehouse_name",
            sortable: false,
        },
        
     
    ];

    const onChange = (filter) => {
        productDetailsSaleTabAction(id, filter, true);
    };

    const onExcelClick = () => {
        setIsWarehouseValue(true);
    };

    return (
        <ReactDataTable
            columns={columns}
            items={itemsValue}
            onChange={onChange}
            warehouseValue={warehouseValue}
            isLoading={isLoading}
            totalRows={totalRecord}
            isEXCEL
            onExcelClick={onExcelClick}
        />
    );
};

const mapStateToProps = (state) => {
    const { isLoading, totalRecord, stockDetailsSales, frontSetting } = state;
    return { isLoading, totalRecord, stockDetailsSales, frontSetting };
};

export default connect(mapStateToProps, {
    fetchFrontSetting,
    stockDetailsSaleExcel,
    productDetailsSaleTabAction,
})(SaleTabs);
