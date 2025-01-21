import React, { useEffect, useState } from "react";
import ModelFooter from "../../shared/components/modelFooter";
import { fetchDistributorsList } from "../../store/action/userAction";
import { connect } from "react-redux";
import Select from "react-select";

function Inputs(props) {
    const { AddQuestionAndOption, fetchDistributorsList, distributors } = props;

    const [inputList, setInputList] = useState([{ option: "" }]);
    const [selectedDistributor, setSelectedDistributor] = useState(null);
    const [warehouseOptions, setWarehouseOptions] = useState([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [formValue, setFormValue] = useState({
        question: "",
        option: "",
        status: "",
        type: "",
        distributor: null,
        warehouse: null,
    });

    const [errors, setErrors] = useState({
        question: "",
        option: "",
        status: "",
        type: "",
    });

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...inputList];
        list[index][name] = value;
        setInputList(list);
    };

    const onChangeInput = (e) => {
        e.preventDefault();
        setFormValue((inputs) => ({
            ...inputs,
            [e.target.name]: e.target.value,
        }));
        setErrors("");
    };

    useEffect(() => {
        fetchDistributorsList();
    }, []);

    useEffect(() => {
        if (selectedDistributor) {
            const warehouses = selectedDistributor.warehouse?.map((w) => ({
                value: w.id,
                label: w.name,
            }));
            setWarehouseOptions(warehouses || []);
        } else {
            console.log(
                "No distributor selected, resetting warehouse options."
            );
            setWarehouseOptions([]);
        }
        setSelectedWarehouse(null);
    }, [selectedDistributor]);

    const distributorOptions = distributors.map((distributor) => ({
        value: distributor.id,
        label: `${distributor?.attributes?.first_name} ${distributor?.attributes?.last_name}`,
        warehouse: distributor?.attributes?.warehouse,
    }));

    const handleValidation = () => {
        let errorss = {};
        let isValid = false;

        if (!formValue["question"].trim()) {
            errorss["question"] = "Please enter a question";
        }

        if (!formValue["status"].trim()) {
            errorss["status"] = "Please select a status";
        }

        if (!formValue["type"].trim()) {
            errorss["type"] = "Please select a question type";
        }

        if (
            inputList.length > 0 &&
            formValue["type"].trim() != "short_description"
        ) {
            inputList.forEach((item) => {
                if (item.option === "") {
                    errorss["option"] = "All Option fields are required";
                } else {
                    isValid = true;
                }
            });
        } else {
            isValid = true;
        }

        setErrors(errorss);
        return isValid;
    };

    const onSubmit = (event) => {
        event.preventDefault();
        const valid = handleValidation();
        if (valid) {
            formValue.option = inputList;
            setFormValue(formValue);
            console.log(formValue);
            AddQuestionAndOption(formValue);
            clearField();
        }
    };

    const clearField = () => {
        setFormValue({
            question: "",
            option: "",
            status: "",
            type: "",
        });
        setErrors("");
    };

    const handleRemoveClick = (index) => {
        const list = [...inputList];
        const remove = list.filter(
            (_, indexFilter) => !(indexFilter === index)
        );
        setInputList(remove);
    };

    const handleAddClick = () => {
        setInputList([...inputList, { option: "" }]);
    };

    return (
        <div className="row">
            {/* question type */}
            <div className="col-md-12 mb-3">
                <label className="form-label">Question Type</label>
                <select
                    name="type"
                    className="form-select"
                    onChange={onChangeInput}
                    value={formValue.type}
                >
                    <option value="">Select Question Type</option>
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="single_choice">Single Choice</option>
                    <option value="short_description">Short Description</option>
                </select>
                <span className="text-danger d-block fw-400 fs-small mt-2">
                    {errors["type"] ? errors["type"] : null}
                </span>
            </div>
            {/* question status */}
            <div className="col-md-12 mb-3">
                <label className="form-label">Status</label>
                <select
                    name="status"
                    className="form-select"
                    onChange={onChangeInput}
                    value={formValue.status}
                >
                    <option value="">Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
                <span className="text-danger d-block fw-400 fs-small mt-2">
                    {errors["status"] ? errors["status"] : null}
                </span>
            </div>
            {/* distributor dropdown */}
            <div className="form-group col-md-12 mb-3">
                <label htmlFor="areaSelect">Select Distributor</label>
                <Select
                    id="distributorSelect"
                    options={distributorOptions}
                    value={selectedDistributor}
                    onChange={(selectedOption) => {
                        setSelectedDistributor(selectedOption);
                        setFormValue((prevFormValue) => ({
                            ...prevFormValue,
                            distributor: selectedOption,
                        }));
                    }}
                    placeholder="Search and select distributors"
                    isSearchable
                    className={errors.selectedDistributor ? "is-invalid" : ""}
                />
                {errors.selectedDistributor && (
                    <div className="text-danger mt-1">
                        {errors.selectedDistributor}
                    </div>
                )}
            </div>
            {/* warehouse dropdown */}
            <div className="form-group col-md-12 mb-3">
                <label htmlFor="warehouseSelect">Select Warehouse</label>
                <Select
                    id="warehouseSelect"
                    options={warehouseOptions}
                    value={selectedWarehouse}
                    onChange={(selectedOption) => {
                        setSelectedWarehouse(selectedOption);
                        setFormValue((prevFormValue) => ({
                            ...prevFormValue,
                            warehouse: selectedOption,
                        }));
                    }}
                    placeholder="Search and select warehouses"
                    isSearchable
                    className={errors.selectedWarehouse ? "is-invalid" : ""}
                />
                {errors.selectedWarehouse && (
                    <div className="text-danger mt-1">
                        {errors.selectedWarehouse}
                    </div>
                )}
            </div>
            {/* add questions */}
            <div className="col-md-12 mb-3">
                <label className="form-label">Question</label>
                <input
                    type="text"
                    name="question"
                    className="form-control"
                    placeholder="Question"
                    onChange={onChangeInput}
                    value={formValue.question}
                />
                <span className="text-danger d-block fw-400 fs-small mt-2">
                    {errors["question"] ? errors["question"] : null}
                </span>
            </div>

            {/* <h3>Options</h3>
            <span className="text-danger d-block fw-400 fs-small mt-2">
                {errors["option"] ? errors["option"] : null}
            </span>
            {inputList.map((x, i) => {
                return (
                    <div className="row" key={i}>
                        <div className="col-sm-8">
                            <input
                                className="form-control mb-2"
                                name="option"
                                placeholder="Option"
                                value={x.option}
                                type="text"
                                onChange={(e) => handleInputChange(e, i)}
                            />
                        </div>
                        <div className="btn-box col-sm-4 mb-2">
                            {inputList.length !== 1 && (
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => handleRemoveClick(i)}
                                >
                                    Remove
                                </button>
                            )}
                            {inputList.length - 1 === i && (
                                <button
                                    type="button"
                                    className="btn btn-success m-1"
                                    onClick={handleAddClick}
                                >
                                    Add
                                </button>
                            )}
                        </div>
                    </div>
                );
            })} */}
            {formValue.type !== "short_description" && (
                <>
                    <h3>Options</h3>
                    <span className="text-danger d-block fw-400 fs-small mt-2">
                        {errors["option"] ? errors["option"] : null}
                    </span>
                    {inputList.map((x, i) => {
                        return (
                            <div className="row" key={i}>
                                <div className="col-sm-8">
                                    <input
                                        className="form-control mb-2"
                                        name="option"
                                        placeholder="Option"
                                        value={x.option}
                                        type="text"
                                        onChange={(e) =>
                                            handleInputChange(e, i)
                                        }
                                    />
                                </div>
                                <div className="btn-box col-sm-4 mb-2">
                                    {inputList.length !== 1 && (
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={() => handleRemoveClick(i)}
                                        >
                                            Remove
                                        </button>
                                    )}
                                    {inputList.length - 1 === i && (
                                        <button
                                            type="button"
                                            className="btn btn-success m-1"
                                            onClick={handleAddClick}
                                        >
                                            Add Another Option
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </>
            )}
            <ModelFooter
                onSubmit={onSubmit}
                addDisabled={
                    // !formValue.question ||
                    !formValue.status ||
                    !formValue.type ||
                    inputList.length === 0
                }
                link="/app/question"
            />
        </div>
    );
}

const mapStateToProps = (state) => {
    const { distributors } = state;
    return { distributors };
};

export default connect(mapStateToProps, { fetchDistributorsList })(Inputs);
