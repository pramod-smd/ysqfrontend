import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Image } from "react-bootstrap-v5";
import * as EmailValidator from "email-validator";
import { loginAction } from "../../store/action/authAction";
import TabTitle from "../../shared/tab-title/TabTitle";
import { fetchFrontSetting } from "../../store/action/frontSettingAction";
import { fetchAllLoginRoles } from "../../store/action/roleAction";
import { Tokens } from "../../constants";
import { createBrowserHistory } from "history";
import {
    getFormattedMessage,
    placeholderText,
} from "../../shared/sharedMethod";
import ReactSelect from "../../shared/select/reactSelect";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const history = createBrowserHistory();
    const { frontSetting,roles } = useSelector((state) => state);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem(Tokens.ADMIN);
    const [selectedRole, setSelectedRole] = useState([]);

    const [loginInputs, setLoginInputs] = useState({
        email: "",
        password: "",
        role_id:"",
    });

    useEffect(() => {
        dispatch(fetchFrontSetting());
        dispatch(fetchAllLoginRoles())
        if (token) {
            history.push(window.location.pathname);
        }
    }, []);

    const [errors, setErrors] = useState({
        email: "",
        password: "",
        role_id:"",
    });

    const handleValidation = () => {
        let errorss = {};
        let isValid = false;
        if(!loginInputs['role_id']){
            errorss["role_id"]="Please select role type"
        }
        else if(!EmailValidator.validate(loginInputs["email"])) {
            if (!loginInputs["email"]) {
                errorss["email"] = getFormattedMessage(
                    "globally.input.email.validate.label"
                );
            } else {
                errorss["email"] = getFormattedMessage(
                    "globally.input.email.valid.validate.label"
                );
            }
        } else if (!loginInputs["password"]) {
            errorss["password"] = getFormattedMessage(
                "user.input.password.validate.label"
            );
        } else {
            isValid = true;
        }
        setErrors(errorss);
        setLoading(false);
        return isValid;
    };

    const onRolesChange = (obj) => {
        setSelectedRole(obj);         
        setLoginInputs((loginInputs) => ({ ...loginInputs, role_id:obj.value}));
        setErrors("");
    };

    const prepareFormData = () => {
        const formData = new FormData();
        
        formData.append("email", loginInputs.email);
        formData.append("password", loginInputs.password);
        formData.append("role_id", loginInputs.role_id);
        formData.append(
            "language_code",
            localStorage.getItem("updated_language")
        );
        return formData;
    };

    const onLogin = async (e) => {
        e.preventDefault();
        const valid = handleValidation();
        if (valid) {
            setLoading(true);
            dispatch(
                loginAction(prepareFormData(loginInputs), navigate, setLoading)
            );
            const dataBlank = {
                email: "",
                password: "",
                role_id: "",
            };
            setSelectedRole([]);
            setLoginInputs(dataBlank);
        }
    };

    const handleChange = (e) => {
        // e.persist();
        setLoginInputs((inputs) => ({
            ...inputs,
            [e.target.name]: e.target.value,
        }));
        setErrors("");
    };

    return (
        <div className="content d-flex flex-column flex-column-fluid">
            <div className="d-flex flex-wrap flex-column-fluid">
                <div className="d-flex flex-column flex-column-fluid align-items-center justify-content-center p-4">
                    <TabTitle
                        title="Login"
                    />
                    <div className="col-12 text-center align-items-center justify-content-center">
                        <a href="#" className="image">
                            <Image
                                className="logo-height image login-company-logo mb-7 mb-sm-10"
                                src={
                                    frontSetting &&
                                    frontSetting.value &&
                                    frontSetting.value.logo
                                }
                            />
                        </a>
                    </div>
                    <div className="bg-theme-white rounded-15 shadow-md width-540 px-5 px-sm-7 py-10 mx-auto">
                        <h1 className="text-dark text-center mb-7">
                            Sign In
                        </h1>
                        <form>
                        <div className="mb-sm-7 mb-4">
                            <ReactSelect
                                title="Login as"
                                placeholder="Select role"
                                value={selectedRole}
                                data={roles}
                                onChange={onRolesChange}
                                errors={errors["role_id"]}
                            />
                        </div>                
                            <div className="mb-sm-7 mb-4">
                                <label className="form-label">
                                   Email
                                </label>
                                <span className="required" />
                                <input
                                    placeholder="Enter Email"
                                    required
                                    value={loginInputs.email}
                                    className="form-control"
                                    type="text"
                                    name="email"
                                    autoComplete="off"
                                    onChange={(e) => handleChange(e)}
                                />
                                <span className="text-danger d-block fw-400 fs-small mt-2">
                                    {errors["email"] ? errors["email"] : null}
                                </span>
                            </div>

                            <div className="mb-sm-7 mb-4">
                                <div className="d-flex justify-content-between mt-n5">
                                    <div className="d-flex justify-content-between w-100">
                                        <label className="form-label">
                                            Password
                                            <span className="required" />
                                        </label>
                                        <Link
                                            to="/forgot-password"
                                            className="link-info fs-6 text-decoration-none"
                                        >
                                          Forgot Password?
                                        </Link>
                                    </div>
                                </div>
                                <input
                                    className="form-control"
                                    type="password"
                                    name="password"
                                    placeholder="Enter Password"
                                    autoComplete="off"
                                    required
                                    value={loginInputs.password}
                                    onChange={(e) => handleChange(e)}
                                />
                                <span className="text-danger d-block fw-400 fs-small mt-2">
                                    {errors["password"]
                                        ? errors["password"]
                                        : null}
                                </span>
                            </div>
                            <div className="text-center">
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    onClick={(e) => onLogin(e)}
                                >
                                    {loading ? (
                                        <span className="d-block">
                                           Please wait...
                                        </span>
                                    ) : (
                                        <span>
                                           Login
                                        </span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
