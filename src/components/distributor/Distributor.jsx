import React, { useState,useEffect } from "react";
import { connect ,useDispatch,useSelector} from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import MasterLayout from "../MasterLayout";
import ReactDataTable from "../../shared/table/ReactDataTable";
import { fetchDistributors} from "../../store/action/userAction";
import DeleteUser from "./DeleteUser";
import TabTitle from "../../shared/tab-title/TabTitle";
import {
    getAvatarName,
    getFormattedDate,
    getFormattedMessage,
    placeholderText,
} from "../../shared/sharedMethod";
import ActionButton from "../../shared/action-buttons/ActionButton";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import { Permissions } from "../../constants";
import { fetchConfig } from "../../store/action/configAction";
const Distributor = (props) => {
    const {
        allConfigData,
        distributors,
        fetchDistributors,
        totalRecord,
        isLoading,
    } = props;
    const dispatch = useDispatch();
    const [deleteModel, setDeleteModel] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    const {config} = useSelector(
        (state) => state
    );

    useEffect(()=>{
        dispatch(fetchConfig());
    },[])

    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };

    const itemsValue =
        Array.isArray(distributors) &&
        distributors.map((user) => ({
            date: getFormattedDate(user.attributes.created_at, allConfigData),
            time: moment(user.attributes.created_at).format("LT"),
            image: user.attributes.image,
            first_name: user.attributes.first_name,
            unique_code: user.attributes.unique_code,
            last_name: user.attributes.last_name,
            email: user.attributes.email,
            phone: user.attributes.phone,
            country: user.attributes.countryDetails?.name,
            region: user.attributes.regionDetails?.name,
            area: user.attributes.areaDetails?.name,
            role_name: user.attributes.role.map((role) => role.display_name),
            id: user.id,
            status: user?.attributes?.status === 1 ? "Active" : "Inactive",
        }));

        const goToDetailScreen = (user) => {
            const id = user;

            if (id) {
                window.location.href = "#/app/distributors/detail/" + user;
            } else {
                console.error("ID is undefined for item:", item);
            }
        };

    const onChange = (filter) => {
        fetchDistributors(filter, true);
    };
    const goToEdit = (item) => {
        const id = item.id;
        window.location.href = `#/app/distributor/edit/${id}`;
    };


    const columns = [
        {
            name: "Unique Id",
            selector: (row) => row.unique_code,
            sortField: "unique_code",
            sortable: true,
        },
        {
            name: "Distributor",
            selector: (row) => row.first_name,
            sortField: "first_name",
            sortable: true,
            cell: (row) => (
                <div className="d-flex align-items-center">
                    <div className="me-2">
                        <Link to={`/app/distributors/detail/${row.id}`}>
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
                                    {getAvatarName(
                                        `${row.first_name} ${row.last_name}`
                                    )}
                                </span>
                            )}
                        </Link>
                    </div>
                    <div className="d-flex flex-column">
                        <Link
                            to={`/app/distributors/detail/${row.id}`}
                            className="text-decoration-none"
                        >
                            {`${row.first_name} ${row.last_name}`}
                        </Link>
                    </div>
                </div>
            ),
        },
        {
            name: "Email & Phone",
            selector: (row) => row.email,
            cell: (row) => (
                <div>
                    {row.email}
                    <br />
                    {row.phone}
                </div>
            ),
        },
        { name: "Country", selector: (row) => row.country, sortField: "country", sortable: false },
        { name: "Region", selector: (row) => row.region,  sortField: "region", sortable: false },

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
            cell: (row) => (
                <ActionButton
                    isViewIcon={true}
                    goToDetailScreen={goToDetailScreen}
                    item={row}
                    goToEditProduct={goToEdit}
                    isEditMode={
                        config &&
                        config.includes(
                            Permissions.EDIT_DISTRIBUTOR
                        )
                            ? true
                            : false
                    }
                    isDeleteMode={
                        config &&
                        config.includes(
                            Permissions.DELETE_DISTRIBUTOR
                        )
                            ? true
                            : false
                    }
                    onClickDeleteModel={onClickDeleteModel}
                />
            ),
        },
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title="Distributor" />
            <ReactDataTable
                columns={columns}
                items={itemsValue}
                onChange={onChange}
                ButtonValue={
                    config &&
                    config.includes(
                        Permissions.CREATE_DISTRIBUTOR
                    )
                        ?" Add distributor"
                        : ""
                }
                to="#/app/distributor/create"
                totalRows={totalRecord}
                isLoading={isLoading}
            />
            <DeleteUser
                onClickDeleteModel={onClickDeleteModel}
                deleteModel={deleteModel}
                onDelete={isDelete}
            />
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const { distributors, totalRecord, isLoading, allConfigData } = state;
    return { distributors, totalRecord, isLoading, allConfigData };
};

export default connect(mapStateToProps, { fetchDistributors})(Distributor);
