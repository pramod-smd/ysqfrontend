import React, { useState, createRef, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
    getFormattedMessage,
    placeholderText,
    decimalValidate,
} from "../../shared/sharedMethod";
import MasterLayout from "../MasterLayout";
import HeaderTitle from "../header/HeaderTitle";
import ModelFooter from "../../shared/components/modelFooter";
import { fetchRegions } from "../../store/action/regionAction";
import { fetchArea, editArea } from "../../store/action/areaAction";

const EditArea = (props) => {
    const { regions, fetchRegions, fetchArea, areas, editArea } = props;
    const { id } = useParams();
    const innerRef = createRef();
    const [formValue, setFormValue] = useState({
        name: "",
        region_id: "",
        status: "1", // Default to Active (1)
    });

    useEffect(() => {
        fetchArea(id);
        fetchRegions();
    }, []);

    useEffect(() => {
        if (areas) {
            setFormValue({
                name: areas ? areas[0]?.name : "",
                region_id: areas ? areas[0]?.region_id : "",
                status: areas ? areas[0]?.status?.toString() : "1",
                id: areas ? areas[0]?.id : "",
            });
        }
    }, [areas]);

    const [errors, setErrors] = useState({
        status: "",
        name: "",
    });
    const navigate = useNavigate();

    const handleValidation = () => {
        let errorss = {};
        let isValid = true;

        const nameRegex = /^[A-Za-z0-9\s]+$/;

        if (!formValue["name"].trim()) {
            errorss["name"] = "Please enter a name.";
            isValid = false;
        } else if (!nameRegex.test(formValue["name"])) {
            errorss["name"] =
                "Name contains invalid characters. Only letters, spaces, digits are allowed.";
            isValid = false;
        }

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
            editArea(formValue, navigate);
            clearField(false);
        }
    };

    const clearField = () => {
        setFormValue({
            name: "",
            region_id: "",
            status: "1",
        });
        setErrors("");
    };

    return (
        <MasterLayout>
            <HeaderTitle title="Edit Area" to="/app/area" />
            <Form>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">
                            Please select region
                        </label>
                        <span className="required" />
                        <select
                            className="form-control"
                            name="region_id"
                            value={formValue.region_id}
                            onChange={(e) => onChangeInput(e)}
                        >
                            <option value="">Please select region</option>
                            {regions &&
                                regions.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
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
    const { areas, regions } = state;
    return { areas, regions };
};

export default connect(mapStateToProps, { editArea, fetchArea, fetchRegions })(
    EditArea
);
