import React from "react";
import ReactDataTable from "../../shared/table/ReactDataTable";
import { connect, useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import MasterLayout from "../MasterLayout";
import { fetchAdminEmaiTemplates } from "../../store/action/emailTemplatesAction";
import { useNavigate } from "react-router";
import {
    getFormattedDate,
    getFormattedMessage,
    placeholderText,
} from "../../shared/sharedMethod";
import ActionButton from "../../shared/action-buttons/ActionButton";
import { Permissions } from "../../constants";
import { fetchConfig } from "../../store/action/configAction";
const AdminEmailTemplate = (props) => {
    const { totalRecord, isLoading, fetchAdminEmaiTemplates, emailTemplates } =
        props;
    const dispatch = useDispatch();
    const { config } = useSelector((state) => state);
    useEffect(() => {
        dispatch(fetchConfig());
    }, []);
    useEffect(() => {
        fetchAdminEmaiTemplates();
    }, [fetchAdminEmaiTemplates]);

    const itemsValue =
        emailTemplates.length >= 0 &&
        emailTemplates.map((template) => ({
            template_name: template?.template_name,
            template_type: template?.template_type,
            content: template?.content,
            id: template?.id,
            status: template?.status === 1 ? "Active" : "Inactive",
        }));

    const goToEditProduct = (template) => {
        const id = template.id;
        window.location.href = "#/app/admin-email-templates/edit/" + id;
    };

    const navigate = useNavigate();

    const onChange = (filter) => {
        fetchAdminEmaiTemplates(filter, true);
    };

    const columns = [
        {
            name: "Template Name",
            selector: (row) => row.template_name,
            sortable: false,
            sortField: "template_name",
        },
        {
            name: "Type",
            selector: (row) => row.template_type,
            sortable: false,
            sortField: "template_type",
        },
        // {
        //     name: "Content",
        //     selector: (row) => row.content,
        //     sortable:false,
        //     sortField: "content",
        // },
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
            width: "120px",
            cell: (row) => (
                <ActionButton
                    item={row}
                    goToEditProduct={goToEditProduct}
                    isEditMode={
                        config &&
                        config.includes(Permissions.EDIT_ADMIN_EMAIL_TEMPLATE)
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
            <ReactDataTable
                columns={columns}
                items={itemsValue}
                onChange={onChange}
                isLoading={isLoading}
                totalRows={totalRecord}
                ButtonValue={
                    config &&
                    config.includes(Permissions.CREATE_ADMIN_EMAIL_TEMPLATE)
                        ? "Add Admin Email Template"
                        : ""
                }
                to="#/app/admin-email-templates/add"
            />
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const { emailTemplates, totalRecord, isLoading } = state;
    return {
        emailTemplates,
        totalRecord,
        isLoading,
    };
};

export default connect(mapStateToProps, { fetchAdminEmaiTemplates })(
    AdminEmailTemplate
);
