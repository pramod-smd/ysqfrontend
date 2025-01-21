import React, { useState, useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import MasterLayout from "../MasterLayout";
import { fetchRegions } from "../../store/action/regionAction";
import ReactDataTable from "../../shared/table/ReactDataTable";
import DeleteRegion from "./DeleteRegion";
import CreateRegion from "./CreateRegion";
import EditRegion from "./EditRegion";
import TabTitle from "../../shared/tab-title/TabTitle";
import {
    getFormattedMessage,
    placeholderText,
} from "../../shared/sharedMethod";
import ActionButton from "../../shared/action-buttons/ActionButton";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import { Permissions } from "../../constants";
import { fetchConfig } from "../../store/action/configAction";

const Region = (props) => {
    const { fetchRegions, regions, totalRecord, isLoading, allConfigData } =
        props;
    const dispatch = useDispatch();
    const { config } = useSelector((state) => state);
    const [deleteModel, setDeleteModel] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    const [toggle, setToggle] = useState(false);
    const [region, setRegion] = useState();
    const handleClose = (item = null) => {
        setToggle(!toggle);
        setRegion(item);
    };

    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };

    const onChange = (filter) => {
        fetchRegions(filter, true);
    };

    useEffect(() => {
        dispatch(fetchConfig());
    }, []);

    const itemsValue =
        regions.length >= 0 &&
        regions.map((item) => ({
            name: item?.name,
            status: item?.status,
            country: item?.country?.name,
            country_id: item?.country?.id,
            id: item?.id,
        }));

    const columns = [
        {
            name: getFormattedMessage("globally.input.name.label"),
            selector: (row) => row.name,
            sortable: true,
            sortField: "name",
        },
        {
            name: getFormattedMessage("globally.input.country.label"),
            selector: (row) => row.country,
            sortable: false,
            sortField: "country",
        },

        // {
        //     name: getFormattedMessage('region.modal.input.status.label'),
        //     selector: row => row.status,
        //     sortField: 'status',
        //     sortable: false,
        //     cell: row => {
        //         return <span className='badge bg-light-info'>
        //                     <span>{row.status}</span>
        //                 </span>
        //     }
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
            cell: (row) => {
                return (
                    <ActionButton
                        item={row}
                        goToEditProduct={handleClose}
                        isEditMode={
                            config && config.includes(Permissions.EDIT_REGION)
                                ? true
                                : false
                        }
                        isDeleteMode={
                            config && config.includes(Permissions.DELETE_REGION)
                                ? true
                                : false
                        }
                        onClickDeleteModel={onClickDeleteModel}
                    />
                );
            },
        },
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText("region.title")} />
            <ReactDataTable
                columns={columns}
                items={itemsValue}
                onChange={onChange}
                isLoading={isLoading}
                totalRows={totalRecord}
                AddButton={
                    config && config.includes(Permissions.CREATE_REGION) ? (
                        <CreateRegion />
                    ) : (
                        ""
                    )
                }
            />
            <EditRegion
                handleClose={handleClose}
                show={toggle}
                region={region}
            />
            <DeleteRegion
                onClickDeleteModel={onClickDeleteModel}
                deleteModel={deleteModel}
                onDelete={isDelete}
            />
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const { regions, totalRecord, isLoading, allConfigData } = state;
    return { regions, totalRecord, isLoading, allConfigData };
};

export default connect(mapStateToProps, { fetchRegions })(Region);
