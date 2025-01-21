import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import moment from "moment";
import MasterLayout from "../MasterLayout";
import { useNavigate, Link } from "react-router-dom";
import ReactDataTable from "../../shared/table/ReactDataTable";
import TabTitle from "../../shared/tab-title/TabTitle";
import { fetchUserNotificationTemplates } from "../../store/action/notificationTemplateAction";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import ModalAction from "../../shared/action-buttons/ActionButton";
import { Permissions } from "../../constants";
import { fetchConfig } from "../../store/action/configAction";
const UserNotificationList = (props) => {
    const {
        userNotifications,
        fetchUserNotificationTemplates,
        totalRecord,
        isLoading,
    } = props;
    const dispatch = useDispatch();

    const { config } = useSelector((state) => state);

    useEffect(() => {
        dispatch(fetchConfig());
        fetchUserNotificationTemplates();
    }, []);

    const itemsValue =
        userNotifications.length >= 0 &&
        userNotifications.map((item) => ({
            title: item?.title,
            type: item?.type,
            id: item?.id,
        }));

    const onChange = (filter) => {
        fetchUserNotificationTemplates(filter, true);
    };

    const goToEditProduct = (item) => {
        const id = item.id;
        window.location.href = "#/app/user-notification-templates/" + id;
    };

    const columns = [
        {
            name: "Title",
            selector: (row) => row?.title,
            sortable: true,
            sortField: "title",
        },
        {
            name: "Type",
            selector: (row) => row.type,
            sortField: "type",
            sortable: true,
        },

        {
            name: "Action",
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            cell: (row) => (
                <ModalAction
                    item={row}
                    goToEditProduct={goToEditProduct}
                    isEditMode={
                        config &&
                        config.includes(
                            Permissions.EDIT_USER_NOTIFICATION_TEMPLATE
                        )
                            ? true
                            : false
                    }
                    isDeleteMode={false}
                />
            ),
        },
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title="User Notifications List" />
            <ReactDataTable
                columns={columns}
                items={itemsValue}
                isLoading={isLoading}
                onChange={onChange}
                totalRows={totalRecord}
                ButtonValue={
                    config &&
                    config.includes(
                        Permissions.CREATE_USER_NOTIFICATION_TEMPLATE
                    )
                        ? "Add User Notification"
                        : ""
                }
                to="#/app/user-notification-templates/create"
            />
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const { userNotifications, totalRecord, isLoading } = state;
    return { userNotifications, totalRecord, isLoading };
};

export default connect(mapStateToProps, {
    fetchUserNotificationTemplates,
})(UserNotificationList);
