import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button, Image, Table } from "react-bootstrap-v5";
import { useParams } from "react-router-dom";
import Carousel from "react-elastic-carousel";
import MasterLayout from "../MasterLayout";
import TabTitle from "../../shared/tab-title/TabTitle";
import { fetchMainProduct } from "../../store/action/productAction";
import HeaderTitle from "../header/HeaderTitle";
import user from "../../assets/images/brand_logo.png";
import {
    getFormattedMessage,
    placeholderText,
    currencySymbolHandling,
} from "../../shared/sharedMethod";
import Spinner from "../../shared/components/loaders/Spinner";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import WareHouseDetailsModal from "./WareHouseDetailsModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import EditSubProductModal from "./EditSubProductModal";
import DeleteProduct from "./DeleteProduct";
import CreateSubProductModal from "./CreateSubProductModal";

const ProductDetail = (props) => {
    const {
        products,
        fetchMainProduct,
        isLoading,
        frontSetting,
        allConfigData,
    } = props;
    const { id } = useParams();
    const result =
        products &&
        products.reduce((obj, cur) => ({ ...obj, [cur.type]: cur }), {});
    const product = result.products;

    const [showWarehouseModal, setShowWarehouseModal] = useState(false);
    const [showEditSubProductModal, setShowEditSubProductModal] =
        useState(false);
    const [showCreateSubProductModal, setShowCreateSubProductModal] =
        useState(false);
    const [productData, setProductData] = useState({});
    const [deleteModel, setDeleteModel] = useState(false);
    const [isDelete, setIsDelete] = useState(null);

    useEffect(() => {
        fetchMainProduct(id);
    }, []);


    const sliderImage =
        product &&
        product.attributes &&
        product.attributes.images.imageUrls &&
        product.attributes.images.imageUrls.map((img) => img);
    const allProducts =
        product &&
        product.attributes &&
        product.attributes.products &&
        product.attributes.products.map((item) => item);

    const commonDataForNewProduct = {
        name: allProducts && allProducts[0]?.name,
        status: allProducts && allProducts[0]?.status,
        product_code: allProducts && allProducts[0]?.product_code,
        product_type: allProducts && product.attributes.product_type,
        // barcode_symbol: allProducts && allProducts[0].barcode_symbol,
        product_category_id: allProducts && allProducts[0]?.product_category_id,
        brand_id: allProducts && allProducts[0]?.brand_id,
        product_unit: allProducts && allProducts[0]?.product_unit,
        // sale_unit: allProducts && allProducts[0]?.sale_unit,
        purchase_unit: allProducts && allProducts[0]?.purchase_unit,
        quantity_limit: allProducts && allProducts[0]?.quantity_limit,
        notes: allProducts && allProducts[0]?.notes,
        main_product_id: product && product.id,
        variation: product && product?.attributes?.variation,
        variationTypes:
            product &&
            product?.attributes?.variation?.variation_types.filter(
                (variationType) =>
                    !product?.attributes?.variation_types.some(
                        (productVariationType) =>
                            variationType.id === productVariationType.id &&
                            variationType.name === productVariationType.name
                    )
            ),
    };

    const openWareHouseDetailModal = (data) => {
        setShowWarehouseModal(true);
        setProductData(data);
    };

    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };

    const openEditSubProductModal = (data) => {
        setProductData(data);
        setShowEditSubProductModal(true);
    };

    const openCreateSubProductModal = () => {
        setProductData(commonDataForNewProduct);
        setShowCreateSubProductModal(true);
    };

    return (
        <MasterLayout>
            <TopProgressBar />
            <HeaderTitle
                title={getFormattedMessage("product.product-details.title")}
                to="/app/products"
            />
            <TabTitle
                title={placeholderText("product.product-details.title")}
            />
            <div className="card card-body">
                {/* section for englist */}
                <div className="product-section">
                    <div className="row">
                        <div className="col-md-6">
                            <strong>
                                
                                    Product Name in English
                            </strong>
                            <p>{allProducts && allProducts[0]?.name}</p>
                        </div>
                        <div className="col-md-6">
                            <strong>
                               
                                    Product Description in English
                              
                            </strong>
                            <p>
                                {allProducts && allProducts[0]?.notes}
                            </p>
                        </div>
                    </div>
                </div>
                <hr />
                {/* New Section for Chinese */}
                <div className="product-section">
                    <div className="row">
                        <div className="col-md-6">
                            <strong>Prdouct Name in china:</strong>
                            <p>{allProducts && allProducts[0]?.cn_name}</p>
                        </div>
                        <div className="col-md-6">
                            <strong>
                              
                                    Product Description in china
                            
                            </strong>
                            <p>
                                {allProducts && allProducts[0]?.cn_description}
                            </p>
                        </div>
                    </div>
                </div>
                <hr />

                {/* New Section for Indonesian */}
                <div className="product-section">
                    <div className="row">
                        <div className="col-md-6">
                            <strong>
                                    Product Name in Indonesia
                            </strong>
                            <p>{allProducts && allProducts[0]?.bn_name}</p>
                        </div>
                        <div className="col-md-6">
                            <strong>
                              Product Description in Indonesia
                              </strong>
                            <p>
                                {allProducts && allProducts[0]?.bn_description}
                            </p>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="row">
                    {isLoading ? (
                        <Spinner />
                    ) : (
                        <>
                            <div className="col-xxl-7">
                                <table className="table table-responsive gy-7 main-product-details">
                                    <tbody>
                                        <tr>
                                            <th className="py-4" scope="row">
                                                {getFormattedMessage(
                                                    "product.product-details.code-product.label"
                                                )}
                                            </th>
                                            <td className="py-4">
                                                {product &&
                                                    product.attributes &&
                                                    product.attributes.code}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="py-4" scope="row">
                                                {getFormattedMessage(
                                                    "product.title"
                                                )}
                                            </th>
                                            <td className="py-4">
                                                {product &&
                                                    product.attributes &&
                                                    product.attributes.name}
                                            </td>
                                        </tr>
                                        {/* <tr>
                                            <th className="py-4" scope="row">
                                                {getFormattedMessage(
                                                    "product.type.label"
                                                )}
                                            </th>
                                            <td className="py-4">
                                                {product &&
                                                    product.attributes &&
                                                    product.attributes.product_type == 1 ? getFormattedMessage('products.type.single-type.label') : getFormattedMessage('variation.title')}
                                            </td>
                                        </tr> */}
                                        <tr>
                                            <th>
                                                {getFormattedMessage(
                                                    "product.product-details.category.label"
                                                )}
                                            </th>
                                            <td className="py-4">
                                                {allProducts &&
                                                    allProducts[0]
                                                        ?.product_category_name}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                {getFormattedMessage(
                                                    "product.input.brand.label"
                                                )}
                                            </th>
                                            <td className="py-4">
                                                {allProducts &&
                                                    allProducts[0]?.brand_name}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Product Type</th>
                                            <td className="py-4">
                                                {allProducts &&
                                                    allProducts[0]
                                                        ?.product_unit_name && (
                                                        <span className="badge bg-light-success">
                                                            <span>
                                                                {allProducts &&
                                                                    allProducts[0]
                                                                        ?.product_unit_name
                                                                        ?.name}
                                                            </span>
                                                        </span>
                                                    )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Price</th>
                                            <td className="py-4">
                                                {currencySymbolHandling(
                                                    allConfigData,
                                                    frontSetting?.value &&
                                                        frontSetting?.value
                                                            ?.currency_symbol,
                                                    allProducts &&
                                                        allProducts[0]
                                                            ?.product_price
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Product Quantity</th>
                                            <td className="py-4">
                                                {allProducts &&
                                                    allProducts[0]?.quantity}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Stock Alert</th>
                                            <td className="py-4">
                                                {allProducts &&
                                                    allProducts[0]?.stock_alert}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Status</th>
                                            <td className="py-4">
                                                {allProducts &&
                                                    allProducts[0]?.status==1?"Active":"Inactive"}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-xxl-5 d-flex justify-content-center m-auto">
                                {sliderImage && sliderImage.length !== 0 ? (
                                    <Carousel>
                                        {sliderImage.length !== 0 &&
                                            sliderImage.map((img, i) => {
                                                return (
                                                    <div key={i}>
                                                        <Image
                                                            src={img}
                                                            width="413px"
                                                        />
                                                    </div>
                                                );
                                            })}
                                    </Carousel>
                                ) : (
                                    <div>
                                        <Image src={user} width="413px" />
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const { products, isLoading, frontSetting, allConfigData } = state;
    return { products, isLoading, frontSetting, allConfigData };
};

export default connect(mapStateToProps, { fetchMainProduct })(ProductDetail);
