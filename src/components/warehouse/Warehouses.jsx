import React, { useState, useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import MasterLayout from "../MasterLayout";
import { fetchWarehouses } from "../../store/action/warehouseAction";
import ReactDataTable from "../../shared/table/ReactDataTable";
import DeleteWarehouse from "./DeleteWarehouse";
import TabTitle from "../../shared/tab-title/TabTitle";
import {
    getFormattedDate,
    getFormattedMessage,
    placeholderText,
} from "../../shared/sharedMethod";
import ActionButton from "../../shared/action-buttons/ActionButton";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import { Permissions } from "../../constants";
import { fetchConfig } from "../../store/action/configAction";

// Helper function to get avatar initials
const getAvatarName = (name) => {
    const parts = name.split(" ");
    return parts.map((part) => part.charAt(0).toUpperCase()).join("");
};

const Warehouses = (props) => {
    const {
        fetchWarehouses,
        warehouses,
        totalRecord,
        isLoading,
        allConfigData,
        selectedCountry,
    } = props;
    const dispatch = useDispatch();
    const { config } = useSelector((state) => state);
    const [deleteModel, setDeleteModel] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    // const [selectedCountry, setSelectedCountry] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchConfig());
        fetchWarehouses();
    }, []);

    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };

    const onChange = (filter) => {
        fetchWarehouses(filter, true);
    };

    const goToEditProduct = (item) => {
        const id = item.id;
        navigate(`/app/warehouse/edit/${id}`);
    };

    const goToProductDetailPage = (id) => {
        navigate(`/app/warehouse/detail/${id}`);
    };
    const itemsValue =
        warehouses.length >= 0 &&
        warehouses.map((warehouse) => {
            const warehouseDetails =
                warehouse.attributes.warehouseDetails || {};
            const countryDetails = warehouse.attributes.countryDetails || {};
            const areaDetails = warehouse.attributes.areaDetails || {};

            return {
                date: getFormattedDate(
                    warehouse.attributes.created_at,
                    allConfigData && allConfigData
                ),
                time: moment(warehouse.attributes.created_at).format("LT"),
                name: warehouse.attributes.name,
                image: warehouseDetails.image_url || null, // Use optional chaining
                phone: warehouse.attributes.phone,
                unique_code: warehouseDetails.unique_code,
                country: countryDetails.name,
                city: warehouse.attributes.city,
                email: warehouse.attributes.email,
                zip_code: warehouse.attributes.zip_code,
                id: warehouse.id,
                ware_id: warehouse.attributes?.ware_id,
                status:warehouse?.attributes?.status === 1 ? "Active" : "Inactive",
                area: areaDetails.name,
                region: areaDetails.region?.name,
            };
        });

    const columns = [
        {
            name: "Warehouse Id",
            selector: (row) => row.unique_code,
            sortField: "unique_code",
            sortable: false,
        },
        {
            name: getFormattedMessage("globally.detail.warehouse"),
            selector: (row) => row.name,
            sortField: "name",
            sortable: true,
            cell: (row) => {
                const imageUrl = row.image || null;
                return (
                    <div className="d-flex align-items-center">
                        <div className="me-2">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    height="50"
                                    width="50"
                                    alt="Warehouse Image"
                                    className="image image-circle image-mini"
                                />
                            ) : (
                                <span className="custom-user-avatar fs-5">
                                    {(row?.name)}
                                </span>
                            )}
                        </div>
                        <div>
                            <div className="text-primary">{row.name}</div>
                            {/* <div>{row.email}</div> */}
                        </div>
                    </div>
                );
            },
        },
        {
            name: "Email & Phone",
            selector: (row) => row.email,
            sortField: "email",
            sortable: true,
            cell: (row) => (
                <div>
                    <div>{row.email}</div>
                    <div>{row.phone}</div>
                </div>
            ),
        },
        {
            name: getFormattedMessage("globally.input.country.label"),
            selector: (row) => row.country,
            sortField: "country",
            sortable: false,
        },
        {
            name: "Region",
            selector: (row) => row.region,
            sortField: "region",
            sortable: false,
        },
        {
            name: "Area",
            selector: (row) => row.area,
            sortField: "area",
            sortable: false,
        },

        {
            name: "Status",
            selector: (row) => (
                <span
                    style={{
                        display: "inline-block",
                        padding: "0.25em 0.5em",
                        fontSize: "0.875em",
                        color: "#fff",
                        backgroundColor:
                            row.status === "Active" ? "#4CAF50" : "#F44336",
                        borderRadius: "0.25rem",
                        textAlign: "center",
                    }}
                >
                    {row.status}
                </span>
            ),
            sortable: false,
        },

        {
            name: getFormattedMessage("react-data-table.action.column.label"),
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            cell: (row) => (
                <ActionButton
                    isViewIcon={true}
                    item={row}
                    goToDetailScreen={goToProductDetailPage}
                    goToEditProduct={goToEditProduct}
                    isEditMode={
                        config && config.includes(Permissions.EDIT_WAREHOUSE)
                            ? true
                            : false
                    }
                    isDeleteMode={
                        config && config.includes(Permissions.DELETE_WAREHOUSE)
                            ? true
                            : false
                    }
                    onClickDeleteModel={onClickDeleteModel}
                />
            ),
        },
    ];

    const onChecked = (row) => {
        activeInactiveUser(row.id, row);
    };


    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText("warehouse.title")} />
            <ReactDataTable
                columns={columns}
                items={itemsValue}
                onChange={onChange}
                isLoading={isLoading}
                ButtonValue={
                    config && config.includes(Permissions.CREATE_WAREHOUSE)
                        ? "Add warehouse"
                        : ""
                }
                totalRows={totalRecord}
                to="#/app/warehouse/create"
            />
            <DeleteWarehouse
                onClickDeleteModel={onClickDeleteModel}
                deleteModel={deleteModel}
                onDelete={isDelete}
            />
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const { warehouses, totalRecord, isLoading, allConfigData } = state;
    return { warehouses, totalRecord, isLoading, allConfigData };
};

export default connect(mapStateToProps, {
    fetchWarehouses,
})(Warehouses);
