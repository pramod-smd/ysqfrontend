import React, { useEffect, useState } from "react";
import MasterLayout from "../MasterLayout";
import Select from "react-select";
import { connect } from "react-redux";
import { fetchAreas } from "../../store/action/areaAction";
import { AreaList } from "../../store/action/areaAction";
import { useNavigate } from "react-router-dom";
import { addSubArea } from "../../store/action/subAreaAction";

const AddSubArea = (props) => {
    const { areas, addSubArea, AreaList } = props;
    const [subArea, setSubArea] = useState("");
    const [selectedArea, setSelectedArea] = useState(null);
    const [status, setStatus] = useState(null);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        AreaList();
    }, [AreaList]);

    const areaOptions = areas.map((area) => ({
        value: area.id,
        label: area.name,
    }));

    const statusOptions = [
        { value: "1", label: "Active" },
        { value: "0", label: "Inactive" },
    ];

    const validate = () => {
        let validationErrors = {};

        if (!subArea.trim()) {
            validationErrors.subArea = "Sub-Area name is required.";
        } else if (!/^[a-zA-Z0-9\s]+$/.test(subArea)) {
            validationErrors.subArea = "Sub-Area name can only contain letters, digits, and spaces.";
        }

        if (!selectedArea) {
            validationErrors.selectedArea = "Please select an area.";
        }

        if (!status) {
            validationErrors.status = "Please select a status.";
        }

        setErrors(validationErrors);

        return Object.keys(validationErrors).length === 0;
    };



    const handleSubmit = (event) => {
        event.preventDefault();

        if (!validate()) return;

        const data = {
            sub_area_name: subArea,
            area_id: selectedArea.value,
            status: status.value,
        };

        addSubArea(data, navigate);
    };

    return (
        <MasterLayout>
            <div className="d-flex justify-content-end">
                <button
                    className="btn"
                    onClick={() => navigate("/app/sub-area")}
                    style={{ backgroundColor: "#ff5722", color: "white" }}
                >
                    Back
                </button>
            </div>

            <h1>Add Sub-Area</h1>

            <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                    <label htmlFor="areaSelect">Select Area</label>
                    <Select
                        id="areaSelect"
                        options={areaOptions}
                        value={selectedArea}
                        onChange={(selectedOption) =>
                            setSelectedArea(selectedOption)
                        }
                        placeholder="Search and select an area"
                        isSearchable
                        className={errors.selectedArea ? "is-invalid" : ""}
                    />
                    {errors.selectedArea && (
                        <div className="text-danger mt-1">
                            {errors.selectedArea}
                        </div>
                    )}
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="subAreaInput">Sub-Area Name</label>
                    <input
                        type="text"
                        id="subAreaInput"
                        className={`form-control ${
                            errors.subArea ? "is-invalid" : ""
                        }`}
                        placeholder="Enter sub-area name"
                        value={subArea}
                        onChange={(e) => setSubArea(e.target.value)}
                    />
                    {errors.subArea && (
                        <div className="invalid-feedback">{errors.subArea}</div>
                    )}
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="statusSelect">Select Status</label>
                    <Select
                        id="statusSelect"
                        options={statusOptions}
                        value={status}
                        onChange={(selectedOption) => setStatus(selectedOption)}
                        placeholder="Select a status"
                        className={errors.status ? "is-invalid" : ""}
                    />
                    {errors.status && (
                        <div className="text-danger mt-1">{errors.status}</div>
                    )}
                </div>

                <div className="d-flex justify-content-end">
                    <button
                        type="submit"
                        className="btn btn-primary"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const { areas } = state;
    return { areas };
};

export default connect(mapStateToProps, { AreaList, addSubArea })(AddSubArea);
