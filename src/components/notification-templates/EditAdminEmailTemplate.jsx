import React, { useState, useEffect } from "react";
import MasterLayout from "../MasterLayout";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
    fetchAdminEmailTemplateDetails,
    updateAdminEmailTemplate,
} from "../../store/action/emailTemplatesAction";

const EditAdminEmailTemplate = (props) => {
    const {
        fetchAdminEmailTemplateDetails,
        updateAdminEmailTemplate,
        emailTemplates,
    } = props;
    const { id } = useParams();
    const navigate = useNavigate();

    const [templateData, setTemplateData] = useState({
        template_name: "",
        template_type: "",
        content: "",
        status: "",
    });

    const [errors, setErrors] = useState({
        template_name: "",
        template_type: "",
        content: "",
        status: "",
    });

    useEffect(() => {
        if (id) {
            fetchAdminEmailTemplateDetails(id);
        }
    }, [id, fetchAdminEmailTemplateDetails]);

    useEffect(() => {
        if (emailTemplates) {
            setTemplateData({
                template_name: emailTemplates?.template_name || "",
                template_type: emailTemplates?.template_type || "",
                content: emailTemplates?.content || "",
                status: emailTemplates?.status?.toString() || "",
            });
        }
    }, [emailTemplates]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTemplateData({ ...templateData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            updateAdminEmailTemplate({ ...templateData, id }, navigate);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!templateData.template_name) {
            newErrors.template_name = "Template name is required.";
        } else if (!/^[a-zA-Z0-9 ]+$/.test(templateData.template_name)) {
            newErrors.template_name =
                "Template name can only contain letters, numbers, and spaces.";
        }

        if (!templateData.template_type) {
            newErrors.template_type = "Template type is required.";
        } else if (!/^[a-zA-Z0-9 ]+$/.test(templateData.template_type)) {
            newErrors.template_type =
                "Template type can only contain letters, numbers, and spaces.";
        }

        if (!templateData.content) {
            newErrors.content = "Content is required.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    return (
        <MasterLayout>
            <div className="d-flex justify-content-end">
                <button
                    className="btn"
                    onClick={() => navigate("/app/admin-email-templates")}
                    style={{ backgroundColor: "#ff5722", color: "white" }}
                >
                    Back
                </button>
            </div>
            <div className="edit-email-template">
                <h2>Edit Admin Email Template</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="template_name">Template Name</label>
                        <input
                            type="text"
                            id="template_name"
                            name="template_name"
                            value={templateData.template_name}
                            onChange={handleChange}
                            className={`form-control ${
                                errors.template_name ? "is-invalid" : ""
                            }`}
                        />
                        {errors.template_name && (
                            <div className="invalid-feedback">
                                {errors.template_name}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="template_type">Template Type</label>
                        <input
                            type="text"
                            id="template_type"
                            name="template_type"
                            value={templateData.template_type}
                            onChange={handleChange}
                            className={`form-control ${
                                errors.template_type ? "is-invalid" : ""
                            }`}
                        />
                        {errors.template_type && (
                            <div className="invalid-feedback">
                                {errors.template_type}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="content">Content</label>
                        <textarea
                            id="content"
                            name="content"
                            value={templateData.content}
                            onChange={handleChange}
                            className={`form-control ${
                                errors.content ? "is-invalid" : ""
                            }`}
                            rows="5"
                        ></textarea>
                        {errors.content && (
                            <div className="invalid-feedback">
                                {errors.content}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            name="status"
                            value={templateData.status}
                            onChange={handleChange}
                            className={`form-control ${
                                errors.status ? "is-invalid" : ""
                            }`}
                        >
                            <option value="">Select Status</option>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                        {errors.status && (
                            <div className="invalid-feedback">
                                {errors.status}
                            </div>
                        )}
                    </div>
                    <div className="d-flex justify-content-end">
                        <button type="submit" className="btn btn-primary mt-2">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const { emailTemplates } = state;
    return { emailTemplates };
};

export default connect(mapStateToProps, {
    fetchAdminEmailTemplateDetails,
    updateAdminEmailTemplate,
})(EditAdminEmailTemplate);
