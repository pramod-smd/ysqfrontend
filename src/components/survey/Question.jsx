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
import {QuestionList} from "../../store/action/surveyAction";
import DeleteQuestion from "./DeleteQuestion";
import { Permissions } from "../../constants";
import { fetchConfig } from "../../store/action/configAction";

const Question = (props) => {
    const {
        totalRecord,
        isLoading,
        frontSetting,
        fetchFrontSetting,
        allConfigData,
        surveys,
        QuestionList
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
        QuestionList();
    }, []);

    // console.log("surveys:", surveys );

    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };

    const goToEditProduct = (item) => {
        const id = item.id;
        window.location.href = "#/app/question-edit/" + id;
    };


    const goToDetailScreen = (item) => {
        const id = item;
        if(id) {
            window.location.href = "#/app/question-details/" + item;
        } else {
            console.error("ID is undefined for item:", item);
        }
    };

    const onChange = (filter) => {
        QuestionList(filter,true);
    };
    const itemsValue =
    surveys.length >= 0 &&
    surveys.map((item) => ({
            question:  item?.question,
            status: item?.status,
            type: item?.type && item?.type.replace(/_/g, ' '),
            warehouse:item?.warehouse?.name,
            created_at: getFormattedDate(
                item?.created_at,
                allConfigData && allConfigData
            ),
            id: item?.id,
        }));
    const columns = [
        {
            name: "Question",
            selector: (row) => row?.question,
            sortable: true,
            sortField: "question",
        },

        // {
        //     name: "status",
        //     selector: (row) => row.status,
        //     sortField: "status",
        //     sortable: false,
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
        {
            name: "type",
            selector: (row) => row.type,
            sortField: "type",
            sortable: true,
        },
        {
            name: "warehouse",
            selector: (row) => row.warehouse,
            sortField: "warehouse",
            sortable: false,
        },
        {
            name: "Date",
            selector: (row) => row?.created_at,
            sortField: "created_at",
            sortable: true,
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
                    isViewIcon={config && config.includes(Permissions.MANAGE_QUESTION)?true:false}
                    goToDetailScreen={goToDetailScreen}
                    item={row}
                    goToEditProduct={goToEditProduct}
                    isEditMode={config && config.includes(Permissions.EDIT_QUESTION)?true:false}
                    isDeleteMode={config && config.includes(Permissions.DELETE_QUESTION)?true:false}
                    onClickDeleteModel={() => onClickDeleteModel(row)}
                />
            ),

        }
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title="Questions" />
            <ReactDataTable
                columns={columns}
                items={itemsValue}
                onChange={onChange}
                // isShowDateRangeField
                isLoading={isLoading}
                // isShowFilterField
                totalRows={totalRecord}
                ButtonValue={config && config.includes(Permissions.CREATE_QUESTION)?"Add Question":""}
                to="#/app/question-add"
            />
            <DeleteQuestion
                onClickDeleteModel={onClickDeleteModel}
                deleteModel={deleteModel}
                onDelete={isDelete}
            />
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const { surveys, totalRecord, isLoading, frontSetting, allConfigData } =
        state;
    return { surveys, totalRecord, isLoading, frontSetting, allConfigData };
};

export default connect(mapStateToProps, {
    QuestionList,
    fetchFrontSetting,
})(Question);
