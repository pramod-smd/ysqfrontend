import React, { useEffect, useState } from "react";
import { connect,useDispatch,useSelector } from "react-redux";
import moment from "moment";
import MasterLayout from "../MasterLayout";
import { useNavigate, Link } from "react-router-dom";
import ReactDataTable from "../../shared/table/ReactDataTable";
import TabTitle from "../../shared/tab-title/TabTitle";
import {
    currencySymbolHandling,
    getFormattedDate,
    getFormattedMessage,
    placeholderText,
    getAvatarName,
} from "../../shared/sharedMethod";
import ActionButton from "../../shared/action-buttons/ActionButton";
import { fetchFrontSetting } from "../../store/action/frontSettingAction";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import { allGift } from "../../store/action/giftAction";
import { deleteGift } from "../../store/action/giftAction";
import DeleteGift from "./DeleteGift";
import { Permissions } from "../../constants";
import { fetchConfig } from "../../store/action/configAction";
const Gifts = (props) => {
    const {
        totalRecord,
        isLoading,
        frontSetting,
        fetchFrontSetting,
        allConfigData,
        allGift,
        gifts,
    } = props;
    const dispatch = useDispatch();
    const {config} = useSelector(
        (state) => state
    );
    const [deleteModel, setDeleteModel] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchConfig());
        fetchFrontSetting();
        allGift();
    }, []);


    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };

    const onChange = (filter) => {
        allGift(filter, true);
    };

    const goToEditProduct = (item) => {
        const id = item.id;
        window.location.href = "#/app/gifts/edit/" + id;
    };

    const goToDetailScreen = (item) => {
        const id = item;

        if (id) {
            window.location.href = "#/app/gifts/detail/" + item;
        } else {
            console.error("ID is undefined for item:", item);
        }
    };

    const itemsValue =
        gifts.length >= 0 &&
        gifts.map((item) => ({
            image: item?.image,
            title: item?.title,
            quantity: item?.quantity,
            created_at: getFormattedDate(
                item?.created_at,
                allConfigData && allConfigData
            ),
            id: item?.id,
            status: item?.status === 1 ? "Active" : "Inactive"
        }));

    const columns = [
        {
            name: getFormattedMessage("globally.input.image.label"),
            selector: (row) => row.image,
            sortable: false,
            sortField: "image",
            cell: (row) => {
                const imageUrl = row.image ? row.image : null;
                return (
                    <div className="d-flex align-items-center">
                        <div className="me-2">
                            {/* <Link to={`/app/distributors/detail/${row.id}`}> */}
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
                                        row.sales_man_id +
                                            " " +
                                            row.sales_man_id
                                    )}
                                </span>
                            )}
                            {/* </Link> */}
                        </div>
                    </div>
                );
            },
        },
        {
            name: getFormattedMessage("globally.input.gitf_name.label"),
            selector: (row) => row?.title,
            sortable: true,
            sortField: "title",
        },
        {
            name: getFormattedMessage("globally.input.quantity.label"),
            selector: (row) => row.quantity,
            sortField: "quantity",
            sortable: false,
        },
        {
            name: getFormattedMessage("globally.input.uploaded.label"),
            selector: (row) => row?.created_at,
            sortField: "created_at",
            sortable: true,
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



        {
            name: getFormattedMessage('react-data-table.action.column.label'),
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: "120px",
            cell: (row) => (
                <ActionButton
                    isViewIcon={true}
                    goToDetailScreen={goToDetailScreen}
                    item={row}
                    goToEditProduct={goToEditProduct}
                    onClickDeleteModel={onClickDeleteModel}
                    isEditMode={config && config.includes(Permissions.EDIT_AREA)?true:false}
                    isDeleteMode={config && config.includes(Permissions.DELETE_AREA)?true:false}
                />
            ),

        }
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title="Gifts" />
            {
              config && config.includes(Permissions.CREATE_GIFT)?
                <div className="d-flex justify-content-end">
                    <button
                        className="btn"
                        onClick={() => window.location.href = "#/app/gifts-add"}
                        style={{ backgroundColor: "#ff5722", color:"white" }}
                    >
                        Add Gift
                    </button>
                </div>:""
            }
            <ReactDataTable
                columns={columns}
                items={itemsValue}
                onChange={onChange}
                isLoading={isLoading}
                totalRows={totalRecord}


            />
            <DeleteGift
                onClickDeleteModel={onClickDeleteModel}
                deleteModel={deleteModel}
                onDelete={isDelete}
            />
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const {
        gifts,
        allGift,
        totalRecord,
        isLoading,
        frontSetting,
        allConfigData,
        deleteGift
    } = state;
    return {
        gifts,
        allGift,
        totalRecord,
        isLoading,
        frontSetting,
        allConfigData,
    };
};

export default connect(mapStateToProps, { allGift, fetchFrontSetting })(Gifts);
