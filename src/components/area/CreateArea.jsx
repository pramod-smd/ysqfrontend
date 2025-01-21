import React, { useState, createRef, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    getFormattedMessage,
    placeholderText,
    decimalValidate,
} from "../../shared/sharedMethod";
import { fetchRegionsAll } from "../../store/action/regionAction";
import MasterLayout from "../MasterLayout";
import HeaderTitle from "../header/HeaderTitle";
import ModelFooter from "../../shared/components/modelFooter";
import { addArea } from "../../store/action/areaAction";
import { name } from "faker/lib/locales/az";

const CreateArea = (props) => {
    const { addArea, regions, fetchRegionsAll } = props;
    const innerRef = createRef();
    const [formValue, setFormValue] = useState({
        name: "",
        region_id: "",
        status: "1",
    });

    const [errors, setErrors] = useState({
        name: "",
        region_id: "",
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchRegionsAll();
    }, []);

    const handleValidation = () => {
        let errorss = {};
        let isValid = true;

        const nameRegex = /^[A-Za-z0-9\s]+$/;

        // Validate name
        if (!formValue["name"].trim()) {
            errorss["name"] = "Please enter a name.";
            isValid = false;
        } else if (!nameRegex.test(formValue["name"])) {
            errorss["name"] =
                "Name contains invalid characters. Only letters, spaces, digits are allowed.";
            isValid = false;
        }

        // Validate region_id
        if (!formValue["region_id"].trim()) {
            errorss["region_id"] = "Please select a region.";
            isValid = false;
        }

        setErrors(errorss);
        return isValid;
    };

    const onChangeInput = (e) => {
        e.preventDefault();
        setFormValue((inputs) => ({
            ...inputs,
            [e.target.name]: e.target.value,
        }));
        setErrors("");
    };

    const onSubmit = (event) => {
        event.preventDefault();
        const valid = handleValidation();
        if (valid) {
            setFormValue(formValue);
            addArea(formValue, navigate);
            clearField(false);
        }
    };

    const clearField = () => {
        setFormValue({
            status: "",
            name: "",
            status: "1",
        });
        setErrors("");
    };

    return (
        <MasterLayout>
            <HeaderTitle title="Add Area" to="/app/area" />
            <Form>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">
                            Please select region
                        </label>
                        <span className="required" />
                        <select
                            className="form-control"
                            autoFocus={true}
                            name="region_id"
                            value={formValue?.region_id}
                            onChange={(e) => onChangeInput(e)}
                        >
                            <option value="">Please select region</option>
                            {regions &&
                                regions.map((item) => (
                                    <option key={item.id} value={item?.id}>
                                        {item?.name}
                                    </option>
                                ))}
                        </select>

                        <span className="text-danger d-block fw-400 fs-small mt-2">
                            {errors["region_id"] ? errors["region_id"] : null}
                        </span>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Area Name</label>
                        <span className="required" />
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="Enter Area Name"
                            onChange={(e) => onChangeInput(e)}
                            value={formValue.name}
                        />
                        <span className="text-danger d-block fw-400 fs-small mt-2">
                            {errors["name"] ? errors["name"] : null}
                        </span>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Status</label>
                        <span className="required" />
                        <select
                            className="form-control"
                            name="status"
                            value={formValue.status}
                            onChange={(e) => onChangeInput(e)}
                        >
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                        <span className="text-danger d-block fw-400 fs-small mt-2">
                            {errors["status"] ? errors["status"] : null}
                        </span>
                    </div>
                    <ModelFooter
                        onSubmit={onSubmit}
                        addDisabled={!formValue.name}
                        link="/app/area"
                    />
                </div>
            </Form>
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const { regions } = state;
    return { regions };
};
export default connect(mapStateToProps, { fetchRegionsAll, addArea })(CreateArea);
