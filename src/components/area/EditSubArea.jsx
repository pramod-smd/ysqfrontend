import React, { useState, useEffect } from "react";
import MasterLayout from "../MasterLayout";
import Select from "react-select";
import { connect } from "react-redux";
import TabTitle from "../../shared/tab-title/TabTitle";
import { useNavigate, useParams } from "react-router-dom";
import {
    fetchSubAreaDetails,
    updateSubAreaName,
} from "../../store/action/subAreaAction";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import { AreaList } from "../../store/action/areaAction";

const EditSubArea = ({
    fetchSubAreaDetails,
    AreaList,
    subAreasDetails,
    areas,
    updateSubAreaName,
}) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [subAreaName, setSubAreaName] = useState("");
    const [selectedArea, setSelectedArea] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [errors, setErrors] = useState("");

    useEffect(() => {
        if (id) {
            fetchSubAreaDetails(id);
        }
        AreaList();
    }, [id, fetchSubAreaDetails, AreaList]);

    useEffect(() => {
        if (subAreasDetails) {
            setSubAreaName(subAreasDetails.sub_area_name || "");
            const area = areas.find(
                (area) => area.id === subAreasDetails.area_id
            );
            setSelectedArea(area ? { value: area.id, label: area.name } : null);
            setSelectedStatus(
                subAreasDetails.status === 1
                    ? { value: "1", label: "Active" }
                    : { value: "0", label: "Inactive" }
            );
        }
    }, [subAreasDetails, areas]);

    const areaOptions = areas.map((area) => ({
        value: area.id,
        label: area.name,
    }));

    const statusOptions = [
        { value: "1", label: "Active" },
        { value: "0", label: "Inactive" },
    ];

    const handleChange = (e) => {
        setSubAreaName(e.target.value);
        if (errors) {
            setErrors("");
        }
    };

    const validate = () => {
        let validationErrors = {};


        if (!subAreaName.trim()) {
            validationErrors.subAreaName = "Sub-area name is required.";
        } else if (!/^[a-zA-Z0-9\s]+$/.test(subAreaName)) {
            validationErrors.subAreaName =
                "Sub-area name can only contain letters, digits, and spaces.";
        }

        if (!selectedArea) {
            validationErrors.selectedArea = "Please select an area.";
        }

        if (!selectedStatus) {
            validationErrors.selectedStatus = "Please select a status.";
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const updatedData = {
            id,
            sub_area_name: subAreaName,
            area_id: selectedArea.value,
            status: selectedStatus.value,
        };

        updateSubAreaName(updatedData);
        navigate("/app/sub-area");
    };

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title="Edit Sub Area" />

            <div className="d-flex justify-content-end">
                <button
                    className="btn"
                    onClick={() => navigate("/app/sub-area")}
                    style={{ backgroundColor: "#ff5722", color: "white" }}
                >
                    Back
                </button>
            </div>

            <h1>Edit Sub-Area</h1>

            <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                    <label htmlFor="areaSelect">Select Area</label>
                    <Select
                        id="areaSelect"
                        options={areaOptions}
                        value={selectedArea}
                        onChange={(option) => setSelectedArea(option)}
                        placeholder="Search and select an area"
                        isSearchable
                        classNamePrefix="select"
                    />
                    {errors.selectedArea && (
                        <div className="text-danger mt-1">
                            {errors.selectedArea}
                        </div>
                    )}
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="subAreaName">Sub-Area Name</label>
                    <input
                        type="text"
                        id="subAreaName"
                        className={`form-control ${
                            errors.subAreaName ? "is-invalid" : ""
                        }`}
                        value={subAreaName}
                        onChange={handleChange}
                        placeholder="Enter sub-area name"
                    />
                    {errors.subAreaName && (
                        <div className="invalid-feedback">
                            {errors.subAreaName}
                        </div>
                    )}
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="statusSelect">Status</label>
                    <Select
                        id="statusSelect"
                        options={statusOptions}
                        value={selectedStatus}
                        onChange={(option) => setSelectedStatus(option)}
                        placeholder="Select status"
                        isSearchable
                        classNamePrefix="select"
                    />
                    {errors.selectedStatus && (
                        <div className="text-danger mt-1">
                            {errors.selectedStatus}
                        </div>
                    )}
                </div>

                <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary">
                        Update
                    </button>
                </div>
            </form>
        </MasterLayout>
    );
};

const mapStateToProps = (state) => ({
    subAreasDetails: state.subAreasDetails,
    areas: state.areas,
});

const mapDispatchToProps = {
    fetchSubAreaDetails,
    AreaList,
    updateSubAreaName,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditSubArea);
