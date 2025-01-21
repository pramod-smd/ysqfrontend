import React, { useState, useEffect, useRef } from "react";
import { Col, Container, Row, Table } from "react-bootstrap-v5";
import { connect, useDispatch, useSelector } from "react-redux";
import {
    posSearchNameProduct,
    posSearchCodeProduct,
} from "../../store/action/pos/posfetchProductAction";
import { prepareCartArray } from "../../frontend/shared/PrepareCartArray";
import { posCashPaymentAction } from "../../store/action/pos/posCashPaymentAction";

import { fetchFrontSetting } from "../../store/action/frontSettingAction";
import { fetchSetting } from "../../store/action/settingAction";
import { calculateProductCost } from "../../frontend/shared/SharedMethod";
import {
    fetchBrandClickable,
    posAllProduct,
} from "../../store/action/pos/posAllProductAction";
import TabTitle from "../../shared/tab-title/TabTitle";
import HeaderAllButton from "../../frontend/components/header/HeaderAllButton";
import {
    closeRegisterAction,
    fetchTodaySaleOverAllReport,
    getAllRegisterDetailsAction,
} from "../../store/action/pos/posRegisterDetailsAction";
import {
    getFormattedMessage,
    getFormattedOptions,
} from "../../shared/sharedMethod";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import CustomerForm from "../../frontend/components/customerModel/CustomerForm";
import { fetchHoldLists } from "../../store/action/pos/HoldListAction";
import { useNavigate } from "react-router";
import axiosApi from "../../config/apiConfig";
import { Tokens } from "../../constants";
import GiftDetailModule from "./GiftDetailModule";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { addToast } from "../../store/action/toastAction";
import Select from "react-select";
import { attempt } from "lodash";

const PosLoadGift = (props) => {
    const {
        onClickFullScreen,
        frontSetting,
        fetchFrontSetting,
        settings,
        fetchSetting,
        allConfigData,
        fetchHoldLists,
        holdListData,
    } = props;
    const [isOpenGiftDetailModal, setIsOpenGiftDetailModal] = useState(false);
    const [selectedGift, setSelectedGift] = useState(null);
    const [gifts, setGifts] = useState([]);
    const [originalGifts, setOriginalGifts] = useState([]);
    const [cart, setCart] = useState([]);
    const [salesmen, setSalesmen] = useState([]);
    const [warehouse, setWarehouse] = useState([]);
    const [allWarehouse, setAllWarehouse] = useState([]);
    const [selectedSalesmanId, setSelectedSalesmanId] = useState(null);
    const [selectedWarehouseId, setSelectedWarehouseId] = useState("");
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [filteredSalesmen, setFilteredSalesmen] = useState([]);
    const [filteredsGifts, setFilteredsGifts] = useState([]);

    const [modalShowCustomer, setModalShowCustomer] = useState(false);
    const [updateHolList, setUpdateHoldList] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedWarehouseIdForDrown, setSelectedWarehouseIdForDrown] =
        useState("");
    const [showErrorNotification, setShowErrorNotification] = useState(false);
    const [assignForDate, setAssignForDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [errors, setErrors] = useState({ notes: "" });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showNotification, setShowNotification] = useState(false);
    const [showDateErrorNotification, setShowDateErrorNotification] =
        useState(false);
    const [selectedGifts, setSelectedGifts] = useState([]);

    const [holdListId, setHoldListValue] = useState({
        referenceNumber: "",
    });

    // useEffect(() => {
    //     const fetchAllGift = async () => {
    //         try {
    //             const token = localStorage.getItem(Tokens.ADMIN);
    //             const response = await axiosApi.get("get-gift-list", {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                     "Content-Type": "application/json",
    //                 },
    //             });
    //             console.log("giftList:", response.data);
    //             setGifts(response.data.data.data);
    //         } catch (error) {
    //             console.error("Error fetching all salesman:", error);
    //         }
    //     };
    //     fetchAllGift();
    // }, []);

    useEffect(() => {
        const fetchAllGift = async () => {
            try {
                const token = localStorage.getItem(Tokens.ADMIN);
                const response = await axiosApi.get("get-gift-list-all",{
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                // console.log("giftList:", response.data);

                const initializedGifts = response.data.data.data.map(
                    (gift) => ({
                        ...gift,
                        gift_inventories_details:
                            gift.gift_inventories_details.map((inventory) => ({
                                ...inventory,
                                original_quantities:
                                    inventory.warehouse_quantities,
                            })),
                    })
                );

                setGifts(initializedGifts);
            } catch (error) {
                console.error("Error fetching all gifts:", error);
            }
        };

        fetchAllGift();
    }, []);

    useEffect(() => {
        const fetchAllWarehouses = async () => {
            try {
                const token = localStorage.getItem(Tokens.ADMIN);
                const response = await axiosApi.get("warehouse-list", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                // console.log("warehouseList:", response.data);
                setWarehouse(response.data?.data);
                setAllWarehouse(response.data?.data);
            } catch (error) {
                console.error("Error fetching all warehouse:", error);
            }
        };
        fetchAllWarehouses();
    }, []);

    useEffect(() => {
        const fetchAllSalesmen = async () => {
            try {
                const token = localStorage.getItem(Tokens.ADMIN);
                const response = await axiosApi.get("show-salesman", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                // console.log("salesmenList:", response.data);
                setSalesmen(response.data);
            } catch (error) {
                console.error("Error fetching all salesmen:", error);
            }
        };

        fetchAllSalesmen();
    }, []);

    // const handleSelectGift = (gift) => {
    //     const warehouseInventory = gift.gift_inventories_details.find(
    //         (inventory) => inventory.warehouse_id == selectedWarehouseId
    //     );

    //     if (!warehouseInventory) {
    //         dispatch(
    //             addToast({
    //                 text: "Gift not available in selected warehouse.",
    //                 type: "error",
    //             })
    //         );
    //         return;
    //     }

    //     const availableQuantity = warehouseInventory.warehouse_quantities;
    //     const isSelected = selectedGifts.includes(gift.id);

    //     if (isSelected) {
    //         setSelectedGifts(selectedGifts.filter((id) => id !== gift.id));

    //         setCart((prevCart) => {
    //             const updatedCart = prevCart.filter(
    //                 (item) => item.id !== gift.id
    //             );

    //             const removedItem = prevCart.find(
    //                 (item) => item.id == gift.id
    //             );

    //             if (removedItem) {
    //                 warehouseInventory.warehouse_quantities += removedItem.quantity;
    //             }

    //             return updatedCart;
    //         });
    //     } else {
    //         if (availableQuantity > 0) {
    //             setSelectedGifts([...selectedGifts, gift.id]);

    //             setCart((prevCart) => {
    //                 const existingGiftIndex = prevCart.findIndex(
    //                     (item) => item.id == gift.id
    //                 );

    //                 if (existingGiftIndex !== -1) {
    //                     return prevCart;
    //                 } else {
    //                     warehouseInventory.warehouse_quantities -= 1;

    //                     const newGift = {
    //                         ...gift,
    //                         quantity: 1,
    //                         maxQuantity: availableQuantity,
    //                     };

    //                     return [...prevCart, newGift];
    //                 }
    //             });
    //         } else {
    //             dispatch(
    //                 addToast({
    //                     text: "Gift is out of stock in the selected warehouse.",
    //                     type: "error",
    //                 })
    //             );
    //         }
    //     }
    // };

    // const handleSelectGift = (gift) => {
    //     const warehouseInventory = gift.gift_inventories_details.find(
    //         (inventory) => inventory.warehouse_id == selectedWarehouseId
    //     );

    //     if (!warehouseInventory) {
    //         dispatch(
    //             addToast({
    //                 text: "Gift not available in selected warehouse.",
    //                 type: "error",
    //             })
    //         );
    //         return;
    //     }

    //     const availableQuantity = warehouseInventory.warehouse_quantities;
    //     const isSelected = selectedGifts.includes(gift.id);

    //     if (isSelected) {
    //         setSelectedGifts(selectedGifts.filter((id) => id !== gift.id));
    //         setCart((prevCart) =>
    //             prevCart.filter((item) => item.id !== gift.id)
    //         );
    //     } else {
    //         if (availableQuantity > 0) {
    //             setSelectedGifts([...selectedGifts, gift.id]);
    //             setCart((prevCart) => {
    //                 const newGift = {
    //                     ...gift,
    //                     quantity: 1,
    //                     maxQuantity: availableQuantity,
    //                 };
    //                 return [...prevCart, newGift];
    //             });
    //         } else {
    //             dispatch(
    //                 addToast({
    //                     text: "Gift is out of stock in the selected warehouse.",
    //                     type: "error",
    //                 })
    //             );
    //         }
    //     }
    // };

    const handleSelectGift = (gift) => {
        const warehouseInventory = gift.gift_inventories_details.find(
            (inventory) => inventory.warehouse_id == selectedWarehouseId
        );

        if (!warehouseInventory) {
            dispatch(
                addToast({
                    text: "Gift not available in selected warehouse.",
                    type: "error",
                })
            );
            return;
        }

        const availableQuantity = warehouseInventory.warehouse_quantities;
        const isSelected = selectedGifts.includes(gift.id);

        if (isSelected) {
            setSelectedGifts(selectedGifts.filter((id) => id !== gift.id));
            setCart((prevCart) => {
                const removedGift = prevCart.find(
                    (item) => item.id == gift.id
                );
                if (removedGift) {
                    warehouseInventory.warehouse_quantities +=
                        removedGift.quantity;
                }
                return prevCart.filter((item) => item.id !== gift.id);
            });
        } else {
            if (availableQuantity > 0) {
                setSelectedGifts([...selectedGifts, gift.id]);
                setCart((prevCart) => {
                    const newGift = {
                        ...gift,
                        quantity: 0,
                        maxQuantity: availableQuantity,
                    };
                    // warehouseInventory.warehouse_quantities -= 1;

                    return [...prevCart, newGift];
                });
            } else {
                dispatch(
                    addToast({
                        text: "Gift is out of stock in the selected warehouse.",
                        type: "error",
                    })
                );
            }
        }
    };

    const filteredGifts = gifts.filter((gift) =>
        gift.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openGiftDetailModal = () => {
        setIsOpenGiftDetailModal(!isOpenGiftDetailModal);
    };

    const onClickUpdateGiftInCart = (gift) => {
        // console.log("giftDetail:", gift);
        setSelectedGift(gift);
        setIsOpenGiftDetailModal(true);

        setCart((prevCart) => {
            const existingGiftIndex = prevCart.findIndex(
                (item) => item.id == gift.id
            );

            if (existingGiftIndex !== -1) {
                const updatedCart = [...prevCart];
                updatedCart[existingGiftIndex].quantity += 1;
                return updatedCart;
            } else {
                return [
                    ...prevCart,
                    { ...gift, quantity: 1, maxQuantity: gift.quantity },
                ];
            }
        });
    };

    // const handleRemove = (index) => {
    //     setCart((prevCart) => {
    //         const giftId = prevCart[index].id;
    //         const gift = filteredGifts.find((g) => g.id == giftId);

    //         if (gift) {
    //             const warehouseInventory = gift.gift_inventories_details.find(
    //                 (inventory) =>
    //                     inventory.warehouse_id == selectedWarehouseId
    //             );
    //             if (warehouseInventory) {
    //                 warehouseInventory.warehouse_quantities +=
    //                     prevCart[index].quantity;
    //             }
    //         }

    //         const updatedCart = prevCart.filter((_, i) => i !== index);

    //         setSelectedGifts((prevSelected) =>
    //             prevSelected.filter((id) => id !== giftId)
    //         );

    //         return updatedCart;
    //     });
    // };

    const handleRemove = (index) => {
        setCart((prevCart) => {
            const updatedCart = [...prevCart];
            const giftId = updatedCart[index].id;
            const removedQuantity = updatedCart[index].quantity;
            setFilteredsGifts((prevFilteredGifts) => {
                const updatedFilteredGifts = prevFilteredGifts.map((gift) => {
                    if (gift.id == giftId) {
                        const warehouseInventory =
                            gift.gift_inventories_details.find(
                                (inventory) =>
                                    inventory.warehouse_id ==
                                    selectedWarehouseId
                            );

                        if (warehouseInventory) {
                            warehouseInventory.warehouse_quantities +=
                                removedQuantity;
                        }
                    }
                    return gift;
                });
                return updatedFilteredGifts;
            });

            const newCart = updatedCart.filter((_, i) => i !== index);
            setSelectedGifts((prevSelected) =>
                prevSelected.filter((id) => id !== giftId)
            );

            return newCart;
        });
    };

    const handleAssignAllGifts = async () => {
        if (!selectedSalesmanId) {
            dispatch(
                addToast({
                    text: "Please select a salesman.",
                    type: "error",
                })
            );
            return;
        }

        if (!selectedDate) {
            dispatch(
                addToast({
                    text: "Please select a date.",
                    type: "error",
                })
            );
            return;
        }

        if (!selectedWarehouseId) {
            dispatch(
                addToast({
                    text: "Please select a warehouse.",
                    type: "error",
                })
            );
            return;
        }

        const hasZeroQuantity = cart.some((gift) => gift.quantity <= 0);
        if (hasZeroQuantity) {
            dispatch(
                addToast({
                    text: "At least one quantity needs to be assigned for each gift.",
                    type: "error",
                })
            );
            return;
        }

        let hasError = false;
        const successfulAssignments = [];

        for (const assignedGift of cart) {
            const giftInventory = assignedGift.gift_inventories_details.find(
                (inventory) => inventory.warehouse_id == selectedWarehouseId
            );

            const assignmentData = {
                salesman_id: selectedSalesmanId.value,
                gift_id: assignedGift.id,
                quantity: assignedGift.quantity,
                assign_for_date: moment(selectedDate).format("YYYY-MM-DD"),
                warehouse_id: selectedWarehouseId,
            };

            try {
                const token = localStorage.getItem(Tokens.ADMIN);
                await axiosApi.post("assign-gift", assignmentData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                giftInventory.warehouse_quantities -= assignedGift.quantity;
                successfulAssignments.push(assignedGift.id);
            } catch (error) {
                console.error(
                    "Error assigning gift:",
                    error.response?.data?.message || error.message
                );
                dispatch(
                    addToast({
                        text:
                            error.response?.data?.message ||
                            "An error occurred while assigning the gift.",
                        type: "error",
                    })
                );
                hasError = true;
                break;
            }
        }

        if (!hasError) {
            dispatch(
                addToast({
                    text: `All Gifts Assigned Successfully: ${successfulAssignments.join(
                        ", "
                    )}`,
                })
            );
            window.location.href = "#/app/assigned-gift-list";
        }

        setSelectedSalesmanId(null);
        setSelectedDate(new Date());
        setSelectedWarehouseId("");
        setCart([]);
    };

    // const handleIncrement = (index) => {
    //     setCart((prevCart) => {
    //         const updatedCart = [...prevCart];
    //         const giftId = updatedCart[index].id;
    //         const gift = filteredGifts.find((g) => g.id == giftId);

    //         const warehouseInventory = gift?.gift_inventories_details.find(
    //             (inventory) => inventory.warehouse_id == selectedWarehouseId
    //         );

    //         if (
    //             updatedCart[index].quantity < updatedCart[index].maxQuantity &&
    //             warehouseInventory &&
    //             warehouseInventory.warehouse_quantities > 0
    //         ) {
    //             updatedCart[index].quantity += 1;
    //             warehouseInventory.warehouse_quantities -= 1;
    //         } else {
    //             console.log(
    //                 "Cannot increment: either maxQuantity reached or no stock."
    //             );
    //         }

    //         return updatedCart;
    //     });
    // };

    const handleQuantityChange = (index, value) => {
        const newValue = Number(value);

        // if (isNaN(newValue) || newValue < 1) {
        //     dispatch(
        //         addToast({
        //             text: "Please enter a valid quantity greater than 0.",
        //             type: "error",
        //         })
        //     );
        //     return;
        // }

        setCart((prevCart) => {
            const updatedCart = [...prevCart];
            const giftId = updatedCart[index].id;

            let isStockAvailable = true;

            setFilteredsGifts((prevFilteredGifts) => {
                const updatedFilteredGifts = prevFilteredGifts.map((gift) => {
                    if (gift.id == giftId) {
                        const warehouseInventory =
                            gift.gift_inventories_details.find(
                                (inventory) =>
                                    inventory.warehouse_id ==
                                    selectedWarehouseId
                            );

                        const currentQuantity =
                            updatedCart[index].quantity || 0;
                        const changeInQuantity = newValue - currentQuantity;

                        // Validate stock availability and max quantity
                        if (
                            warehouseInventory &&
                            warehouseInventory.warehouse_quantities >=
                                changeInQuantity &&
                            newValue <= updatedCart[index].maxQuantity
                        ) {
                            // Update cart and warehouse stock
                            updatedCart[index].quantity = newValue;
                            warehouseInventory.warehouse_quantities -=
                                changeInQuantity;
                        } else {
                            isStockAvailable = false;
                        }
                    }
                    return gift;
                });
                return updatedFilteredGifts;
            });

            if (!isStockAvailable) {
                dispatch(
                    addToast({
                        text: "Quantities not available in stock.",
                        type: "error",
                    })
                );
                return prevCart;
            }

            return updatedCart;
        });
    };

    const handleIncrement = (index) => {
        setCart((prevCart) => {
            const updatedCart = [...prevCart];
            const giftId = updatedCart[index].id;

            setFilteredsGifts((prevFilteredGifts) => {
                const updatedFilteredGifts = prevFilteredGifts.map((gift) => {
                    if (gift.id == giftId) {
                        const warehouseInventory =
                            gift.gift_inventories_details.find(
                                (inventory) =>
                                    inventory.warehouse_id ==
                                    selectedWarehouseId
                            );

                        if (
                            updatedCart[index].quantity <
                                updatedCart[index].maxQuantity &&
                            warehouseInventory &&
                            warehouseInventory.warehouse_quantities > 0
                        ) {
                            updatedCart[index].quantity += 1;
                            warehouseInventory.warehouse_quantities -= 1;
                        }
                    }
                    return gift;
                });
                return updatedFilteredGifts;
            });

            return updatedCart;
        });
    };

    // const handleDecrement = (index) => {
    //     setCart((prevCart) => {
    //         const newCart = [...prevCart];
    //         const gift = filteredGifts.find((g) => g.id == newCart[index].id);
    //         const warehouseInventory = gift?.gift_inventories_details.find(
    //             (inventory) => inventory.warehouse_id == selectedWarehouseId
    //         );

    //         if (newCart[index].quantity > 1 && warehouseInventory) {
    //             newCart[index].quantity -= 1;
    //             warehouseInventory.warehouse_quantities += 1;
    //         } else {
    //             console.log(
    //                 "Cannot decrement: Cart quantity is already 1 or no warehouse stock."
    //             );
    //         }

    //         return newCart;
    //     });
    // };

    const handleDecrement = (index) => {
        setCart((prevCart) => {
            const updatedCart = [...prevCart];
            const giftId = updatedCart[index].id;

            setFilteredsGifts((prevFilteredGifts) => {
                const updatedFilteredGifts = prevFilteredGifts.map((gift) => {
                    if (gift.id == giftId) {
                        const warehouseInventory =
                            gift.gift_inventories_details.find(
                                (inventory) =>
                                    inventory.warehouse_id ==
                                    selectedWarehouseId
                            );

                        if (
                            updatedCart[index].quantity > 1 &&
                            warehouseInventory
                        ) {
                            updatedCart[index].quantity -= 1;
                            warehouseInventory.warehouse_quantities += 1;
                        } else {
                            console.log(
                                "Cannot decrement: Cart quantity is already 1 or no warehouse stock."
                            );
                        }
                    }
                    return gift;
                });
                return updatedFilteredGifts;
            });

            return updatedCart;
        });
    };

    // const handleWarehouseChange = (selectedOption) => {

    //     setSelectedWarehouse(selectedOption);
    //     setSelectedWarehouseId(selectedOption.value);

    //     const allWarehouses = allWarehouse.find(
    //         (item) => item.attributes.ware_id == selectedOption.value
    //     );
    //     setSelectedWarehouseId(allWarehouses?.id);
    //     setSelectedSalesmanId(null);

    //     if (selectedOption) {
    //         const filteredGifts = gifts.filter((gift) => {
    //             return gift.gift_inventories_details.some(
    //                 (inventory) => inventory.warehouse_id == allWarehouses?.id
    //             );
    //         });

    //         const resetQuantitiesGifts = filteredGifts.map((gift) => ({
    //             ...gift,
    //             gift_inventories_details: gift.gift_inventories_details.map(
    //                 (inventory) => ({
    //                     ...inventory,
    //                     warehouse_quantities: inventory.original_quantities,
    //                 })
    //             ),
    //         }));
    //         setFilteredsGifts(resetQuantitiesGifts);
    //         setCart([]);
    //         setSelectedGifts([]);

    //         const filteredSalesmen = salesmen.filter(
    //             (salesman) => salesman.ware_id == selectedOption.value
    //         );
    //         setFilteredSalesmen(filteredSalesmen);
    //     } else {
    //         setFilteredsGifts(gifts);
    //         setFilteredSalesmen(salesmen);
    //         setCart([]);
    //         setSelectedGifts([]);
    //     }
    // };

    const handleWarehouseChange = (selectedOption) => {
        // console.log("selected option:", selectedOption);
        setSelectedWarehouse(selectedOption);
        setSelectedWarehouseId(selectedOption.value);
        setSelectedWarehouseIdForDrown(selectedOption.value);
        setSelectedSalesmanId(null);

        const allWarehouses = allWarehouse.find(
            (item) => item.attributes.ware_id == selectedOption.value
        );
        setSelectedWarehouseId(allWarehouses?.id);

        if (selectedOption) {
            const filteredGifts = gifts && gifts.filter((gift) =>
                gift.gift_inventories_details.some(
                    (inventory) => inventory.warehouse_id == allWarehouses?.id
                )
            );

            const resetQuantitiesGifts = filteredGifts.map((gift) => ({
                ...gift,
                gift_inventories_details: gift.gift_inventories_details.map(
                    (inventory) => ({
                        ...inventory,
                        warehouse_quantities: inventory.original_quantities,
                    })
                ),
            }));

            setFilteredsGifts(resetQuantitiesGifts);
            setCart([]);
            setSelectedGifts([]);

            const filteredSalesmen = salesmen.filter(
                (salesman) => salesman.ware_id == selectedOption.value
            );
            setFilteredSalesmen(filteredSalesmen);
        } else {
            setFilteredsGifts(gifts);
            setCart([]);
            setSelectedGifts([]);
        }
    };

    useEffect(() => {
        fetchSetting();
        fetchFrontSetting();
        fetchTodaySaleOverAllReport();
        fetchHoldLists();
    }, []);

    useEffect(() => {
        if (updateHolList == true) {
            fetchHoldLists();
            setUpdateHoldList(false);
        }
    }, [updateHolList]);

    const setSelectedSalesman = (obj) => {
        setSelectedSalesmanId(obj);
    };

    const warehouses =
        warehouse &&
        warehouse.map((item) => {
            return {
                value: item?.attributes.ware_id,
                label:
                    item.attributes?.warehouseDetails?.first_name +
                    " " +
                    item.attributes?.warehouseDetails?.last_name,
            };
        });

    return (
        <Container className="pos-screen px-3" fluid>
            <TabTitle title="POS" />
            <Row>
                <TopProgressBar />
                <Col lg={5} xxl={4} xs={6} className="pos-left-scs">
                    <div className="mb-3 mt-3 position-relative">
                        <Select
                            placeholder="Choose Warehouse"
                            onChange={handleWarehouseChange}
                            options={warehouses}
                            value={warehouses.find(
                                (w) => w.value == selectedWarehouseIdForDrown
                            )}
                            noOptionsMessage={() =>
                                getFormattedMessage("no-option.label")
                            }
                        />
                    </div>
                    <div className="mb-3 mt-3 position-relative">
                        <Select
                            placeholder="Choose Salesman"
                            value={selectedSalesmanId}
                            onChange={setSelectedSalesman}
                            options={filteredSalesmen.map((item) => ({
                                value: item.salesman_id,
                                label: `${item.sales_man_details?.first_name} ${item.sales_man_details?.last_name}`,
                            }))}
                            noOptionsMessage={() =>
                                getFormattedMessage("no-option.label")
                            }
                        />
                    </div>
                    <div
                        className="mb-3 b-2"
                        // style={{
                        //     backgroundColor: "#fff",
                        // }}
                    >
                        {/* <label htmlFor="datePicker" className="form-label">
                                Assign Date
                            </label> */}
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            dateFormat="dd-MM-yyyy"
                            className="form-control"
                            placeholderText="Select a date"
                            minDate={new Date()}
                        />
                    </div>

                    <div className="d-flex flex-column h-100">
                        <div className="left-content custom-card mb-3 p-3 d-flex flex-column justify-content-between">
                            <div className="main-table overflow-auto">
                                <Table className="mb-0">
                                    <thead className="position-sticky top-0">
                                        <tr>
                                            <th>
                                                <h5>Gifts</h5>
                                            </th>
                                            <th
                                                className={
                                                    cart && cart.length
                                                        ? "text-center"
                                                        : ""
                                                }
                                            >
                                                {getFormattedMessage(
                                                    "pos-qty.title"
                                                )}
                                            </th>
                                            <th className="text-center">
                                                {getFormattedMessage("Actions")}
                                            </th>
                                        </tr>
                                    </thead>
                                    {/* <tbody className="border-0">
                                        {cart && cart.length ? (
                                            cart.map((cartItem, index) => (
                                                <tr key={index}>
                                                    <td>{cartItem.title}</td>
                                                    <td className="text-center">
                                                        {cartItem.quantity || 1}
                                                    </td>
                                                    <td className="text-center">
                                                        <button
                                                            onClick={() =>
                                                                handleIncrement(
                                                                    index
                                                                )
                                                            }
                                                            className="btn btn-sm btn-success me-1"
                                                        >
                                                            +
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDecrement(
                                                                    index
                                                                )
                                                            }
                                                            className="btn btn-sm btn-danger me-1"
                                                            disabled={
                                                                cartItem.quantity <=
                                                                1
                                                            }
                                                        >
                                                            -
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleRemove(
                                                                    index
                                                                )
                                                            }
                                                            className="btn btn-sm btn-danger"
                                                            title="Remove"
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={3}
                                                    className="custom-text-center text-gray-900 fw-bold py-5"
                                                >
                                                    {getFormattedMessage(
                                                        "sale.product.table.no-data.label"
                                                    )}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody> */}
                                    <tbody className="border-0">
                                        {cart && cart.length ? (
                                            cart.map((cartItem, index) => (
                                                <tr key={index}>
                                                    <td>{cartItem.title}</td>
                                                    <td className="text-center">
                                                        {/* Input field for manual quantity entry */}
                                                        <input
                                                            type="number"
                                                            className="form-control text-center"
                                                            value={
                                                                cart[index]
                                                                    ?.quantity ||
                                                                0
                                                            }
                                                            onChange={(e) =>
                                                                handleQuantityChange(
                                                                    index,
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            min="1"
                                                        />
                                                    </td>
                                                    <td className="text-center">
                                                        <button
                                                            onClick={() =>
                                                                handleIncrement(
                                                                    index
                                                                )
                                                            }
                                                            className="btn btn-sm btn-success me-1"
                                                        >
                                                            +
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDecrement(
                                                                    index
                                                                )
                                                            }
                                                            className="btn btn-sm btn-danger me-1"
                                                            disabled={
                                                                cartItem.quantity <=
                                                                1
                                                            }
                                                        >
                                                            -
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleRemove(
                                                                    index
                                                                )
                                                            }
                                                            className="btn btn-sm btn-danger"
                                                            title="Remove"
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={3}
                                                    className="custom-text-center text-gray-900 fw-bold py-5"
                                                >
                                                    {getFormattedMessage(
                                                        "sale.product.table.no-data.label"
                                                    )}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                            {cart && cart.length > 0 && (
                                <div className="text-center">
                                    <button
                                        onClick={handleAssignAllGifts}
                                        className="btn btn-primary"
                                    >
                                        Assign All Gifts
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </Col>
                <Col lg={7} xxl={8} xs={6} className="ps-lg-0 pos-right-scs">
                    <div className="right-content mb-3 d-flex flex-column h-100 mt-2">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <div
                                className="position-relative me-2"
                                style={{ flex: 1 }}
                            >
                                <input
                                    type="text"
                                    className="form-control pe-5"
                                    placeholder="Search gifts..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    style={{
                                        borderRadius: "0.5rem",
                                        borderColor: "#007bff",
                                        boxShadow:
                                            "0 2px 4px rgba(0, 0, 0, 0.1)",
                                        paddingLeft: "40px",
                                        width: "700px",
                                    }}
                                />
                                <span
                                    className="position-absolute"
                                    style={{
                                        top: "50%",
                                        left: "10px",
                                        transform: "translateY(-50%)",
                                        color: "#007bff",
                                        fontSize: "1.2rem",
                                    }}
                                >
                                    <i className="bi bi-search" />
                                </span>
                            </div>
                            <button
                                className="btn"
                                style={{
                                    backgroundColor: "#ff5722",
                                    color: "#fff",
                                }}
                                onClick={() => navigate(-1)}
                            >
                                Back
                            </button>
                        </div>

                        <div className="custom-card h-100 mb-3 mt-3 p-2">
                            <div>
                                <h2>ALL</h2>
                            </div>
                            <div className="row">
                                {filteredsGifts.map((gift) => {
                                    // console.log(
                                    //     " allWarehouse?.id",
                                    //     selectedWarehouseId
                                    // );

                                    const warehouseInventory =
                                        gift.gift_inventories_details.find(
                                            (inventory) =>
                                                inventory.warehouse_id ==
                                                selectedWarehouseId
                                        );

                                    const warehouseQuantity = warehouseInventory
                                        ? warehouseInventory.warehouse_quantities
                                        : 0;

                                    return (
                                        <div
                                            key={gift.id}
                                            className="col-md-3 col-sm-6 mb-3"
                                        >
                                            <div
                                                className={`card h-100 ${
                                                    selectedGifts.includes(
                                                        gift.id
                                                    )
                                                        ? "border border-warning"
                                                        : ""
                                                }`}
                                                style={{
                                                    height: "120px",
                                                    backgroundColor:
                                                        "rgb(227, 239, 247)",
                                                    padding: "10px",
                                                    transition: "border 0.3s",
                                                }}
                                            >
                                                <div
                                                    className="d-flex align-items-center"
                                                    style={{
                                                        height: "60px",
                                                        overflow: "hidden",
                                                    }}
                                                >
                                                    <img
                                                        src={gift.image}
                                                        alt={gift.title}
                                                        className="card-img-top"
                                                        style={{
                                                            height: "60px",
                                                            width: "60px",
                                                            objectFit: "cover",
                                                            borderRadius: "50%",
                                                            marginRight: "10px",
                                                        }}
                                                    />
                                                </div>
                                                <div
                                                    className="card-body d-flex flex-column justify-content-between"
                                                    style={{
                                                        padding: "0.5rem",
                                                        position: "relative",
                                                    }}
                                                >
                                                    <h5
                                                        className="card-title"
                                                        style={{
                                                            fontSize: "1rem",
                                                            color: "#000",
                                                        }}
                                                    >
                                                        {gift.title}
                                                    </h5>

                                                    {/* Display Warehouse Quantity */}
                                                    <p
                                                        className="card-text"
                                                        style={{
                                                            fontSize:
                                                                "0.875rem",
                                                            position:
                                                                "absolute",
                                                            color: "#fff",
                                                            top: "-4.5rem",
                                                            right: "-1.2rem",
                                                            backgroundColor:
                                                                "rgb(80, 167, 253)",
                                                            padding:
                                                                "0.2rem 0.5rem",
                                                            borderRadius:
                                                                "0.25rem",
                                                            zIndex: 1,
                                                        }}
                                                    >
                                                        {`Available: ${warehouseQuantity}`}
                                                    </p>

                                                    <button
                                                        className="btn btn-primary btn-sm mt-auto"
                                                        onClick={() =>
                                                            handleSelectGift(
                                                                gift
                                                            )
                                                        }
                                                    >
                                                        {selectedGifts.includes(
                                                            gift.id
                                                        )
                                                            ? "Selected"
                                                            : "Select"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            {isOpenGiftDetailModal && (
                <GiftDetailModule
                    openGiftDetailModal={openGiftDetailModal}
                    giftModelId={selectedGift?.id}
                    onClickUpdateGiftInCart={onClickUpdateGiftInCart}
                    isOpenGiftDetailModal={isOpenGiftDetailModal}
                    cartGift={selectedGift}
                />
            )}
            {modalShowCustomer && (
                <CustomerForm
                    show={modalShowCustomer}
                    hide={setModalShowCustomer}
                />
            )}
        </Container>
    );
};

const mapStateToProps = (state) => {
    const {
        posAllProducts,
        frontSetting,
        settings,
        cashPayment,
        allConfigData,
        posAllTodaySaleOverAllReport,
        holdListData,
    } = state;
    return {
        holdListData,
        posAllProducts,
        frontSetting,
        settings,
        paymentDetails: cashPayment,
        customCart: prepareCartArray(posAllProducts),
        allConfigData,
        posAllTodaySaleOverAllReport,
    };
};

export default connect(mapStateToProps, {
    fetchSetting,
    fetchFrontSetting,
    posSearchNameProduct,
    posCashPaymentAction,
    posSearchCodeProduct,
    posAllProduct,
    fetchBrandClickable,
    fetchHoldLists,
})(PosLoadGift);
