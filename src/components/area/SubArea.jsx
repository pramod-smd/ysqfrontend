import React, { useState, useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import MasterLayout from "../MasterLayout";
import ReactDataTable from "../../shared/table/ReactDataTable";
import TabTitle from "../../shared/tab-title/TabTitle";
import {
    getFormattedDate,
    getFormattedMessage,
    placeholderText,
} from "../../shared/sharedMethod";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import { Permissions } from "../../constants";
import { fetchConfig } from "../../store/action/configAction";
// import { fetchSubAreas } from "../../store/action/areaAction";
import { fetchSubAreas } from "../../store/action/subAreaAction";
import ModalAction from "../../shared/action-buttons/ActionButton";

const SubArea = (props) => {
    const { totalRecord, isLoading, subAreas, fetchSubAreas } = props;

    const dispatch = useDispatch();

    const { config } = useSelector((state) => state);

    useEffect(() => {
        dispatch(fetchConfig());
        fetchSubAreas();
    }, [fetchSubAreas]);

    const itemsValue =
        subAreas.length >= 0 &&
        subAreas.map((subArea) => ({
            sub_area_name: subArea?.sub_area_name,
            area: subArea?.area?.name,
            region: subArea?.area?.region?.name,
            country: subArea?.area?.region?.country?.name,
            status: subArea?.status === 1 ? "Active" : "Inactive",
            id: subArea?.id,
        }));

    const goToEditProduct = (item) => {
        const id = item.id;
        window.location.href = "#/app/sub-area-edit/" + id;
    };

    const onChange = (filter) => {
        fetchSubAreas(filter, true);
    };

    const columns = [
        {
            name: "Sub Area",
            selector: (row) => row.sub_area_name,
            sortable: true,
            sortField: "sub_area_name",
        },
        {
            name: "Area",
            selector: (row) => row.area,
            sortable: false,
            sortField: "area",
        },
        {
            name: "Region",
            selector: (row) => row.region,
            sortable: false,
            sortField: "region",
        },
        {
            name: "Country",
            selector: (row) => row.country,
            sortable: false,
            sortField: "country",
        },
        // {
        //     name: "Status",
        //     selector: (row) => row.status,
        //     sortable: false,
        //     sortField: "status",
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
                <ModalAction
                    item={row}
                    goToEditProduct={goToEditProduct}
                    isEditMode={
                        config && config.includes(Permissions.EDIT_SUB_AREA)
                            ? true
                            : false
                    }
                    isDeleteMode={
                        config && config.includes(Permissions.DELETE_SUB_AREA)
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
            <TabTitle title="Sub Areas" />
            <ReactDataTable
                columns={columns}
                items={itemsValue}
                onChange={onChange}
                ButtonValue={
                    config && config.includes(Permissions.CREATE_SUB_AREA)
                        ? "Add SubArea"
                        : ""
                }
                to="#/app/sub-area-add"
                isLoading={isLoading}
                totalRows={totalRecord}
            />
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const { subAreas, totalRecord, isLoading } = state;
    return {
        subAreas,
        totalRecord,
        isLoading,
    };
};

export default connect(mapStateToProps, { fetchSubAreas })(SubArea);
