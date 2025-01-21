import React, { useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import MasterLayout from "../../MasterLayout";
import TabTitle from "../../../shared/tab-title/TabTitle";
import { Button, Image } from "react-bootstrap-v5";

import {
    currencySymbolHandling,
    getFormattedMessage,
    placeholderText,
} from "../../../shared/sharedMethod";
import ReactDataTable from "../../../shared/table/ReactDataTable";
import { connect } from "react-redux";
import ReactSelect from "../../../shared/select/reactSelect";
import { fetchAllWarehouses } from "../../../store/action/warehouseAction";
import { fetchFrontSetting } from "../../../store/action/frontSettingAction";
import {GiftInventoryReportExcel } from "../../../store/action/totalStockReportExcel";
import TopProgressBar from "../../../shared/components/loaders/TopProgressBar";
import { fetchUpdatedGiftQuantity } from "../../../store/action/languageAction";
import user from "../../../assets/images/brand_logo.png";

const GiftStock = (props) => {
    const {
        isLoading,
        totalRecord,
        fetchFrontSetting,
        fetchAllWarehouses,
        GiftInventoryReportExcel,
        frontSetting,
        warehouses,
        allConfigData,
    } = props;
    const [warehouseValue, setWarehouseValue] = useState({
        label: "All",
        value: frontSetting?.value?.default_warehouse,
    });
    const [isWarehouseValue, setIsWarehouseValue] = useState(false);
    const currencySymbol =
        frontSetting &&
        frontSetting.value &&
        frontSetting.value.currency_symbol;
    const array = warehouses && warehouses;
    const selectWarehouseArray =
        frontSetting &&
        array.filter(
            (item) => item.id === Number(frontSetting?.value?.default_warehouse)
        );
    const dispatch=useDispatch();
    const {giftInventoryReport}=useSelector((state)=>state);    

    useEffect(() => {
        dispatch(fetchUpdatedGiftQuantity(warehouseValue.value
            ? warehouseValue.value
            : frontSetting?.value?.default_warehouse));
    }, [frontSetting, warehouseValue]);
    
    
    const [isOpen, setIsOpen] = useState(false);
    const [lightBoxImage, setLightBoxImage] = useState([]);
    useEffect(() => {
        fetchAllWarehouses();
    }, []);

    useEffect(() => {
        fetchFrontSetting();
    }, []);

    useEffect(() => {
        if (isWarehouseValue === true) {
            GiftInventoryReportExcel(
                warehouseValue.value
                    ? warehouseValue.value
                    : frontSetting?.value?.default_warehouse,
                setIsWarehouseValue
            );
            setIsWarehouseValue(false);
        }
    }, [isWarehouseValue]);
    
    const onChange = (filter) => {
        dispatch(fetchUpdatedGiftQuantity(
            warehouseValue.value
                ? warehouseValue.value
                : frontSetting?.value?.default_warehouse,
            filter
        ));
    };
     
    const itemsValue =
        currencySymbol &&
        giftInventoryReport.length >= 0 &&
        giftInventoryReport.map((stockReport) => ({
            name: stockReport?.gift.title,
            image: stockReport?.gift?.image,
            warehouse_name: stockReport?.warehouse?.name,
            warehouse_quantities: stockReport?.warehouse_quantities,
            id: stockReport?.gift_id,
            currency: currencySymbol,
        }));


    const onWarehouseChange = (obj) => {
        setWarehouseValue(obj);
    };

    const onExcelClick = () => {
        setIsWarehouseValue(true);
    };

    const onReportsClick = (item) => {
        const id = item.id;
        window.location.href = "#/app/report/report-inventory-gifts-details/" + id;
    };

    const columns = [
        {
            name:"Image",
            sortField: "image",
            sortable: false,
            cell: (row) => {
                const imageUrl = row.image
                    ? row?.image && row.image
                    : null;
                return imageUrl ? (
                    <div className="d-flex align-items-center">
                        <Button
                            type="button"
                            className="btn-transparent me-2 d-flex align-items-center justify-content-center"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen(!isOpen);
                                setLightBoxImage(row?.image);
                            }}
                        >
                            <Image
                                src={imageUrl}
                                height="50"
                                width="50"
                                alt="Product Image"
                                className="image image-circle image-mini cursor-pointer"
                            />
                        </Button>
                    </div>
                ) : (
                    <div className="d-flex align-items-center">
                        <div className="me-2">
                            <Image
                                src={user}
                                height="50"
                                width="50"
                                alt="Product Image"
                                className="image image-circle image-mini"
                            />
                        </div>
                    </div>
                );
            },
        },
        {
            name: getFormattedMessage("supplier.table.name.column.title"),
            selector: (row) => row.name,
            sortField: "name",
            sortable: false,
        },     
        {
            name:"Warehouse",
            selector: (row) => row?.warehouse_name,
            sortField: "warehouse_name",
            sortable: false,
        },     
        {
            name: getFormattedMessage("current.stock.label"),
            sortField: "warehouse_quantities",
            sortable: false,
            cell: (row) => {
                return (
                    <div>
                        <div className="badge bg-light-info me-2">
                            <span>{row?.warehouse_quantities}</span>
                        </div>
{/* 
                        <span className="badge bg-light-success me-2">
                            <span>{row.product_unit}</span>
                        </span> */}
                    </div>
                );
            },
        },    
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText("stock.reports.title")} />
            <div className="mx-auto mb-md-5 col-12 col-md-4">
                {selectWarehouseArray[0] ? (
                    <ReactSelect
                        data={array}
                        onChange={onWarehouseChange}
                        defaultValue={
                            selectWarehouseArray[0]
                                ? {
                                      label: selectWarehouseArray[0].attributes
                                          .name,
                                      value: selectWarehouseArray[0].id,
                                  }
                                : ""
                        }
                        title={getFormattedMessage("warehouse.title")}
                        errors={""}
                        isRequired
                        placeholder={placeholderText(
                            "purchase.select.warehouse.placeholder.label"
                        )}
                    />
                ) : null}
            </div>
            <div className="pt-md-7">
                <ReactDataTable
                    columns={columns}
                    items={itemsValue}
                    onChange={onChange}
                    isLoading={isLoading}
                    totalRows={totalRecord}
                    isShowSearch={true}
                    isEXCEL
                    onExcelClick={onExcelClick}
                />
            </div>
        </MasterLayout>
    );
};
const mapStateToProps = (state) => {
    const {
        isLoading,
        totalRecord,
        warehouses,
        frontSetting,
        giftInventoryReport,
        allConfigData,
    } = state;
    return {
        isLoading,
        totalRecord,
        warehouses,
        frontSetting,
        giftInventoryReport,
        allConfigData,
    };
};

export default connect(mapStateToProps, {
    fetchAllWarehouses,
    GiftInventoryReportExcel,
    fetchFrontSetting,
})(GiftStock);
