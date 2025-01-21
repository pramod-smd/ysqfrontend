import React, { useState, useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import MasterLayout from "../MasterLayout";
import ReactDataTable from "../../shared/table/ReactDataTable";
import { fetchUsers } from "../../store/action/userAction";
import DeleteUser from "./DeleteUser";
import TabTitle from "../../shared/tab-title/TabTitle";
import { getAvatarName, getFormattedDate } from "../../shared/sharedMethod";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { placeholderText } from "../../shared/sharedMethod";
import ActionButton from "../../shared/action-buttons/ActionButton";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import { Permissions } from "../../constants";
import { fetchConfig } from "../../store/action/configAction";
import { state } from "faker/lib/locales/az/address";

const User = (props) => {
    const { users, fetchUsers, totalRecord, isLoading, allConfigData } = props;
    const dispatch = useDispatch();
    const [deleteModel, setDeleteModel] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    const { config } = useSelector((state) => state);
    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };

    const itemsValue =
        users.length >= 0 &&
        users.map((user) => ({
            date: getFormattedDate(
                user.attributes.created_at,
                allConfigData && allConfigData
            ),
            time: moment(user.attributes.created_at).format("LT"),
            image: user.attributes.image,
            first_name: user.attributes.first_name,
            last_name: user.attributes.last_name,
            email: user.attributes.email,
            phone: user.attributes.phone,
            password: user.attributes.password,
            confirm_password: user.attributes.confirm_password,
            role_name: user.attributes.role.map((role) => role.display_name),
            id: user.id,
            status: user?.attributes?.status === 1 ? "Active" : "Inactive",
        }));

    const onChange = (filter) => {
        fetchUsers(filter, true);
    };
    useEffect(() => {
        dispatch(fetchConfig());
    }, []);

    const goToEdit = (item) => {
        const id = item.id;
        window.location.href = "#/app/users/edit/" + id;
    };

    const columns = [
        {
            name: getFormattedMessage("users.table.user.column.title"),
            selector: (row) => row.first_name,
            sortField: "first_name",
            sortable: true,
            cell: (row) => {
                const imageUrl = row.image ? row.image : null;
                const lastName = row.last_name ? row.last_name : "";
                return (
                    <div className="d-flex align-items-center">
                        <div className="me-2">
                            <Link to={`/app/users/detail/${row.id}`}>
                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        height="50"
                                        width="50"
                                        alt="User Image"
                                        className="image image-circle image-mini"
                                    />
                                ) : (
                                    <span className="custom-user-avatar fs-5">
                                        {getAvatarName(
                                            row.first_name + " " + row.last_name
                                        )}
                                    </span>
                                )}
                            </Link>
                        </div>
                        <div className="d-flex flex-column">
                            <Link
                                to={`/app/users/detail/${row.id}`}
                                className="text-decoration-none"
                            >
                                {row.first_name + " " + lastName}
                            </Link>
                            <span>{row.email}</span>
                        </div>
                    </div>
                );
            },
        },
        {
            name: getFormattedMessage("users.table.phone-number.column.title"),
            selector: (row) => row.phone,
            sortField: "phone",
            sortable: true,
        },
        {
            name: getFormattedMessage(
                "globally.react-table.column.created-date.label"
            ),
            selector: (row) => row.date,
            sortField: "created_at",
            sortable: true,
            cell: (row) => {
                return (
                    <span className="badge bg-light-info">
                        <div className="mb-1">{row.time}</div>
                        <div>{row.date}</div>
                    </span>
                );
            },
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
                    goToEditProduct={goToEdit}
                    isEditMode={
                        config && config.includes(Permissions.EDIT_ADMIN)
                            ? true
                            : false
                    }
                    isDeleteMode={
                        config && config.includes(Permissions.DELETE_ADMIN)
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
            <TabTitle title={placeholderText("users.title")} />
            <ReactDataTable
                columns={columns}
                items={itemsValue}
                onChange={onChange}
                ButtonValue={
                    config && config.includes(Permissions.CREATE_ADMIN)
                        ? " Add admin"
                        : ""
                }
                to="#/app/users/create"
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
    const { users, totalRecord, isLoading, allConfigData } = state;
    return { users, totalRecord, isLoading, allConfigData };
};
export default connect(mapStateToProps, { fetchUsers })(User);
