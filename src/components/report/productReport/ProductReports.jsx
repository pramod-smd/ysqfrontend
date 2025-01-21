import React, { useEffect, useState } from "react";
import { connect,useDispatch,useSelector } from "react-redux";
import moment from "moment";
import { Button, Image } from "react-bootstrap-v5";
import MasterLayout from "../../MasterLayout";
import { useNavigate,Link  } from "react-router-dom";
import { fetchAllMainProducts } from "../../../store/action/productAction";
import ReactDataTable from "../../../shared/table/ReactDataTable";
import TabTitle from "../../../shared/tab-title/TabTitle";
import user from "../../../assets/images/brand_logo.png";
import {
    getFormattedDate,
    getFormattedMessage,
    placeholderText,
    currencySymbolHandling,
} from "../../../shared/sharedMethod";
import ActionButton from "../../../shared/action-buttons/ActionButton";
import { fetchFrontSetting } from "../../../store/action/frontSettingAction";
import TopProgressBar from "../../../shared/components/loaders/TopProgressBar";
import { productExcelAction } from "../../../store/action/productExcelAction";
import { Permissions } from "../../../constants";
import { fetchConfig } from "../../../store/action/configAction";
import ProductImageLightBox from "../../product/ProductImageLightBox";
const ProductReports = (props) => {
    const {
        fetchAllMainProducts,
        products,
        totalRecord,
        isLoading,
        frontSetting,
        fetchFrontSetting,
        productExcelAction,
        productUnitId,
        allConfigData,
    } = props;
    const dispatch = useDispatch();
    const {config} = useSelector(
        (state) => state
    );
    const [deleteModel, setDeleteModel] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [lightBoxImage, setLightBoxImage] = useState([]);

    // const [importProduct, setimportProduct] = useState(false);
    // const handleClose = () => {
    //     setimportProduct(!importProduct);
    // };

    const [isWarehouseValue, setIsWarehouseValue] = useState(false);
    useEffect(() => {
        if (isWarehouseValue === true) {
            productExcelAction(setIsWarehouseValue, true, productUnitId);
        }
    }, [isWarehouseValue]);

    const onExcelClick = () => {
        setIsWarehouseValue(true);
    };

    useEffect(() => {
        dispatch(fetchConfig());
        fetchFrontSetting();
    }, []);

    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };

    const onChange = (filter) => {
        fetchAllMainProducts(filter, true);
    };

    const goToEditProduct = (item) => {
        const id = item.id;
        window.location.href = "#/app/products/edit/" + id;
    };

    const goToProductDetailPage = (ProductId) => {
        window.location.href = "#/app/products/detail/" + ProductId;
    };

    const currencySymbol =
        frontSetting &&
        frontSetting.value &&
        frontSetting.value.currency_symbol;

    const formattedPrice = (product_price) => {
        return currencySymbolHandling(
            allConfigData,
            currencySymbol,
            product_price
        );
    };

    const onReportsClick = (item) => {
        const id = item.id;
        window.location.href = "#/app/report/report-detail-product/" + id;
    };

    const itemsValue =
        currencySymbol &&
        products.length >= 0 &&
        products.map((product) => {
            let product_price =
                product.attributes.min_price == product.attributes.max_price
                    ? formattedPrice(product.attributes.min_price)
                    : formattedPrice(product.attributes.min_price) +
                      " - " +
                      formattedPrice(product.attributes.max_price);
            return {
                name: product?.attributes.name,
                status: product?.attributes?.status === 1 ? "Active" : "Inactive",
                code: product?.attributes.code,
                date: getFormattedDate(
                    product?.attributes.created_at,
                    allConfigData && allConfigData
                ),
                time: moment(product?.attributes.created_at).format("LT"),
                brand_name:
                    product?.attributes.products &&
                    product?.attributes.products[0]?.brand_name
                        ? product?.attributes.products[0]?.brand_name
                        : "",
                product_price: product_price,
                product_unit: product?.attributes.product_unit?.name,
                //     ? product?.attributes.product_unit?.name
                //     : "N/A",
                in_stock:product.attributes?.products[0]?.quantity,
                // in_stock: product.attributes.products?.reduce(
                //     (sum, product) =>
                //         sum + product?.stock?.quantity
                //             ? product.stock.quantity
                //             : 0,
                //     0
                // ),
                images: product?.attributes.images,
                id: product.id,
                currency: currencySymbol,
            };
        });

    const columns = [
        {
            name: getFormattedMessage("product.title"),
            sortField: "name",
            sortable: false,
            cell: (row) => {
                const imageUrl = row.images
                    ? row.images.imageUrls && row.images.imageUrls[0]
                    : null;
                return imageUrl ? (
                    <div className="d-flex align-items-center">
                        <Button
                            type="button"
                            className="btn-transparent me-2 d-flex align-items-center justify-content-center"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen(!isOpen);
                                setLightBoxImage(row.images.imageUrls);
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
            className: "product-name",
            sortField: "name",
            sortable: true,
        },
        {
            name: getFormattedMessage("product.input.code.label"),
            selector: (row) => (
                <span className="badge bg-light-danger">
                    <span>{row.code}</span>
                </span>
            ),
            sortField: "code",
            sortable: true,
        },
        {
            name: getFormattedMessage("product.input.brand.label"),
            selector: (row) => row.brand_name,
            sortField: "brand_name",
            sortable: false,
        },
        {
            name: getFormattedMessage("product.table.price.column.label"),

            selector: (row) => row.product_price,
        },
        {
            name: getFormattedMessage("product.product-in-stock.label"),
            cell: row => {
                return <div>
                <div className='badge bg-light-info me-2'><span>{row.in_stock}</span>&nbsp;<span>{row.product_unit}</span></div>

            </div>
            },            
            sortField: "in_stock",
            sortable: false,
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
            sortable: false,
        },
        {
                    name: getFormattedMessage("react-data-table.action.column.label"),
                    right: true,
                    ignoreRowClick: true,
                    allowOverflow: true,
                    button: true,
                    width: "115px",
                    cell: (row) => (
                        <button
                            className="btn btn-sm btn-primary"
                            variant="primary"
                            onClick={() => onReportsClick(row)}
                        >
                            {getFormattedMessage("reports.title")}
                        </button>
                    ),
        }     
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText("products.title")} />
            <ReactDataTable
                columns={columns}
                items={itemsValue}
                onChange={onChange}
                isLoading={isLoading}
                totalRows={totalRecord}
                isShowFilterField
                isUnitFilter
                title={getFormattedMessage("product.input.product-unit.label")}
                isExportDropdown={false}
                onExcelClick={onExcelClick}
            />          
            {isOpen && lightBoxImage.length !== 0 && (
                <ProductImageLightBox
                    setIsOpen={setIsOpen}
                    isOpen={isOpen}
                    lightBoxImage={lightBoxImage}
                />
            )}          
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const {
        products,
        totalRecord,
        isLoading,
        frontSetting,
        productUnitId,
        allConfigData,
    } = state;
    return {
        products,
        totalRecord,
        isLoading,
        frontSetting,
        productUnitId,
        allConfigData,
    };
};

export default connect(mapStateToProps, {
    fetchAllMainProducts,
    fetchFrontSetting,
    productExcelAction,
})(ProductReports);
