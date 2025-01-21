import React, { useState, useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import MasterLayout from "../MasterLayout";
import { fetchCustomers } from "../../store/action/customerAction";
import ReactDataTable from "../../shared/table/ReactDataTable";
import DeleteCustomer from "./DeleteCustomer";
import TabTitle from "../../shared/tab-title/TabTitle";
import {
    getFormattedDate,
    getFormattedMessage,
    placeholderText,
    getAvatarName,
} from "../../shared/sharedMethod";
import ActionButton from "../../shared/action-buttons/ActionButton";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import ImportCustomersModel from "./ImportCustomersModel";
import { Permissions } from "../../constants";
import { fetchConfig } from "../../store/action/configAction";
const Customers = (props) => {
    const { fetchCustomers, customers, totalRecord, isLoading, allConfigData } =
        props;
    const dispatch = useDispatch();
    const [deleteModel, setDeleteModel] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    const navigate = useNavigate();
    const { config } = useSelector((state) => state);
    const [importCustomers, setImportCustomers] = useState(false);

    const handleClose = () => {
        setImportCustomers(!importCustomers);
    };

    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };

    const onChange = (filter) => {
        fetchCustomers(filter, true);
    };

    const goToEditProduct = (item) => {
        const id = item.id;
        navigate(`/app/customers/edit/${id}`);
    };

    useEffect(() => {
        dispatch(fetchConfig());
    }, []);
    const goToDetailScreen = (customer) => {
        const id = customer;
        if (id) {
            window.location.href = "#/app/customers/detail/" + customer;
        } else {
            console.error("ID is undefined for item:", customer);
        }
    };

    const itemsValue =
        customers.length >= 0 &&
        customers.map((customer) => ({
            date: getFormattedDate(
                customer.attributes.created_at,
                allConfigData
            ),
            time: moment(customer.attributes.created_at).format("LT"),
            name: customer.attributes.name,
            email: customer.attributes.email,
            phone: customer.attributes.phone,
            country: customer.attributes.country,
            city: customer.attributes.city,
            credit_limit: customer.attributes.credit_limit,
            id: customer.id,
            unique_code: customer.attributes?.unique_code,
            channelDetails: customer.attributes?.channelDetails?.name,
            areaDetails: customer.attributes?.areaDetails?.name,
            countryDetails: customer.attributes?.countryDetails?.name,
            region: customer.attributes?.areaDetails?.region?.name,
            image: customer.attributes.image,
            status: customer?.attributes?.status === 1 ? "Active" : "Inactive",
        }));

    const columns = [
        {
            name: "Customer Id",
            selector: (row) => row.unique_code,
            sortField: "unique_code",
            sortable: true,
        },
        {
            name: getFormattedMessage("customer.title"),
            selector: (row) => row.name,
            sortField: "name",
            sortable: true,
            cell: (row) => (
                <div className="d-flex align-items-center">
                    <div className="me-2">
                        {row.image ? (
                            <img
                                src={row.image}
                                height="50"
                                width="50"
                                alt="User Image"
                                className="image image-circle image-mini"
                            />
                        ) : (
                            <span className="custom-user-avatar fs-5">
                                {getAvatarName(row.name)}
                            </span>
                        )}
                    </div>
                    <div>
                        <div className="text-primary">{row.name}</div>
                    </div>
                </div>
            ),
        },
        {
            name: "Email & Phone",
            selector: (row) => row.email,
            sortField: "email",
            sortable: false,
            cell: (row) => (
                <div>
                    <div>{row.email}</div>
                    <div>{row.phone}</div>
                </div>
            ),
        },
        {
            name: "Customer Type",
            selector: (row) => row.channelDetails,
            sortField: "chanel_id",
            sortable: false,
        },
        {
            name: "Credit Limits",
            selector: (row) => row.credit_limit,
            sortField: "credit_limit",
            sortable: false,
        },
        {
            name: "Country",
            selector: (row) => row.countryDetails,
            sortField: "countryDetails",
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
            selector: (row) => row.areaDetails,
            sortField: "areaDetails",
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
                    item={row}
                    isViewIcon={true}
                    goToDetailScreen={goToDetailScreen}
                    goToEditProduct={goToEditProduct}
                    onClickDeleteModel={onClickDeleteModel}
                    isEditMode={
                        config && config.includes(Permissions.EDIT_CUSTOMER)
                            ? true
                            : false
                    }
                    isDeleteMode={
                        config && config.includes(Permissions.DELETE_CUSTOMER)
                            ? true
                            : false
                    }
                />
            ),
        },
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText("customers.title")} />
            <ReactDataTable
                columns={columns}
                items={itemsValue}
                onChange={onChange}
                isLoading={isLoading}
                ButtonValue={
                    config && config.includes(Permissions.CREATE_CUSTOMER)
                        ? "Add customer"
                        : ""
                }
                totalRows={totalRecord}
                buttonImport={false}
                goToImport={handleClose}
                importBtnTitle={"customers.import.title"}
                to="#/app/customers/create"
            />
            <DeleteCustomer
                onClickDeleteModel={onClickDeleteModel}
                deleteModel={deleteModel}
                onDelete={isDelete}
            />
            {importCustomers && (
                <ImportCustomersModel
                    handleClose={handleClose}
                    show={importCustomers}
                />
            )}
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const { customers, totalRecord, isLoading, allConfigData } = state;
    return { customers, totalRecord, isLoading, allConfigData };
};

export default connect(mapStateToProps, { fetchCustomers })(Customers);
