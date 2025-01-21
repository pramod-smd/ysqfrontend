import React, { useState,useEffect } from "react";
import { connect,useDispatch,useSelector } from "react-redux";
import MasterLayout from "../MasterLayout";
import ReactDataTable from "../../shared/table/ReactDataTable";
import ModalAction from "../../shared/action-buttons/ActionButton";
import { fetchRoles } from "../../store/action/roleAction";
import { fetchChanels,deleteChanel } from "../../store/action/chanelAction";
import TabTitle from "../../shared/tab-title/TabTitle";
import DeleteChanel from "./DeleteChanel";
import {
    getFormattedDate,
    getFormattedMessage,
    placeholderText,
} from "../../shared/sharedMethod";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import { Permissions } from "../../constants";
import { fetchConfig } from "../../store/action/configAction";

const Chanel = (props) => {
    const {chanels,fetchChanels, roles, fetchRoles, totalRecord, isLoading, allConfigData } = props;
    const dispatch = useDispatch();
    const [deleteModel, setDeleteModel] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    const {config} = useSelector(
        (state) => state
    );

    useEffect(()=>{
        dispatch(fetchConfig())
        // fetchChanels();
      },[]);
    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };

    const itemsValue =
        chanels.length >= 0 &&
        chanels.map((chanel) => ({
            date: getFormattedDate(
                chanel.created_at,
                allConfigData && allConfigData
            ),
            name: chanel.name,
            status:chanel.status,
            id: chanel.id,
        }));
    const onChange = (filter) => {
        fetchChanels(filter, true);
    };
    const goToEdit = (item) => {
        const id = item.id;
        window.location.href = "#/app/chanels/edit/" + id;
    };

    const columns = [
        {
            name: getFormattedMessage("globally.input.name.label"),
            selector: (row) => row.name,
            sortable: true,
            sortField: "name",
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
            sortField: "status",
            sortable: false,
        },

        // {
        //     name:"Added On",
        //     selector: (row) => row.date,
        //     sortField: "date",
        //     sortable: false,
        // },
        {
            name: getFormattedMessage("react-data-table.action.column.label"),
            right: true,
            sortable: false,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            cell: (row) => (
                <ModalAction
                    item={row}
                    goToEditProduct={goToEdit}
                    isEditMode={config && config.includes(Permissions.EDIT_CHANNEL)?true:false}
                    isDeleteMode={config && config.includes(Permissions.DELETE_CHANNEL)?true:false}
                    onClickDeleteModel={onClickDeleteModel}
                />
            ),
        },
    ];
    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title="Channels" />
            <ReactDataTable
                columns={columns}
                items={itemsValue}
                onChange={onChange}
                ButtonValue={config && config.includes(Permissions.CREATE_CHANNEL)?"Add Channel":""}
                to="#/app/chanels/create"
                totalRows={totalRecord}
                isLoading={isLoading}
            />
            <DeleteChanel
                onClickDeleteModel={onClickDeleteModel}
                deleteModel={deleteModel}
                onDelete={isDelete}
            />
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const {chanels, roles, totalRecord, isLoading, allConfigData } = state;
    return {chanels, roles, totalRecord, isLoading, allConfigData };
};
export default connect(mapStateToProps, { fetchRoles,fetchChanels })(Chanel);
