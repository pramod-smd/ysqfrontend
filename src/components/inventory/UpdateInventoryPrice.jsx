import React, { useEffect, useState } from "react";
import MasterLayout from "../MasterLayout";
import { Tokens } from "../../constants";
import { useParams } from "react-router";
import axiosApi from "../../config/apiConfig";
import { connect} from "react-redux";
import Select from "react-select";
import {
    decimalValidate,
    getFormattedMessage,
    getFormattedOptions,
    placeholderText,
} from "../../shared/sharedMethod";
import { addToast } from "../../store/action/toastAction";
import { useDispatch ,useSelector} from "react-redux";
import { fetchCurrencies } from "../../store/action/currencyAction";
import { Permissions } from "../../constants";
import { fetchConfig } from "../../store/action/configAction";
const UpdateInventoryPrice = (props) => {
    const { fetchCurrencies, currencies } = props;
    const [channels, setChannels] = useState([]);
    const [prices, setPrices] = useState({});
    const [productPrice, setProductPrice] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [productName, setProductName] = useState("");
    const [distributors, setDistributors] = useState([]);
    const [selectedDistributor, setSelectedDistributor] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = channels.slice(indexOfFirstItem, indexOfLastItem);
    const [currencySymbol, setCurrencySymbol] = useState("");
    const [isDisabled, setIsDisabled] = useState(true);    
    const dispatch = useDispatch();
    const {config}=useSelector(
        (state)=>state
    );    

    const [notification, setNotification] = useState({
        show: false,
        message: "",
        type: "",
    });
    const { id } = useParams();

    const handleBack = () => {
        window.location.href = "#/app/inventory/";
    };

    const nextPage = () => {
        if (currentPage < Math.ceil(channels.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const fetchProductPrice = async () => {
        try {
            const token = localStorage.getItem(Tokens.ADMIN);
            const response = await axiosApi.get(`get-products-details/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            // console.log(response.data);
            setProductPrice(response.data?.data?.price);
            setProductName(response.data?.data?.name);
            const initialPrices = {};
            const productDefaultPrice = response.data?.data?.price;

            response.data.data.chanel.forEach((channel) => {
                initialPrices[channel.chanel_id] =
                    channel.price || productDefaultPrice;
            });

            setPrices(initialPrices);
        } catch (error) {
            // showNotification("Failed to fetch product prices.", "danger");
        }
    };

    const fetchChannels = async () => {
        try {
            const token = localStorage.getItem(Tokens.ADMIN);
            const response = await axiosApi.get("chanels-list", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setChannels(response.data?.data);
        } catch (error) {
            showNotification("Failed to fetch channels.", "danger");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDistributors = async () => {
        try {
            const token = localStorage.getItem(Tokens.ADMIN);
            const response = await axiosApi.get("distributor-list", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const distributorList = response.data.data.map((distributor) => {
                return {
                    id: distributor.id,
                    name: `${distributor.attributes.first_name} ${distributor.attributes.last_name}`,
                };
            });
            setDistributors(distributorList);
        } catch (error) {
            showNotification("Failed to fetch distributors!", "danger");
        }
    };

    const fetchDistributorPrices = async (distributorId) => {
        if (!distributorId) {
            const resetPrices = {};
            channels.forEach((channel) => {
                resetPrices[channel.id] = productPrice;
            });
            setPrices(resetPrices);
            return;
        }

        try {
            const token = localStorage.getItem(Tokens.ADMIN);
            const response = await axiosApi.get(
                `distributor-prices/${distributorId}/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            // console.log(response.data);

            const distributorPrices = {};
            response.data.data.forEach((item) => {
                distributorPrices[item.channel_id] = item.price;
            });

            const updatedPrices = {};
            channels.forEach((channel) => {
                updatedPrices[channel.id] =
                    distributorPrices[channel.id] || productPrice;
            });
            setPrices(updatedPrices);
        } catch (error) {
            showNotification("Failed to fetch distributor prices.", "danger");
        }
    };

    const showNotification = (message, type) => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ ...notification, show: false });
        }, 3000);
    };

    const updateAllPrices = async () => {
        try {
            const token = localStorage.getItem(Tokens.ADMIN);
            const productId = id;

            for (const channel of channels) {
                const price = prices[channel.id];
                await axiosApi.post(
                    "price-inventories",
                    {
                        price,
                        chanel_id: channel.id,
                        product_id: productId,
                        distributor_id: selectedDistributor,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
            }
            // showNotification("Price updated successfully!", "success");
            dispatch(
                addToast({
                    text: "Price updated successfully!",
                    type: "success",
                })
            );
        } catch (error) {
            dispatch(
                addToast({
                    text: "Error updating prices. Please try again.",
                    type: "error",
                })
            );
        }
    };

    useEffect(() => {
             dispatch(fetchConfig);
            fetchCurrencies();
    }, []);

    useEffect(() => {
        const localCountryId = localStorage.getItem("country");
        if (currencies.length > 0 && localCountryId) {
            const matchedCurrency = currencies.find(
                (currency) => currency.attributes?.country_id == localCountryId
            );
            if (matchedCurrency) {
                setCurrencySymbol(matchedCurrency.attributes?.symbol);
            }
        }
    }, [currencies]);

    useEffect(() => {
        fetchDistributors();
        fetchProductPrice();
        fetchChannels();
    }, [id]);

    useEffect(() => {
        fetchDistributorPrices(selectedDistributor);
    }, [selectedDistributor]);

    const handleChange = (selectedOption) => {
    setIsDisabled(config && config.includes(Permissions.UPDATE_PRODUCT_INVENTORY_PRICE)?false:true)
    setSelectedDistributor(selectedOption ? selectedOption.value : "");
    };

    const options = distributors.map((distributor) => ({
        value: distributor.id,
        label: distributor.name,
    }));

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <MasterLayout>
            <div className="container mt-4">
                {notification.show && (
                    <div
                        className={`alert alert-${notification.type} alert-dismissible fade show text-white`}
                        role="alert"
                    >
                        {notification.message}
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() =>
                                setNotification({
                                    ...notification,
                                    show: false,
                                })
                            }
                        ></button>
                    </div>
                )}

                <div className="d-flex justify-content-between align-items-center   mb-2">
                    <div className="w-50 ms-3">
                        <Select
                            options={options}
                            value={options.find(
                                (option) => option.value === selectedDistributor
                            )}
                            onChange={handleChange}
                            placeholder="Select Distributor"
                            isClearable
                            className="react-select-container"
                            classNamePrefix="react-select"
                        />
                    </div>

                    <button
                        className="btn"
                        onClick={() =>
                            (window.location.href = "#/app/inventory/")
                        }
                        style={{ backgroundColor: "#ff5722", color: "white" }}
                    >
                        Back
                    </button>
                    {/* <i
                        className="bi bi-arrow-left-square mx-2"
                        onClick={handleBack}
                        style={{
                            fontSize: "2.5rem",
                            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
                            color: "#007bff",
                            cursor: "pointer",
                        }}
                    ></i> */}
                </div>
                <h2>Product: {productName}</h2>
                {selectedDistributor && (
                    <div className="table-container">
                        <table className="table table-striped table-bordered mt-5">
                            <thead>
                                <tr>
                                    <th className="text-dark">Id</th>
                                    <th className="text-dark">Channel Name</th>
                                    <th className="text-dark">
                                        Set Product Price
                                    </th>
                                    {/* <th className="text-dark">Action</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item, index) => (
                                    <tr key={item.id}>
                                        <td className="text-dark">
                                            {index + 1}
                                        </td>
                                        <td>{item.name}</td>
                                        <td>
                                            <div className="input-group">
                                                <span className="input-group-text">
                                                    {currencySymbol}{" "}
                                                </span>
                                                <input
                                                    disabled={isDisabled}
                                                    type="text"
                                                    className="form-control"
                                                    value={
                                                        prices[item.id] !==
                                                        undefined
                                                            ? prices[item.id]
                                                            : productPrice
                                                    }
                                                    onChange={(e) => {
                                                        const value =
                                                            e.target.value;
                                                        if (
                                                            /^\d*\.?\d*$/.test(
                                                                value
                                                            )
                                                        ) {
                                                            setPrices(
                                                                (
                                                                    prevPrices
                                                                ) => ({
                                                                    ...prevPrices,
                                                                    [item.id]:
                                                                        value,
                                                                })
                                                            );
                                                        }
                                                    }}
                                                    onKeyDown={(e) => {
                                                        const allowedKeys = [
                                                            "Backspace",
                                                            "Tab",
                                                            "ArrowLeft",
                                                            "ArrowRight",
                                                            "Delete",
                                                            ".",
                                                        ];
                                                        if (
                                                            !allowedKeys.includes(
                                                                e.key
                                                            ) &&
                                                            !/^\d$/.test(e.key)
                                                        ) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    placeholder="Enter price"
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex items-center justify-center my-4 w-full">
                            {/* Previous Button */}
                            <button
                                onClick={prevPage}
                                disabled={currentPage === 1}
                                style={{
                                    backgroundColor: "#ff5722",
                                    color: "white",
                                    padding: "8px 16px",
                                    borderRadius: "8px",
                                    fontWeight: "bold",
                                    opacity: currentPage === 1 ? 0.5 : 1,
                                    cursor:
                                        currentPage === 1
                                            ? "not-allowed"
                                            : "pointer",
                                }}
                            >
                                Previous
                            </button>

                            {/* Page Info */}
                            <span className="mx-6 text-gray-700 font-semibold">
                                Page {currentPage} of{" "}
                                {Math.ceil(channels.length / itemsPerPage)}
                            </span>

                            {/* Next Button */}
                            <button
                                onClick={nextPage}
                                disabled={
                                    currentPage ===
                                    Math.ceil(channels.length / itemsPerPage)
                                }
                                style={{
                                    backgroundColor: "#ff5722",
                                    color: "white",
                                    padding: "8px 8px",
                                    borderRadius: "8px",
                                    fontWeight: "bold",
                                    opacity:
                                        currentPage ===
                                        Math.ceil(
                                            channels.length / itemsPerPage
                                        )
                                            ? 0.5
                                            : 1,
                                    cursor:
                                        currentPage ===
                                        Math.ceil(
                                            channels.length / itemsPerPage
                                        )
                                            ? "not-allowed"
                                            : "pointer",
                                }}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
                <div className="d-flex justify-content-end">
                    <button
                        className="btn btn-primary mx-2"
                        onClick={handleBack}
                    >
                        Cancel
                    </button>
                    { config && config.includes(Permissions.UPDATE_PRODUCT_INVENTORY_PRICE)?
                    <button
                        className="btn btn-success"
                        onClick={updateAllPrices}
                    >
                        Apply All Prices
                    </button>
                    :""}
                </div>
            </div>
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const { currencies } = state;
    return {
        currencies,
    };
};

export default connect(mapStateToProps, {
    fetchCurrencies,
})(UpdateInventoryPrice);
