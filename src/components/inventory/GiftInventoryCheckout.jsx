import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tokens } from "../../constants";
import MasterLayout from "../MasterLayout";
import { connect,useDispatch,useSelector } from "react-redux";
import Select from "react-select";
import {
    fetchSingleGiftDetails,
    updateGiftInventoryQuantity,
} from "../../store/action/giftAction";
import { fetchWarehouseList } from "../../store/action/warehouseAction";
import { fetchDistributorsList } from "../../store/action/userAction";
import axiosApi from "../../config/apiConfig";
import { Permissions } from "../../constants";
import { fetchConfig } from "../../store/action/configAction";
const GiftInventoryCheckout = (props) => {
    const {
        updateGiftInventoryQuantity,
        warehouses,
        distributors,
        fetchWarehouseList,
        fetchDistributorsList,
        fetchSingleGiftDetails,
        giftDetails,
    } = props;
    const { id } = useParams();
    const [quantities, setQuantities] = useState({});
    const [previousQuantities, setPreviousQuantities] = useState({});
    const [selectedOption, setSelectedOption] = useState(null);
    const [currentDistributorPage, setCurrentDistributorPage] = useState(1);
    const [currentWarehousePage, setCurrentWarehousePage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [selectedDistributor, setSelectedDistributor] = useState(null);
    const [isDisabled, setIsDisabled] = useState(true);    
    const dispatch = useDispatch();
     const {config}=useSelector(
        (state)=>state
    );
    const handleBack = () => {
        window.location.href = "#/app/gift-inventory/";
    };

    const fetchInventroy = async (id) => {
        try {
            const token = localStorage.getItem(Tokens.ADMIN);
            const response = await axiosApi.get("gift-inventory", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                params: { gift_id: id },
            });

            const updatedQuantities = { ...quantities };
            const warehouseList = [];
            const distributorQuantitiesMap = {};
            response?.data?.forEach((item, index) => {
                if (item.distributor_id) {
                    if (!distributorQuantitiesMap[item.distributor_id]) {
                        updatedQuantities[
                            `distributor_${item.distributor_id}`
                        ] = item.distributor_quantities || 0;
                        setPreviousQuantities((prev) => ({
                            ...prev,
                            [`distributor_${item.distributor_id}`]:
                                item.distributor_quantities || 0,
                        }));

                        distributorQuantitiesMap[item.distributor_id] = true;
                    }
                }
                if (item.warehouse_id) {
                    updatedQuantities[`warehouse_${item.warehouse_id}`] =
                        item.warehouse_quantities || 0;
                    warehouseList.push(item);
                }
            });

            setQuantities(updatedQuantities);
        } catch (error) {
            console.error("Error fetching inventory:", error);
        }
    };

    useEffect(() => {
        if (id) {
            fetchInventroy(id);
            fetchSingleGiftDetails(id);
        }
    }, [id]);

    useEffect(() => {
        dispatch(fetchConfig());
        fetchWarehouseList();
        fetchDistributorsList();
    }, [fetchWarehouseList, fetchDistributorsList]); 

    const handleQuantityChange = (key, value) => {
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [key]: value === "" ? "" : value,
        }));
    };  

    const updateDistributorQuantity = async (distributorId) => {
        const quantity = quantities[`distributor_${distributorId}`];
        const previousQuantity =
            previousQuantities[`distributor_${distributorId}`];

        let quantityDifference = 0;
        if (previousQuantity !== undefined) {
            quantityDifference = quantity - previousQuantity;
        } else {
            quantityDifference = quantity;
        }

        const payload = {
            distributor_id: distributorId,
            distributor_quantities: quantityDifference,
            gift_id: id,
        };

        try {
            const response = await updateGiftInventoryQuantity(payload);

            if (response.status === 200) {
                setPreviousQuantities((prev) => ({
                    ...prev,
                    [`distributor_${distributorId}`]: quantity,
                }));
                alert("Quantity updated successfully");
            } else {
                alert(response.data.message || "Failed to update quantity");
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                alert(
                    error.response.data.message || "Insufficient gift quantity"
                );
            } else {
                // alert('An error occurred while updating the quantity');
            }
        }
    };

    const updateWarehouseQuantity = async (warehouseId) => {
        const quantity = quantities[`warehouse_${warehouseId}`];
        const previousQuantity = previousQuantities[`warehouse_${warehouseId}`];

        const payload = {
            warehouse_id: warehouseId,
            warehouse_quantities: quantity,
            gift_id: id,
        };

        await updateGiftInventoryQuantity(payload);

        setPreviousQuantities((prev) => ({
            ...prev,
            [`warehouse_${warehouseId}`]: quantity,
        }));
    };

    const handlePageChange = (pageNumber) => {
        if (selectedOption === "distributor") {
            setCurrentDistributorPage(pageNumber);
        } else if (selectedOption === "warehouse") {
            setCurrentWarehousePage(pageNumber);
        }
    };

    const getCurrentItems = (list) => {
        const currentPage =
            selectedOption === "distributor"
                ? currentDistributorPage
                : currentWarehousePage;

        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return list.slice(indexOfFirstItem, indexOfLastItem);
    };

    useEffect(() => {
        if (
            selectedOption === "distributor" ||
            selectedOption === "warehouse"
        ) {
            fetchInventroy(id);
        }
    }, [selectedOption, id]);
  

    const renderDistributorDropdown = () => {
        const distributorOptions = distributors.map((distributor) => ({
            value: distributor.id,
            label: `${distributor.attributes.first_name} ${distributor.attributes.last_name}`,
        }));

        return (
            <div>
                <h4>Select a Distributor</h4>
                <Select
                    options={distributorOptions}
                    value={distributorOptions.find(
                        (option) => option.value == selectedDistributor
                    )}
                    onChange={(selectedOption) => {
                        setSelectedDistributor(
                            selectedOption ? selectedOption.value : null
                        );
                    }}
                    placeholder="Select a Distributor"
                    isClearable
                />
            </div>
        );
    };

    const renderList = () => {
        let list = [];
        let message = "";

        if (selectedOption === "distributor") {
            list = distributors;
        } else if (selectedOption === "warehouse") {
            if (!selectedDistributor) {
                return renderDistributorDropdown();
            } else {
                list = warehouses.filter(
                    (warehouse) =>
                        warehouse.attributes.user_id == selectedDistributor
                );

                if (list.length === 0) {
                    message = "No warehouse for selected distributor.";
                }
            }
        }

        const currentItems = getCurrentItems(list);

        return (
            <div>
                {message && (
                    <strong>
                        <p>{message}</p>
                    </strong>
                )}

                <div className="row">
                    {currentItems.length > 0 ? (
                        currentItems.map((item) => (
                            <div className="col-12 mb-4" key={item.id}>
                                <div className="card shadow-lg">
                                    <span
                                        className="badge bg-primary position-absolute top-0 end-0 m-2"
                                        style={{ fontSize: "0.9rem" }}
                                    >
                                        Available Quantity:{" "}
                                        {selectedOption === "distributor"
                                            ? giftDetails && giftDetails?.quantity || 0
                                            : selectedOption === "warehouse" &&
                                              selectedDistributor
                                            ? previousQuantities[
                                                  `distributor_${selectedDistributor}`
                                              ] || 0
                                            : 0}
                                    </span>
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            <strong>
                                                {item.attributes?.name ||
                                                    `${item?.attributes?.first_name} ${item?.attributes?.last_name}`}
                                            </strong>
                                        </h5>
                                        <div className="d-flex justify-content-between">
                                            {/* Left side: Details */}
                                            <div className="flex-grow-1">
                                                <p className="card-text">
                                                    <strong>Email:</strong>{" "}
                                                    {item.attributes?.email}{" "}
                                                    <br />
                                                    <strong>Phone:</strong>{" "}
                                                    {item.attributes?.phone}{" "}
                                                    <br />
                                                    {/* Show region only for distributors */}
                                                    {selectedOption ===
                                                        "distributor" &&
                                                        item.attributes
                                                            ?.regionDetails
                                                            ?.name && (
                                                            <>
                                                                <strong>
                                                                    Region:
                                                                </strong>{" "}
                                                                {
                                                                    item
                                                                        .attributes
                                                                        ?.regionDetails
                                                                        ?.name
                                                                }{" "}
                                                                <br />
                                                            </>
                                                        )}
                                                    {selectedOption ===
                                                        "warehouse" &&
                                                        item.attributes
                                                            ?.areaDetails
                                                            ?.name && (
                                                            <>
                                                                <strong>
                                                                    Area:
                                                                </strong>{" "}
                                                                {
                                                                    item
                                                                        .attributes
                                                                        ?.areaDetails
                                                                        ?.name
                                                                }{" "}
                                                                <br />
                                                            </>
                                                        )}
                                                </p>
                                            </div>

                                            {/* Right side: Input and Apply Button */}
                                            {/* <div className="d-flex align-items-center">
                                                <input
                                                    type="number"
                                                    value={
                                                        quantities[
                                                            `${selectedOption}_${item.id}`
                                                        ] || 0
                                                    }
                                                    onChange={(e) =>
                                                        handleQuantityChange(
                                                            `${selectedOption}_${item.id}`,
                                                            e
                                                        )
                                                    }
                                                    placeholder="Enter quantity"
                                                    min="0"
                                                    className="form-control me-2"
                                                    style={{ width: "120px" }}
                                                />
                                                <button
                                                    onClick={() =>
                                                        selectedOption ===
                                                        "distributor"
                                                            ? updateDistributorQuantity(
                                                                  item.id
                                                              )
                                                            : updateWarehouseQuantity(
                                                                  item.id
                                                              )
                                                    }
                                                    className="btn btn-success"
                                                >
                                                    Apply
                                                </button>
                                            </div> */}
                                            <div className="d-flex align-items-center">
                                                <input
                                                    disabled={isDisabled}
                                                    type="number"
                                                    value={
                                                        quantities[
                                                            `${selectedOption}_${item.id}`
                                                        ] ?? ""
                                                    }
                                                    onChange={(e) => {
                                                        const inputValue =
                                                            e.target.value;
                                                        if (inputValue === "") {
                                                            handleQuantityChange(
                                                                `${selectedOption}_${item.id}`,
                                                                ""
                                                            );
                                                        } else {
                                                            const quantity =
                                                                parseInt(
                                                                    inputValue,
                                                                    10
                                                                );
                                                            if (
                                                                !isNaN(quantity)
                                                            ) {
                                                                handleQuantityChange(
                                                                    `${selectedOption}_${item.id}`,
                                                                    quantity
                                                                );
                                                            }
                                                        }
                                                    }}
                                                    onKeyDown={(e) => {
                                                        const allowedKeys = [
                                                            "Backspace",
                                                            "ArrowLeft",
                                                            "ArrowRight",
                                                            "Delete",
                                                            "Tab",
                                                        ];
                                                        if (
                                                            !allowedKeys.includes(
                                                                e.key
                                                            ) &&
                                                            !/^[0-9]$/.test(
                                                                e.key
                                                            )
                                                        ) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    placeholder="Enter quantity"
                                                    min="0"
                                                    className="form-control me-2"
                                                    style={{ width: "200px" }}
                                                />
                                                {/* <button
                                                    onClick={() =>
                                                        selectedOption ===
                                                        "distributor"
                                                            ? updateDistributorQuantity(
                                                                  item.id
                                                              )
                                                            : updateWarehouseQuantity(
                                                                  item.id
                                                              )
                                                    }
                                                    className="btn btn-success"
                                                >
                                                    Apply
                                                </button> */}
                                              { config && config.includes(Permissions.UPDATE_GIFT_INVENTORY)?
                                                <button
                                                    onClick={async () => {
                                                        if (
                                                            selectedOption ===
                                                            "distributor"
                                                        ) {
                                                            await updateDistributorQuantity(
                                                                item.id
                                                            );
                                                        } else {
                                                            await updateWarehouseQuantity(
                                                                item.id
                                                            );
                                                        }
                                                        await fetchInventroy(id);
                                                    }}
                                                    className="btn btn-success"
                                                >
                                                    Apply
                                                </button>
                                              :""}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Click on a tab to get the {selectedOption} list.</p>
                    )}
                </div>

                {/* Pagination */}
                <div className="d-flex justify-content-center mt-3">
                    <nav aria-label="Page navigation example">
                        <ul className="pagination">
                            <li
                                className={`page-item ${
                                    (selectedOption === "distributor" &&
                                        currentDistributorPage === 1) ||
                                    (selectedOption === "warehouse" &&
                                        currentWarehousePage === 1)
                                        ? "disabled"
                                        : ""
                                }`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() =>
                                        handlePageChange(
                                            selectedOption === "distributor"
                                                ? currentDistributorPage - 1
                                                : currentWarehousePage - 1
                                        )
                                    }
                                >
                                    Previous
                                </button>
                            </li>
                            {[
                                ...Array(Math.ceil(list.length / itemsPerPage)),
                            ].map((_, index) => (
                                <li
                                    className={`page-item ${
                                        (selectedOption === "distributor" &&
                                            currentDistributorPage ===
                                                index + 1) ||
                                        (selectedOption === "warehouse" &&
                                            currentWarehousePage === index + 1)
                                            ? "active"
                                            : ""
                                    }`}
                                    key={index}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() =>
                                            handlePageChange(index + 1)
                                        }
                                    >
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                            <li
                                className={`page-item ${
                                    (selectedOption === "distributor" &&
                                        currentDistributorPage ===
                                            Math.ceil(
                                                list.length / itemsPerPage
                                            )) ||
                                    (selectedOption === "warehouse" &&
                                        currentWarehousePage ===
                                            Math.ceil(
                                                list.length / itemsPerPage
                                            ))
                                        ? "disabled"
                                        : ""
                                }`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() =>
                                        handlePageChange(
                                            selectedOption === "distributor"
                                                ? currentDistributorPage + 1
                                                : currentWarehousePage + 1
                                        )
                                    }
                                >
                                    Next
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        );
    };

    return (
        <MasterLayout>
            <div className="d-flex justify-content-end">
                <button className="btn btn-danger" onClick={handleBack}>
                    Back
                </button>
            </div>
            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-12">
                        <div className="card shadow-lg">
                            <div className="card-header bg-primary text-white">
                                {/* <h4>{products?.name}</h4> */}
                                <h4>{giftDetails && giftDetails?.title}</h4>
                                {/* <h6>
                                    Available Quantity:{" "}
                                    {(giftDetails && giftDetails?.quantity) ||
                                        0}
                                </h6> */}
                            </div>
                            <div className="card-body">
                                <h5 className="card-title mb-4">
                                    Choose an Option
                                </h5>
                                <p className="card-text mb-4">
                                    Select either Distributor or Warehouse to
                                    proceed with the inventory update process.
                                </p>

                                {/* <div className="d-flex justify-content-end mb-3">
                                       <button
                                           className="btn btn-success me-2"
                                           onClick={() =>
                                               setSelectedOption("distributor")
                                           }
                                       >
                                           Distributor
                                       </button>
                                       <button
                                           className="btn btn-warning"
                                           onClick={() =>
                                               setSelectedOption("warehouse")
                                           }
                                       >
                                           Warehouse
                                       </button>
                                   </div> */}

                                <div className="d-flex justify-content-end mb-3">
                                    <button
                                        className="btn btn-success me-2"
                                        onClick={() => {
                                            setSelectedOption("distributor");
                                            setSelectedDistributor(null);
                                            setIsDisabled(config && config.includes(Permissions.UPDATE_GIFT_INVENTORY)?false:true);      

                                        }}
                                        disabled={["4", "5"].includes(
                                            JSON.parse(localStorage.getItem("loginUserArray"))?.role_id?.toString()
                                        )}
                                    >
                                        Distributor
                                    </button>
                                    <button
                                        className="btn btn-warning"
                                        onClick={() => {
                                            setSelectedOption("warehouse");
                                            setSelectedDistributor(null);
                                            setIsDisabled(config && config.includes(Permissions.UPDATE_GIFT_INVENTORY)?false:true);      

                                        }}
                                    >
                                        Warehouse
                                    </button>
                                </div>

                                <div className="mt-4">{renderList()}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const { warehouses, distributors, giftDetails } = state;
    return { warehouses, distributors, giftDetails };
};

export default connect(mapStateToProps, {
    fetchWarehouseList,
    fetchDistributorsList,
    updateGiftInventoryQuantity,
    fetchSingleGiftDetails,
})(GiftInventoryCheckout);
