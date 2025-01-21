import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import MasterLayout from "../../MasterLayout";
import { useNavigate,Link  } from "react-router-dom";
import ReactDataTable from "../../../shared/table/ReactDataTable";
import TabTitle from "../../../shared/tab-title/TabTitle";
import ReactSelect from "../../../shared/select/reactSelect";
import moment from "moment";
import {    
    getFormattedMessage,
    placeholderText,getAvatarName,
} from "../../../shared/sharedMethod";
import ActionButton from "../../../shared/action-buttons/ActionButton";
import TopProgressBar from "../../../shared/components/loaders/TopProgressBar";
import {fetchAllSubmitedGiftsHistory}  from "../../../store/action/giftAction";
import { giftExcelAction } from "../../../store/action/salesReturnExcelAction";
import { fetchAllWarehouses } from "../../../store/action/warehouseAction";
const GiftReport = (props) => {
    const {
        expenses,
        totalRecord,
        isLoading,
        frontSetting,
        allConfigData,
        giftExcelAction,
        giftHistory,
        fetchAllSubmitedGiftsHistory,
        warehouses,
        fetchAllWarehouses,
        dates

    } = props;
    const [deleteModel, setDeleteModel] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    const navigate = useNavigate();
    const [isWarehouseValue, setIsWarehouseValue] = useState(false);
    const [warehouseValue, setWarehouseValue] = useState({label: 'All', value: null});
            const array = warehouses && warehouses
            const newFirstElement = {attributes: {name: getFormattedMessage("report-all.warehouse.label")}, id: null}
            const newArray = [newFirstElement].concat(array)
        useEffect(() => {
            if (isWarehouseValue === true) {
                giftExcelAction(dates,warehouseValue, setIsWarehouseValue);
            }
        }, [isWarehouseValue]);

    useEffect(() => {
        fetchAllWarehouses();
        fetchAllSubmitedGiftsHistory();
    }, []);
    
    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };

    const onChange = (filter) => {
        fetchAllSubmitedGiftsHistory(filter,true);
    };

        const onDetailsClick = (item) => {
            navigate(`/app/gift-history-details/${item}`);
        };

          const itemsValue = giftHistory && giftHistory.length >= 0 && giftHistory.map(item => (
            {
            image: item?.image,
            gitf_details: item?.gitf_details,
            quantity: item?.total_quantity,
            outlets: item?.outlets,
            salesman: item?.salesman_details,
            uploaded_date:item?.uploaded_date,
            time: moment(item?.uploaded_date).format("LT"),
            date: moment(item?.uploaded_date).format("DD-MM-YYYY"),
            id: item?.id,
            unique_id: item?.unique_id
        })); 
        
        

        const columns = [
            // {
            //     name: getFormattedMessage('globally.input.image.label'),
            //     selector: row => row.image,
            //     sortable: false,
            //     sortField: 'image',
            //     cell: row => {
            //         const imageUrl = row.image ? row.image : null;
            //         return <div className='d-flex align-items-center'>
            //             <div className='me-2'>
            //                 {/* <Link to={`/app/distributors/detail/${row.id}`}> */}
            //                     {imageUrl ?
            //                         <img src={imageUrl} height='50' width='50' alt='User Image'
            //                              className='image image-circle image-mini'/> :
            //                         <span className='custom-user-avatar fs-5'>
            //                                 {getAvatarName(row.sales_man_id + ' ' + row.sales_man_id)}
            //                         </span>
            //                     }
            //                 {/* </Link> */}
            //             </div>                       
            //         </div>
            //     }
            // },
            {
                name: getFormattedMessage('globally.input.uploaded.label'),
                sortField: 'Date',
                sortable: false,
                cell: (row) => {
                    return (
                        <span className="badge bg-light-primary">
                            <div className="mb-1">{row.time}</div>
                            <div>{row.date}</div>
                        </span>
                    );
                },              
            },        
            {
                name:"Gift Issue ID",
                sortable: false,
                sortField: 'unique_id',
                cell: (row) => {
                    return (
                        <span className="badge bg-light-danger">
                            <span>{row?.unique_id}</span>
                        </span>
                    );
                },
            },
            {
                name: getFormattedMessage('globally.input.quantity.label'),
                selector: row => row.quantity,
                sortField: 'quantity',
                sortable: false              
            },
            {
                name:"Salesman" ,
                selector: row => row.salesman?.first_name+' '+row.salesman?.last_name,
                sortable: false,
                sortField: 'salesman',
            },
          
            {
                name: getFormattedMessage('globally.input.outlet.label'),
                selector: row => row.outlets?.name,
                sortField: 'outlet',
                sortable: false              
            },
                      
//             {
//                 name: getFormattedMessage('react-data-table.action.column.label'),
//                 right: true,
//                 ignoreRowClick: true,
//                 allowOverflow: true,
//                 button: true,
//                 cell: (row) => (
//                     <ActionButton
//                     isViewIcon={true}
//                     goToDetailScreen={onDetailsClick}
//                     item={row}
//                     isEditMode={false}
//                     isDeleteMode={false}
//                 />
// //                     <button   className="btn btn-primary"  onClick={() => onDetailsClick(row)}
// // >                           Details
// //                         </button>
//                 ),
              
//             }
        ];
        
        const onWarehouseChange = (obj) => {
            setWarehouseValue(obj);
        };

        const onExcelClick = () => {
            setIsWarehouseValue(true);
        };
    
        return (
            <MasterLayout>
                <TopProgressBar />
                <TabTitle title={placeholderText('region.title')}/>
                <div className='mx-auto mb-md-5 col-12 col-md-4'>
                {newArray &&
                    <ReactSelect data={newArray} onChange={onWarehouseChange} defaultValue={newArray[0] ? {
                        label: newArray[0].attributes.name,
                        value: newArray[0].id
                    } : ''}
                                 title={getFormattedMessage('warehouse.title')} errors={''} isRequired
                                 placeholder={placeholderText('purchase.select.warehouse.placeholder.label')}/>}
                </div>
                <div className='pt-md-7'>
                <ReactDataTable 
                columns={columns} 
                items={itemsValue}
                onChange={onChange} 
                isLoading={isLoading}
                isShowDateRangeField
                isEXCEL
                isShowSearch
                warehouseValue={warehouseValue}
                // isShowFilterField
                onExcelClick={onExcelClick}
                totalRows={totalRecord} />
               </div> 
            </MasterLayout>
        )};

const mapStateToProps = (state) => {
    const {giftHistory, expenses, totalRecord, dates,isLoading,warehouses } =
        state;
    return {giftHistory, expenses, totalRecord,dates, isLoading,warehouses};
};

export default connect(mapStateToProps, {fetchAllSubmitedGiftsHistory,fetchAllWarehouses,giftExcelAction})(GiftReport);
