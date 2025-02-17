import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import moment from "moment/moment";
import ReactDataTable from "../../../../shared/table/ReactDataTable";
import {
    currencySymbolHandling,
    getFormattedMessage,
} from "../../../../shared/sharedMethod";
import { stockDetailsSaleReturnAction } from "../../../../store/action/stockDetailsSaleReturnAction";
import { fetchFrontSetting } from "../../../../store/action/frontSettingAction";
import { stockDetailsSaleReturnExcel } from "../../../../store/action/stockDetailsSaleReturnExcel";

const SaleReturnTabs = (props) => {
    const {
        isLoading,
        totalRecord,
        stockDetailsSaleReturnAction,
        frontSetting,
        fetchFrontSetting,
        warehouseValue,
        stockDetailsSaleReturnExcel,
        stockDetailSaleReturn,
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
            stockDetailsSaleReturnExcel(id, setIsWarehouseValue);
        }
    }, [isWarehouseValue]);

    useEffect(() => {
        fetchFrontSetting();
    }, [warehouseValue]);

    const itemsValue =
        currencySymbol &&
        stockDetailSaleReturn.length >= 0 &&
        stockDetailSaleReturn.map((sale) => ({
            time: moment(sale.attributes.created_at).format("LT"),
            date: moment(sale.attributes.date).format("YYYY-MM-DD"),
            reference_code: sale.attributes.reference_code,
            customer_name: sale.attributes.customer_name,
            warehouse_name: sale.attributes.warehouse_name,
            id: sale.id,
            sale_return_items: sale.attributes.sale_return_items.map(
                (item) => ({
                    name: item.product_id && item.product_id[0]?.name,
                    sub_total: item.sub_total,
                    quantity: item.quantity,
                    product_id: item.product_id && item.product_id[0]?.main_product_id,
                })
            ),
            currency: currencySymbol,
        }));

    const columns = [
        {
            name: getFormattedMessage(
                "globally.react-table.column.created-date.label"
            ),
            selector: (row) => row.date,
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
                return row.sale_return_items.map((item) =>
                    item?.product_id == Number(id) ? item?.name:""
                );
            },
        },
        {
            name: getFormattedMessage("customer.title"),
            selector: (row) => row.customer_name,
            sortField: "customer_name",
            sortable: false,
        },
        // {
        //     name: getFormattedMessage("warehouse.title"),
        //     selector: (row) => row.warehouse_name,
        //     sortField: "warehouse_name",
        //     sortable: false,
        // },
        {
            name: getFormattedMessage("globally.detail.quantity"),
            sortField: "quantity",
            sortable: false,
            cell: (row) => {
                return row.sale_return_items.map((item) =>
                    item?.product_id == Number(id) ? (
                        <span className="badge bg-light-info">
                            <span>{item?.quantity}</span>
                        </span>
                    ) : (
                        ""
                    )
                );
            },
        },
        {
            name: getFormattedMessage("globally.detail.subtotal"),
            sortField: "sub_total",
            sortable: false,
            cell: (row) => {
                return row.sale_return_items.map((item) =>
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
    ];

    const onChange = (filter) => {
        stockDetailsSaleReturnAction(id,warehouseValue, filter, true);
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
    const { isLoading, totalRecord, stockDetailSaleReturn, frontSetting } =
        state;
    return { isLoading, totalRecord, stockDetailSaleReturn, frontSetting };
};

export default connect(mapStateToProps, {
    fetchFrontSetting,
    stockDetailsSaleReturnAction,
    stockDetailsSaleReturnExcel,
})(SaleReturnTabs);
