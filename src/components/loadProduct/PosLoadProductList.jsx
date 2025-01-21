import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import MasterLayout from "../MasterLayout";
import ReactDataTable from "../../shared/table/ReactDataTable";
import TabTitle from "../../shared/tab-title/TabTitle";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import { assignedProduct } from "../../store/action/loadUnloadAction";
import moment from "moment";
import { Permissions } from "../../constants";
import { fetchConfig } from "../../store/action/configAction";
const PosLoadProductList = (props) => {
    const {
        totalRecord,
        isLoading,
        assignedProductsList,
        assignedProduct,
        allConfigData,
    } = props;
    const dispatch = useDispatch();
    const { config } = useSelector((state) => state);
    useEffect(() => {
        dispatch(fetchConfig());
        assignedProduct();
    }, []);

    const onChange = (filter) => {
        assignedProduct(filter, true);
    };

    const itemsValue =
        assignedProductsList &&
        assignedProductsList.map((item) => ({
            salesman: item.salesman,
            assign_for_date: item.assign_for_date,
            quantity: item.quantity,
            total_quantity: item.total_quantity,
            product: item?.products,
            id: item.id,
        }));

    const columns = [
        {
            name: "Salesman Name",
            selector: (row) => row.salesman,
            sortable: false,
            sortField: "salesman",
            cell: (row) =>
                row.salesman
                    ? `${row.salesman.first_name} ${row.salesman.last_name}`
                    : "N/A",
        },
        {
            name: "Assigned Date",
            selector: (row) => row.assign_for_date,
            sortable: true,
            sortField: "assign_for_date",
            cell: (row) => moment(row.assign_for_date).format("DD-MM-yyyy"),
        },
        {
            name: "Quantity",
            cell: (row) => (
                <div>
                    {row.total_quantity}{" "}
                    <span
                        className="badge bg-light-success"
                        style={{
                            padding: "5px 10px",
                            fontSize: "12px",
                            marginLeft: "5px",
                        }}
                    >
                        {row.product?.productDetails?.attributes
                            ?.product_unit_name?.name || ""}
                    </span>
                </div>
            ),
            sortable: true,
            sortField: "total_quantity",
        },

        {
            name: "Product Name",
            selector: (row) => row.product,
            sortable: true,
            sortField: "products",
            cell: (row) => (row.product ? row.product.name : "N/A"),
        },
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title="Assigned Products" />
            {config && config.includes(Permissions.ASSIGN_PRODUCT) ? (
                <div className="d-flex justify-content-end">
                    <button
                        className="btn mb-2"
                        onClick={() => (window.location.href = "#/app/load")}
                        style={{ backgroundColor: "#ff5722", color: "white" }}
                    >
                        Assign Product
                    </button>
                </div>
            ) : (
                ""
            )}
            <ReactDataTable
                columns={columns}
                items={itemsValue}
                onChange={onChange}
                isShowDateRangeField
                isLoading={isLoading}
                totalRows={totalRecord}
            />
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const {
        totalRecord,
        isLoading,
        assignedProductsList,
        assignedProduct,
        allConfigData,
    } = state;
    return {
        totalRecord,
        isLoading,
        assignedProductsList,
        assignedProduct,
        allConfigData,
    };
};
export default connect(mapStateToProps, { assignedProduct })(
    PosLoadProductList
);
