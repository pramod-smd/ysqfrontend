import React, { useState, useEffect, useDebugValue } from "react";
import MasterLayout from "../MasterLayout";
import Form from "react-bootstrap/Form";
import { connect } from "react-redux";
import { fetchSalesmans } from "../../store/action/salesmanAction";
import { AreaList } from "../../store/action/areaAction";
// import { fetchAllCustomer } from "../../store/action/customerAction";
import { fetchAllCustomerList } from "../../store/action/customerAction";
import ModelFooter from "../../shared/components/modelFooter";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { assignCustomer } from "../../store/action/assignCustomerAction";
import { useNavigate } from "react-router";
import axiosApi from "../../config/apiConfig";
import { Tokens } from "../../constants";
import moment from "moment";
import Select from "react-select";
import { fetchSubAreas } from "../../store/action/subAreaAction";
import { addToast } from "../../store/action/toastAction";
import { useDispatch } from "react-redux";

const AssignCustomer = (props) => {
    const {
        salesmans,
        areas,
        customers,
        AreaList,
        // fetchAllCustomer,
        fetchAllCustomerList,
        assignCustomer,
        fetchSubAreas,
        subAreas,
    } = props;

    const [distributors, setDistributors] = useState([]);
    const [salesman, setSalesman] = useState([]);
    const [selectedDistributor, setSelectedDistributor] = useState("");
    const [selectedWarehouse, setSelectedWarehouse] = useState("");
    const [selectedArea, setSelectedArea] = useState("");
    const [filteredSalesmen, setFilteredSalesmen] = useState([]);
    const [selectedSalesman, setSelectedSalesman] = useState("");
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableWarehouses, setAvailableWarehouses] = useState([]);
    const [subareas, setSubareas] = useState([]);
    const [filteredSubareas, setFilteredSubareas] = useState([]);
    const [selectedSubareas, setSelectedSubareas] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllDistributors = async () => {
            try {
                const token = localStorage.getItem(Tokens.ADMIN);
                const response = await axiosApi.get("distributor-list", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                setDistributors(response.data.data);
            } catch (error) {
                console.error("Error fetching all distributors:", error);
            }
        };
        fetchAllDistributors();
    }, []);

    useEffect(() => {
        const fetchAllSalesMan = async () => {
            try {
                const token = localStorage.getItem(Tokens.ADMIN);
                const response = await axiosApi.get("show-salesman", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                setSalesman(response.data);
            } catch (error) {
                console.error("Error fetching all salesman:", error);
            }
        };
        fetchAllSalesMan();
    }, []);

    useEffect(() => {
        AreaList();
        // fetchAllCustomer();
        fetchAllCustomerList();
        fetchSubAreas();
    }, [AreaList, fetchAllCustomerList, fetchSubAreas]);


    useEffect(() => {
        if (selectedArea) {
            // console.log("selected sub area:", selectedArea);
            const filtered = subAreas.filter(
                (subarea) => subarea.area_id === parseInt(selectedArea)
            );
            setFilteredSubareas(filtered);
        } else {
            setFilteredSubareas([]);
        }
    }, [selectedArea, subAreas]);

    // const handleSubareaSelect = (subareaId) => {
    //     setSelectedSubareas((prevSelected) => {
    //         const updatedSelectedSubareas = prevSelected.includes(subareaId)
    //             ? prevSelected.filter((id) => id !== subareaId)
    //             : [...prevSelected, subareaId];

    //         const stringUpdatedSelectedSubareas = updatedSelectedSubareas.map(
    //             (id) => String(id)
    //         );

    //         const filtered = customers.filter((customer) => {
    //             const subAreaId = customer.attributes.sub_area_id;
    //             if (!subAreaId) {
    //                 return false;
    //             }

    //             const isCustomerInSelectedSubarea =
    //                 stringUpdatedSelectedSubareas.includes(subAreaId);
    //             return isCustomerInSelectedSubarea;
    //         });

    //         setFilteredCustomers(filtered);
    //         return updatedSelectedSubareas;
    //     });
    // };

    const handleSubareaSelect = (subareaId) => {
        setSelectedSubareas((prevSelected) => {
            const updatedSelectedSubareas = prevSelected.includes(subareaId)
                ? prevSelected.filter((id) => id !== subareaId)
                : [...prevSelected, subareaId];

            const stringUpdatedSelectedSubareas = updatedSelectedSubareas.map((id) => String(id));

            // console.log("Updated Selected Subareas:", stringUpdatedSelectedSubareas);

            const filtered = customers.filter((customer) => {
                const subAreaId = customer?.attributes?.sub_area_id;
                const assignCustomerList = customer?.attributes?.assignCustomerList || [];
                if (!subAreaId) {
                    console.log("Skipping customer due to missing subarea");
                    return false;
                }

                const selectedDateFormatted = moment(selectedDate).startOf("day").format("YYYY-MM-DD");

                const isCustomerInSelectedSubarea =
                    stringUpdatedSelectedSubareas.includes(subAreaId);

                // console.log("Is Customer in Selected Subarea:", isCustomerInSelectedSubarea);


                let isAlreadyAssigned = false;

                assignCustomerList.forEach((assignment) => {
                    const assignedDateFormatted = moment(assignment.assigned_date).startOf("day").format("YYYY-MM-DD");

                    // console.log("Assigned Date (Formatted):", assignedDateFormatted);
                    if (assignedDateFormatted === selectedDateFormatted) {
                        console.log("Customer already assigned to this subarea on the selected date.");
                        isAlreadyAssigned = true;
                    }
                });

                // console.log("Is Customer Already Assigned on Selected Date:", isAlreadyAssigned);
                return isCustomerInSelectedSubarea && !isAlreadyAssigned;
            });

            // console.log("Filtered Customers:", filtered);

            setFilteredCustomers(filtered);
            return updatedSelectedSubareas;
        });
    };




    const handleCustomerSelect = (customerId) => {
        setSelectedCustomers((prev) => {
            if (prev.includes(customerId)) {
                return prev.filter((id) => id !== customerId);
            }
            return [...prev, customerId];
        });
    };
    const handleDistributorChange = (e) => {
        const distributorId = e;
        setSelectedDistributor(distributorId);
        setSelectedWarehouse("");
        setFilteredSalesmen([]);
        setFilteredCustomers([]);
        setSelectedCustomers([]);
        setFilteredSubareas([]);
        const selectedDistributorDetails = distributors.find(
            (d) => d.id === parseInt(distributorId)
        );

        if (selectedDistributorDetails) {
            const warehouses = selectedDistributorDetails.attributes.warehouse;
            setAvailableWarehouses(warehouses);
        } else {
            setAvailableWarehouses([]);
        }
    };

    const handleWarehouseChange = (e) => {
        setFilteredSalesmen([]);
        setFilteredCustomers([]);
        const warehouseId = e.target.value;
        const area = e.target.selectedOptions[0].getAttribute("data-area");
        setSelectedArea(area);
        setSelectedWarehouse(warehouseId);
        setFilteredSalesmen(
            salesman.filter((item) => item?.ware_id == warehouseId)
        );
        // setFilteredCustomers(
        //     customers.filter((customer) => customer.attributes.area_id === area)
        // );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedCustomers.length === 0) {
            dispatch(
                addToast({
                    text: "select at least 1 customer",
                    type: "error",
                })
            );
            return;
        }

        const data = {
            area_id: selectedArea,
            salesman_id: selectedSalesman,
            customers: selectedCustomers,
            assigned_date: moment(selectedDate).format("YYYY-MM-DD"),
            distributor_id: selectedDistributor,
            warehouse_id: selectedWarehouse,
            assign_by: 1,
            sub_area_ids: selectedSubareas,
        };
        try {
            await assignCustomer(data);
            clearFields();
            navigate("#/app/assign-customer-list");
        } catch (error) {
            console.error("Error assigning customers:", error);
        }
    };
    const clearFields = () => {
        setSelectedDistributor("");
        setSelectedWarehouse("");
        setSelectedArea("");
        setSelectedSalesman("");
        setSelectedCustomers([]);
        setSelectedDate(null);
        setFilteredSalesmen([]);
    };

    function dateSelect(e) {
        setSelectedDistributor([]);
        setAvailableWarehouses([]);
        setFilteredSalesmen([]);
        setFilteredCustomers([]);
        const filterDate = moment(e).format("YYYY-MM-DD");
        fetchAllCustomerList(filterDate);
    }

    const distributorOptions = distributors.map((distributor) => ({
        value: distributor.id,
        label: `${distributor.attributes?.first_name} ${distributor.attributes?.last_name}`,
    }));

    return (
        <MasterLayout>
            <div className="container mt-4">
                <h2 className="mb-4">Assign Customers To Salesman</h2>
                <Form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Select Trip Date:</label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            onSelect={dateSelect}
                            dateFormat="dd-MM-yyyy"
                            className="form-control"
                            placeholderText="Select a date"
                            minDate={new Date()}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="distributor" className="form-label">
                            Select Distributor:
                        </label>
                        <Select
                            id="distributor"
                            options={distributorOptions}
                            value={
                                distributorOptions.find(
                                    (option) =>
                                        option.value === selectedDistributor
                                ) || null
                            }
                            onChange={(selectedOption) =>
                                handleDistributorChange(
                                    selectedOption?.value || ""
                                )
                            }
                            placeholder="Select a distributor"
                            isClearable
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="warehouse" className="form-label">
                            Select Warehouse:
                        </label>
                        <select
                            id="warehouse"
                            className="form-select"
                            value={selectedWarehouse}
                            onChange={handleWarehouseChange}
                            disabled={!availableWarehouses.length}
                        >
                            <option value="">Select a warehouse</option>
                            {availableWarehouses.map((warehouse) => (
                                <option
                                    key={warehouse.id}
                                    value={warehouse.ware_id}
                                    data-area={warehouse.area}
                                >
                                    {warehouse.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="salesman" className="form-label">
                            Select Salesman:
                        </label>
                        <select
                            id="salesman"
                            className="form-select"
                            value={selectedSalesman}
                            onChange={(e) =>
                                setSelectedSalesman(e.target.value)
                            }
                            disabled={!filteredSalesmen.length}
                        >
                            <option value="">Select a salesman</option>
                            {filteredSalesmen &&
                                filteredSalesmen.map((salesman) => (
                                    <option
                                        key={salesman.salesman_id}
                                        value={salesman.salesman_id}
                                    >
                                        {salesman?.sales_man_details
                                            ?.first_name +
                                            " " +
                                            salesman?.sales_man_details
                                                ?.last_name}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="area" className="form-label">
                            Area:
                        </label>
                        <select
                            id="area"
                            className="form-select"
                            value={selectedArea}
                            onChange={(e) => setSelectedArea(e.target.value)}
                            disabled
                        >
                            <option value="">salesman area</option>
                            {areas.map((area) => (
                                <option key={area.id} value={area.id}>
                                    {area.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* subarea section */}
                    {filteredSubareas.length > 0 && (
                        <div className="mb-3">
                            <label className="form-label">
                                Subareas in Selected Area:
                            </label>
                            <ul className="list-group">
                                {filteredSubareas.map((subarea) => (
                                    <li
                                        key={subarea.id}
                                        className="list-group-item"
                                    >
                                        <Form.Check
                                            type="checkbox"
                                            id={`subarea-${subarea.id}`}
                                            label={subarea.sub_area_name}
                                            checked={selectedSubareas.includes(
                                                subarea.id
                                            )}
                                            onChange={() =>
                                                handleSubareaSelect(subarea.id)
                                            }
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {selectedArea && (
                        <div className="mb-3">
                            <label className="form-label">
                                Customers in Selected Subareas:
                            </label>
                            <ul className="list-group">
                                {filteredCustomers.length > 0 ? (
                                    filteredCustomers.map((customer) => (
                                        <li
                                            key={customer.id}
                                            className="list-group-item"
                                        >
                                            <Form.Check
                                                type="checkbox"
                                                id={`customer-${customer.id}`}
                                                label={`${customer.attributes.name} - ${customer.attributes.email}`}
                                                checked={selectedCustomers.includes(
                                                    customer.id
                                                )}
                                                onChange={() =>
                                                    handleCustomerSelect(
                                                        customer.id
                                                    )
                                                }
                                            />
                                        </li>
                                    ))
                                ) : (
                                    <li className="list-group-item">
                                        No customers found for the selected
                                        subareas.
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}

                    <ModelFooter
                        onSubmit={handleSubmit}
                        addDisabled={
                            !selectedSalesman ||
                            !selectedArea ||
                            !selectedDate ||
                            !selectedCustomers ||
                            !filteredCustomers
                        }
                        link="/app/assign-customer-list"
                    />
                </Form>
            </div>
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const { areas, customers, subAreas } = state;
    return { areas, customers, subAreas };
};

export default connect(mapStateToProps, {
    AreaList,
    // fetchAllCustomer,
    fetchAllCustomerList,
    assignCustomer,
    fetchSubAreas,
})(AssignCustomer);
