import React, { useEffect, useState } from "react";
import MasterLayout from "../MasterLayout";
import { connect, useDispatch, useSelector } from "react-redux";
import TabTitle from "../../shared/tab-title/TabTitle";
import { fetchAllMainProductsList } from "../../store/action/productAction";
import ReactDataTable from "../../shared/table/ReactDataTable";
import { Button, Image } from "react-bootstrap-v5";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { getFormattedDate } from "../../shared/sharedMethod";

const Stock = (props) => {
    const { fetchAllMainProductsList, products, totalRecord, isLoading } =
        props;
    const [isOpen, setIsOpen] = useState(false);
    const [lightBoxImage, setLightBoxImage] = useState([]);

    useEffect(() => {
        fetchAllMainProductsList();
    }, [fetchAllMainProductsList]);

    const onChange = (filter) => {
        fetchAllMainProductsList(filter, true);
    };

    const itemsValue =
        products.length > 0
            ? products.map((item) => ({
                  images: item?.attributes?.images,
                  code: item?.attributes?.code,
                  name: item?.attributes?.name,
                  id: item?.id,
              }))
            : [];

    const handleUpdatePriceClick = (id) => {
        window.location.href = "#/app/inventory/update-inventory-price/" + id;
    };

    const handleUpdateQuantityClick = (id) => {
        window.location.href = "#/app/inventory/create-stock/" + id;
    };

    const columns = [
        {
            name: "Images",
            selector: (row) => row.images,
            sortable: false,
            sortField: "images",
            width: "200px",
            cell: (row) => {
                const imageUrl = row.images?.imageUrls?.[0]
                    ? row.images.imageUrls[0].replace(/\\/g, "/")
                    : null;

                const productCode = row.code || "";
                const fallbackText = productCode
                    ? productCode[0] + productCode[productCode.length - 1]
                    : "--";

                return (
                    <div
                        className="d-flex align-items-center justify-content-center"
                        style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            backgroundColor: imageUrl ? "transparent" : "#ddd",
                            color: "#000",
                            fontWeight: "bold",
                            fontSize: "16px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            textTransform: "uppercase",
                        }}
                    >
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt="Product"
                                style={{
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    width: "100%",
                                    height: "100%",
                                }}
                            />
                        ) : (
                            fallbackText
                        )}
                    </div>
                );
            },
        },
        {
            name: "SKU CODE",
            selector: (row) => row?.code,
            sortField: "code",
            sortable: true,
            width: "200px",
        },
        {
            name: "Name",
            selector: (row) => row.name,
            sortField: "name",
            sortable: true,
            width: "400px",
            className: "product-name",
        },
        {
            name: "Action",
            button: true,
            width: "200px",
            cell: (row) => (
                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        justifyContent: "center",
                    }}
                >
                    <button
                        className="btn btn-warning"
                        onClick={() => handleUpdateQuantityClick(row.id)}
                        style={{
                            padding: "5px",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                        }}
                    >
                        Update Quantity
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => handleUpdatePriceClick(row.id)}
                        style={{
                            padding: "5px",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                        }}
                    >
                        Update Price
                    </button>
                </div>
            ),
        },
    ];

    return (
        <MasterLayout>
            <TabTitle title="Product Inventory" />
            <ReactDataTable
                columns={columns}
                items={itemsValue}
                isLoading={isLoading}
                onChange={onChange}
                totalRows={totalRecord}
            />
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const { products, totalRecord, isLoading } = state;
    return { products, totalRecord, isLoading };
};

export default connect(mapStateToProps, {
    fetchAllMainProductsList,
})(Stock);
