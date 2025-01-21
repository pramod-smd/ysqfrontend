import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import MasterLayout from "../MasterLayout";
import { addAdminEmailTemplate } from "../../store/action/emailTemplatesAction";
const AddAdminEmailTemplate = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [templateName, setTemplateName] = useState("");
    const [content, setContent] = useState("");
    const [templateType, setTemplateType] = useState("");

    const [errors, setErrors] = useState({
        templateName: "",
        content: "",
        type: "",
    });

    const handleValidation = () => {
        let errorss = {};
        let isValid = true;

        if (!templateName) {
            errorss["templateName"] = "Template name is required";
            isValid = false;
        } else if (!/^[a-zA-Z0-9 ]+$/.test(templateName)) {
            errorss["templateName"] =
                "Template name can only contain letters, numbers, and spaces.";
            isValid = false;
        }

        if (!content) {
            errorss["content"] = "Template content is required";
            isValid = false;
        }

        // Validate templateType
        if (!templateType) {
            errorss["templateType"] = "Template type is required";
            isValid = false;
        } else if (!/^[a-zA-Z0-9 ]+$/.test(templateType)) {
            errorss["templateType"] =
                "Template type can only contain letters, numbers, and spaces.";
            isValid = false;
        }

        setErrors(errorss);
        return isValid;
    };

    const handleAddEmailTemplate = (event) => {
        event.preventDefault();

        const valid = handleValidation();

        if (valid) {
            const data = {
                template_name: templateName,
                content: content,
                template_type: templateType,
            };
            dispatch(addAdminEmailTemplate(data));
            navigate("/app/admin-email-templates");
        }
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
            <h3>Add Admin Email Template</h3>
            <form onSubmit={handleAddEmailTemplate}>
                <div className="form-group">
                    <label htmlFor="templateName">Template Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="templateName"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        placeholder="Enter template name"
                    />
                    {errors.templateName && (
                        <small className="text-danger">
                            {errors.templateName}
                        </small>
                    )}
                </div>

                <div className="form-group mt-3">
                    <label htmlFor="content">Template Content</label>
                    <textarea
                        className="form-control"
                        id="content"
                        rows="4"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Enter template content"
                    />
                    {errors.content && (
                        <small className="text-danger">{errors.content}</small>
                    )}
                </div>

                <div className="form-group mt-3">
                    <label htmlFor="type">Template Type</label>
                    <input
                        type="text"
                        className="form-control"
                        id="template_type"
                        value={templateType}
                        onChange={(e) => setTemplateType(e.target.value)}
                        placeholder="Enter template type"
                    />
                    {errors.templateType && (
                        <small className="text-danger">
                            {errors.templateType}
                        </small>
                    )}
                </div>
                <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary mt-3">
                        Add Template
                    </button>
                </div>
            </form>
        </MasterLayout>
    );
};

export default AddAdminEmailTemplate;
