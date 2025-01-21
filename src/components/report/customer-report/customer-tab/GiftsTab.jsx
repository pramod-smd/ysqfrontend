import React, { useCallback,useEffect } from "react";
import moment from "moment";
import { connect } from "react-redux";
import ReactDataTable from "../../../../shared/table/ReactDataTable";
import {
    currencySymbolHandling,
    getFormattedDate,
    getFormattedMessage,
} from "../../../../shared/sharedMethod";
import { fetchFrontSetting } from "../../../../store/action/frontSettingAction";
import { customerGiftReportExcel } from "../../../../store/action/customerReportAction";
import { fetchAllSubmitedGiftsHistory } from "../../../../store/action/giftAction";
const GiftsTab = (props) => {
    const {
        totalRecord,
        isLoading,
        fetchFrontSetting,
        frontSetting,
        isCallSaleApi,
        allConfigData,
        customerId,
        giftHistory,
        fetchAllSubmitedGiftsHistory,
        customerGiftReportExcel,
    } = props;

    useEffect(() => {
        fetchFrontSetting();
    }, []);

    const currencySymbol =
        frontSetting &&
        frontSetting.value &&
        frontSetting.value.currency_symbol;

    // fetch all sale
    const onChange = (filter) => {
        fetchAllSubmitedGiftsHistory(filter,true)
    };

    // onClick pdf function
    const onReportPdfClick = (id) => {
        // customerSaleReportPDF(id);
    };

    const onExcelClick = useCallback((customer_id) => {
        console.log("customer_id",customer_id);
        
        customerGiftReportExcel(customer_id);
    },[]);

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
   
           ];

    return (
        <ReactDataTable
            columns={columns}
            items={itemsValue}
            onChange={onChange}
            totalRows={totalRecord}
            isLoading={isLoading}
            isEXCEL
            onExcelClick={()=>onExcelClick(customerId)}
            customerId={customerId}
        />
    );
};

const mapStateToProps = (state) => {
    const {
        giftHistory,
        totalRecord,
        isLoading,
        frontSetting,
        allConfigData,
    } = state;
    return {
        giftHistory,
        totalRecord,
        isLoading,
        frontSetting,
        allConfigData,
    };
};

export default connect(mapStateToProps, {
    fetchFrontSetting,
    fetchAllSubmitedGiftsHistory,
    customerGiftReportExcel,
})(GiftsTab);
