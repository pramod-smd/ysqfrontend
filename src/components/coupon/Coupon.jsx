import React, { useState,useEffect } from "react";
import { connect,useDispatch,useSelector } from "react-redux";
import MasterLayout from "../MasterLayout";
import ReactDataTable from "../../shared/table/ReactDataTable";
import ModalAction from "../../shared/action-buttons/ActionButton";
import { fetchCoupons} from "../../store/action/couponAction";
import TabTitle from "../../shared/tab-title/TabTitle";
import {
    getFormattedDate,
    getFormattedMessage,
    placeholderText,
} from "../../shared/sharedMethod";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import DeleteCoupon from "./DeleteCoupon";
import { Permissions } from "../../constants";
import { fetchConfig } from "../../store/action/configAction";
const Coupon = (props) => {
    const {coupons,fetchCoupons, totalRecord, isLoading, allConfigData } = props;
    const dispatch = useDispatch();
    const {config} = useSelector(
        (state) => state
    );
    const [deleteModel, setDeleteModel] = useState(false);
    const [isDelete, setIsDelete] = useState(null);

    useEffect(()=>{
        dispatch(fetchConfig());
      },[]);
    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };
    const itemsValue =
        coupons.length >= 0 &&
        coupons.map((coupon) => ({
            date: getFormattedDate(
                coupon.attributes.created_at,
                allConfigData && allConfigData
            ),
            name: coupon.attributes.name,
            code: coupon.attributes.code,
            status:coupon.attributes?.status,
            start_date: getFormattedDate(
                coupon.attributes.start_date,
                allConfigData && allConfigData
            ),
            end_date: getFormattedDate(
                coupon.attributes.end_date,
                allConfigData && allConfigData
            ),
            id: coupon.id,
        }));

    const onChange = (filter) => {
        fetchCoupons(filter, true);
    };

    const goToEdit = (item) => {
        const id = item.id;
        window.location.href = "#/app/coupons/edit/" + id;
    };

    const columns = [
        {
            name: getFormattedMessage("globally.input.name.label"),
            selector: (row) => row.name,
            sortField: "name",
            sortable: true,

        },
        {
            name: "code",
            selector: (row) => row.code,
            sortField: "code",
            sortable: true,

        },
        {
            name: "start date",
            selector: (row) => row.start_date,
            sortable: true,
            sortField: "start_date",
        },
        {
            name: "end date",
            selector: (row) => row.end_date,
            sortable: true,
            sortField: "end_date",
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
                        backgroundColor: row.status === "Active" ? "#4CAF50" : "#F44336",
                        borderRadius: "0.25rem",
                        textAlign: "center",
                    }}
                >
                    {row.status}
                </span>
            ),
            sortable: false,
        },
        // {
        //     name: getFormattedMessage("react-data-table.date.column.label"),
        //     selector: (row) => row.date,
        //     sortField: "date",
        //     sortable: false,
        // },
        {
            name: getFormattedMessage("react-data-table.action.column.label"),
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            cell: (row) => (
                <ModalAction
                    item={row}
                    goToEditProduct={goToEdit}
                    onClickDeleteModel={onClickDeleteModel}
                    isEditMode={config && config.includes(Permissions.EDIT_COUPON)?true:false}
                    isDeleteMode={config && config.includes(Permissions.DELETE_COUPON)?true:false}
                />
            ),
        },
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title="Coupons" />
            <ReactDataTable
                columns={columns}
                items={itemsValue}
                onChange={onChange}
                ButtonValue={config && config.includes(Permissions.CREATE_COUPON)?"Add Coupons":""}
                to="#/app/coupons/create"
                totalRows={totalRecord}
                isLoading={isLoading}
            />
            <DeleteCoupon
                onClickDeleteModel={onClickDeleteModel}
                deleteModel={deleteModel}
                onDelete={isDelete}
            />
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const {coupons, totalRecord, isLoading, allConfigData } = state;
    return {coupons, totalRecord, isLoading, allConfigData };
};
export default connect(mapStateToProps, {fetchCoupons})(Coupon);
