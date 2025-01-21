import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { connect, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import * as EmailValidator from "email-validator";
import { fetchDistributors } from "../../store/action/userAction";
import { editSalesman } from "../../store/action/salesmanAction";
import ImagePicker from "../../shared/image-picker/ImagePicker";
import {
    getAvatarName,
    getFormattedMessage,
    placeholderText,
    numValidate,
} from "../../shared/sharedMethod";
import user from "../../assets/images/avatar.png";
import ModelFooter from "../../shared/components/modelFooter";
import { fetchAllRoles } from "../../store/action/roleAction";
import {
    fetchSetting,
    editSetting,
    fetchCacheClear,
    fetchState,
} from "../../store/action/settingAction";
import { fetchCurrencies } from "../../store/action/currencyAction";
import { fetchAllCustomer } from "../../store/action/customerAction";
import { fetchWarehouseList } from "../../store/action/warehouseAction";
import { fetchRoles } from "../../store/action/roleAction";
import { fetchDistributorsList } from "../../store/action/userAction";
import { fetchSupervisorList } from "../../store/action/userAction";

const SalesmanForm = (props) => {
    const {
        distributors,
        fetchDistributorsList,
        addUserData,
        id,
        singleUser,
        isEdit,
        isCreate,
        fetchAllRoles,
        roles,
        defaultCountry,
        fetchSetting,
        fetchCurrencies,
        warehouses,
        fetchSupervisorList,
        supervisors,
        fetchWarehouseList,
    } = props;
    const Dispatch = useDispatch();
    const navigate = useNavigate();
    // const [filteredData, setFilteredData] = useState(warehouses);
    const [filteredWarehouses, setFilteredWarehouses] = useState([]);
    const [supervisorOptions, setSupervisorOptions] = useState([]);
    const [userValue, setUserValue] = useState({
        first_name: singleUser ? singleUser[0].first_name : "",
        last_name: singleUser ? singleUser[0].last_name : "",
        email: singleUser ? singleUser[0].email : "",
        phone: singleUser ? singleUser[0].phone : "",
        password: "",
        confirm_password: "",
        role_id: singleUser ? singleUser[0].role_id : "",
        image: singleUser ? singleUser[0].image : "",
        distributor_id: singleUser ? singleUser[0].distributor_id : "",
        ware_id: singleUser ? singleUser[0].ware_id : "",
        country: singleUser ? singleUser[0].country : "",
        supervisor_id: singleUser ? singleUser[0].supervisor_id : "",
        status: singleUser ? singleUser[0].status : "",
    });
    const [errors, setErrors] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        password: "",
        confirm_password: "",
        role_id: "",
        distributor_id: "",
        ware_id: "",
        country: "",
        supervisor_id: "",
        status: "",
    });
    const avatarName = getAvatarName(
        singleUser &&
            singleUser[0].image === "" &&
            singleUser[0].first_name &&
            singleUser[0].last_name &&
            singleUser[0].first_name + " " + singleUser[0].last_name
    );
    const newImg =
        singleUser &&
        singleUser[0].image &&
        singleUser[0].image === null &&
        avatarName;
    const [imagePreviewUrl, setImagePreviewUrl] = useState(newImg && newImg);
    const [selectImg, setSelectImg] = useState(null);
    const disabled = selectImg
        ? false
        : singleUser &&
          singleUser[0].first_name === userValue.first_name &&
          singleUser[0].last_name === userValue.last_name &&
          singleUser[0].email === userValue.email &&
          singleUser[0].phone === userValue.phone &&
          singleUser[0].image === userValue.image &&
          singleUser[0].password === userValue.password &&
          singleUser[0].confirm_password === userValue.confirm_password &&
          singleUser[0]?.distributor_id === userValue.distributor_id &&
          singleUser[0]?.ware_id === userValue?.ware_id &&
          singleUser[0]?.supervisor_id === userValue?.supervisor_id &&
          singleUser[0]?.status === userValue?.status &&
          singleUser[0].role_id.label[0] === userValue.role_id.label[0];

    const [selectedRole] = useState(
        singleUser && singleUser[0]
            ? [
                  {
                      label: singleUser[0].role_id.label[0],
                      value: singleUser[0].role_id.value[0],
                  },
              ]
            : null
    );

    useEffect(() => {
        fetchSetting();
        fetchWarehouseList();
        fetchDistributorsList();
        fetchSupervisorList();
    }, []);

    useEffect(() => {
        setImagePreviewUrl(
            singleUser ? singleUser[0].image && singleUser[0].image : user
        );
    }, []);

    useEffect(() => {
        warehouses &&
            setFilteredWarehouses(
                warehouses.filter(
                    (item) =>
                        item.attributes?.user_id == userValue?.distributor_id
                )
            );
    }, [warehouses]);

    useEffect(() => {
        if (userValue?.ware_id) {
            const supervisorsForWarehouse =
                supervisors &&
                supervisors.filter(
                    (supervisor) =>
                        supervisor.attributes?.supervisor?.ware_id ==
                        userValue.ware_id
                );

            const options = supervisorsForWarehouse.map((supervisor) => ({
                value: supervisor.id,
                label: `${supervisor.attributes?.first_name} ${supervisor.attributes?.last_name}`,
            }));

            setSupervisorOptions(options);
        }
    }, [userValue?.ware_id, supervisors]);

    const onCountryChange = (e) => {
        setFilteredData();
        setUserValue((inputs) => ({
            ...inputs,
            [e.target.name]: e.target.value,
        }));
        setFilteredWarehouses(
            warehouses.filter(
                (item) => item.attributes?.user_id == e.target.value
            )
        );
        setErrors("");
    };

    const handleValidation = () => {
        let errorss = {};
        let isValid = true;

        const nameRegex = /^[a-zA-Z0-9\s']+$/;

        if (!userValue.first_name) {
            errorss.first_name = "First name is required";
            isValid = false;
        } else if (!nameRegex.test(userValue.first_name)) {
            errorss.first_name = "First name must not contain invalid characters";
            isValid = false;
        }

        if (!userValue.last_name) {
            errorss.last_name = "Last name is required";
            isValid = false;
        } else if (!nameRegex.test(userValue.last_name)) {
            errorss.last_name = "Last name must not contain invalid characters ";
            isValid = false;
        }

        if (!EmailValidator.validate(userValue.email)) {
            errorss.email = "Invalid email format";
            isValid = false;
        }

        if (!userValue.phone) {
            errorss.phone = "Phone number is required";
            isValid = false;
        }

        if (!userValue.status) {
            errorss.status = "Please select status";
            isValid = false;
        }

        if (userValue.password !== userValue.confirm_password) {
            errorss.confirm_password = "Passwords do not match";
            isValid = false;
        }

        if (!userValue.distributor_id) {
            errorss.distributor_id = "Please select a distributor";
            isValid = false;
        }

        if (!userValue.ware_id) {
            errorss.ware_id = "Please select a warehouse";
            isValid = false;
        }

        if (!userValue.supervisor_id) {
            errorss.supervisor_id = "Please select a supervisor";
            isValid = false;
        }

        setErrors(errorss);
        return isValid;
    };



    // const onDistributorChange = (e) => {
    //     const selectedDistributorId = parseInt(e.target.value);

    //     const selectedDistributor = distributors.find(
    //         (distributor) => distributor.id === selectedDistributorId
    //     );

    //     if (selectedDistributor) {
    //         const countryCode =
    //             selectedDistributor.attributes?.countryDetails?.name;
    //         setUserValue((prev) => ({
    //             ...prev,
    //             distributor_id: selectedDistributorId,
    //             country: countryCode,
    //             ware_id: "",
    //         }));

    //         const warehousesForDistributor =
    //             // selectedDistributor.attributes.warehouse;

    //             warehouses &&
    //             warehouses.filter((item) => {
    //                 return item?.attributes?.user_id == selectedDistributorId;
    //             });
    //         setFilteredWarehouses(warehousesForDistributor);
    //         setErrors("");
    //     }
    // };

    const onDistributorChange = (e) => {
        const selectedDistributorId = e.target.value
            ? parseInt(e.target.value)
            : null;

        setFilteredWarehouses([]);
        setSupervisorOptions([]);
        setUserValue((prev) => ({
            ...prev,
            distributor_id: selectedDistributorId || "",
            country: selectedDistributorId
                ? distributors.find(
                      (distributor) => distributor.id === selectedDistributorId
                  )?.attributes?.countryDetails?.name || ""
                : "",
            ware_id: "",
            supervisor_id: "",
        }));

        if (selectedDistributorId) {
            const selectedDistributor = distributors.find(
                (distributor) => distributor.id === selectedDistributorId
            );

            if (selectedDistributor) {
                const warehousesForDistributor =
                    warehouses &&
                    warehouses.filter(
                        (item) =>
                            item?.attributes?.user_id == selectedDistributorId
                    );
                setFilteredWarehouses(warehousesForDistributor);
            }
        } else {
            setErrors("");
        }
    };

    const onWarehouseChange = (e) => {
        const selectedWarehouseId = e.target.value;

        setUserValue((prev) => ({
            ...prev,
            ware_id: selectedWarehouseId,
        }));

        if (selectedWarehouseId) {
            const supervisorsForWarehouse =
                supervisors &&
                supervisors.filter(
                    (supervisor) =>
                        supervisor.attributes?.supervisor?.ware_id ==
                        selectedWarehouseId
                );

            const supervisorOptions = supervisorsForWarehouse.map(
                (supervisor) => ({
                    value: supervisor.id,
                    label: `${supervisor.attributes?.first_name} ${supervisor.attributes?.last_name}`,
                })
            );

            setSupervisorOptions(supervisorOptions);
        } else {
            setSupervisorOptions([]);
        }

        setUserValue((prev) => ({
            ...prev,
            supervisor_id: "",
        }));
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setUserValue((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (props.user) {
            setUserValue((prevState) => ({
                ...prevState,
                status: String(props.user.status),
            }));
        }
    }, [props.customer]);

    const onChangeInput = (e) => {
        e.preventDefault();
        setUserValue((inputs) => ({
            ...inputs,
            [e.target.name]: e.target.value,
        }));
        setErrors("");
    };

    const handleImageChanges = (e) => {
        e.preventDefault();
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file.type === "image/jpeg" || file.type === "image/png") {
                setSelectImg(file);
                const fileReader = new FileReader();
                fileReader.onloadend = () => {
                    setImagePreviewUrl(fileReader.result);
                };
                fileReader.readAsDataURL(file);
                setErrors("");
            }
        }
    };

    const prepareFormData = (data) => {
        const formData = new FormData();
        formData.append("first_name", data.first_name);
        formData.append("last_name", data.last_name);
        formData.append("email", data.email);
        formData.append("phone", data.phone);
        formData.append("country", data.country);
        formData.append("region", data.region);
        formData.append("role_id", 6);
        formData.append("distributor_id", data.distributor_id);
        formData.append("ware_id", data.ware_id);
        formData.append("supervisor_id", data.supervisor_id);
        formData.append("status", data.status);

        if (isEdit) {
            formData.append("salesman_id", singleUser[0].salesman_id);
        }

        if (data.password) {
            formData.append("password", data.password);
        }
        if (data.confirm_password) {
            formData.append("confirm_password", data.confirm_password);
        }
        if (selectImg) {
            formData.append("image", data.image);
        }
        return formData;
    };

    const onSubmit = (event) => {
        event.preventDefault();
        userValue.image = selectImg;
        const valid = handleValidation();
        if (singleUser && valid) {
            if (!disabled) {
                userValue.image = selectImg;
                Dispatch(
                    editSalesman(id, prepareFormData(userValue), navigate)
                );
            }
        } else {
            if (valid) {
                setUserValue(userValue);
                addUserData(prepareFormData(userValue));
                setImagePreviewUrl(imagePreviewUrl ? imagePreviewUrl : user);
            }
        }
    };

    const distributorOptions = [
        { value: "", label: "Please select distributor" },
        ...distributors.map((item) => ({
            value: item.id,
            label: `${item.attributes?.first_name} ${item.attributes?.last_name}`,
        })),
    ];

    return (
        <div className="card">
            <div className="card-body">
                <Form>
                    <div className="row">
                        <div className="mb-4">
                            <ImagePicker
                                user={user}
                                isCreate={isCreate}
                                avtarName={avatarName}
                                imageTitle={placeholderText(
                                    "globally.input.change-image.tooltip"
                                )}
                                imagePreviewUrl={imagePreviewUrl}
                                handleImageChange={handleImageChanges}
                            />
                        </div>

                        {/* Distributor */}
                        {/* <div className="col-md-6">
                            <label className="form-label">
                                Distributors :<span className="required" />
                            </label>
                            <select
                                className="form-control"
                                autoFocus={true}
                                name="distributor_id"
                                value={userValue?.distributor_id}
                                onChange={onDistributorChange}
                            >
                                <option value="">
                                    Please select distributor
                                </option>
                                {distributors &&
                                    distributors.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.attributes?.first_name +
                                                " " +
                                                item.attributes?.last_name}
                                        </option>
                                    ))}
                            </select>
                            <span className="text-danger d-block fw-400 fs-small mt-2">
                                {errors["distributor_id"]
                                    ? errors["distributor_id"]
                                    : null}
                            </span>
                        </div> */}
                        <div className="col-md-6">
                            <label className="form-label">
                                Distributors :<span className="required" />
                            </label>
                            <Select
                                options={distributorOptions}
                                value={
                                    distributorOptions.find(
                                        (option) =>
                                            option.value ===
                                            userValue?.distributor_id
                                    ) || null
                                }
                                onChange={(selectedOption) =>
                                    onDistributorChange({
                                        target: {
                                            name: "distributor_id",
                                            value: selectedOption?.value || "",
                                        },
                                    })
                                }
                                placeholder="Please select distributor"
                                isClearable
                                className="basic-single"
                                classNamePrefix="select"
                            />
                        </div>

                        {/* Country */}
                        <div className="col-md-6">
                            <label className="form-label">
                                Country :<span className="required" />
                            </label>
                            <input
                                type="text"
                                name="country"
                                value={userValue?.country}
                                className="form-control"
                                readOnly
                            />
                            <span className="text-danger d-block fw-400 fs-small mt-2">
                                {errors["country"] ? errors["country"] : null}
                            </span>
                        </div>
                        {/* ... */}
                        {/* warehouse */}
                        {/* <div className="col-md-6">
                            <label className="form-label">
                                Warehouse :<span className="required" />
                            </label>
                            <select
                                className="form-control"
                                autoFocus={true}
                                name="ware_id"
                                value={userValue?.ware_id}
                                onChange={onWarehouseChange} // Updated handler
                            >
                                <option value="">
                                    Please select warehouse
                                </option>
                                {filteredWarehouses &&
                                    filteredWarehouses.map((item) => (
                                        <option
                                            key={item.id}
                                            value={item?.attributes?.ware_id}
                                            style={{ color: "black" }}
                                        >
                                            {item?.attributes?.name}{" "}
                                        </option>
                                    ))}
                            </select>
                            <span className="text-danger d-block fw-400 fs-small mt-2">
                                {errors["ware_id"] ? errors["ware_id"] : null}
                            </span>
                        </div> */}

                        <div className="col-md-6">
                            <label className="form-label">
                                Warehouse :<span className="required" />
                            </label>
                            <Select
                                options={filteredWarehouses.map((item) => ({
                                    value: item?.attributes?.ware_id,
                                    label: item?.attributes?.name,
                                }))}
                                placeholder="Please select warehouse"
                                isClearable
                                className="basic-single"
                                classNamePrefix="select"
                                value={
                                    filteredWarehouses
                                        .map((item) => ({
                                            value: item?.attributes?.ware_id,
                                            label: item?.attributes?.name,
                                        }))
                                        .find(
                                            (option) =>
                                                option.value ===
                                                userValue?.ware_id
                                        ) || null
                                }
                                onChange={(selectedOption) =>
                                    onWarehouseChange({
                                        target: {
                                            name: "ware_id",
                                            value: selectedOption?.value || "",
                                        },
                                    })
                                }
                            />
                            <span className="text-danger d-block fw-400 fs-small mt-2">
                                {errors["ware_id"] ? errors["ware_id"] : null}
                            </span>
                        </div>

                        {/* subpervisor */}
                        <div className="col-md-6">
                            <label className="form-label">
                                Supervisor :<span className="required" />
                            </label>
                            <Select
                                options={supervisorOptions}
                                placeholder="Please select supervisor"
                                isClearable
                                className="basic-single"
                                classNamePrefix="select"
                                value={
                                    supervisorOptions.find(
                                        (option) =>
                                            option.value ===
                                            userValue?.supervisor_id
                                    ) || null
                                }
                                onChange={(selectedOption) =>
                                    setUserValue((prev) => ({
                                        ...prev,
                                        supervisor_id: selectedOption
                                            ? selectedOption.value
                                            : "",
                                    }))
                                }
                            />
                            <span className="text-danger d-block fw-400 fs-small mt-2">
                                {errors["supervisor_id"] ? errors["supervisor_id"] : null}
                            </span>
                        </div>

                        <div className="col-md-6 mb-3">
                            <label
                                htmlFor="exampleInputEmail1"
                                className="form-label"
                            >
                                {getFormattedMessage(
                                    "user.input.first-name.label"
                                )}{" "}
                                :<span className="required" />
                            </label>
                            <input
                                type="text"
                                name="first_name"
                                value={userValue.first_name}
                                placeholder={placeholderText(
                                    "user.input.first-name.placeholder.label"
                                )}
                                className="form-control"
                                autoFocus={true}
                                onChange={(e) => onChangeInput(e)}
                            />
                            <span className="text-danger d-block fw-400 fs-small mt-2">
                                {errors["first_name"]
                                    ? errors["first_name"]
                                    : null}
                            </span>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">
                                {getFormattedMessage(
                                    "user.input.last-name.label"
                                )}
                                :
                            </label>
                            <span className="required" />
                            <input
                                type="text"
                                name="last_name"
                                className="form-control"
                                placeholder={placeholderText(
                                    "user.input.last-name.placeholder.label"
                                )}
                                onChange={(e) => onChangeInput(e)}
                                value={userValue.last_name}
                            />
                            <span className="text-danger d-block fw-400 fs-small mt-2">
                                {errors["last_name"]
                                    ? errors["last_name"]
                                    : null}
                            </span>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">
                                {getFormattedMessage("user.input.email.label")}:
                            </label>
                            <span className="required" />
                            <input
                                type="text"
                                name="email"
                                className="form-control"
                                placeholder={placeholderText(
                                    "user.input.email.placeholder.label"
                                )}
                                onChange={(e) => onChangeInput(e)}
                                value={userValue.email}
                            />
                            <span className="text-danger d-block fw-400 fs-small mt-2">
                                {errors["email"] ? errors["email"] : null}
                            </span>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">
                                {getFormattedMessage(
                                    "user.input.phone-number.label"
                                )}
                                :
                            </label>
                            <span className="required" />
                            <input
                                type="text"
                                name="phone"
                                value={userValue.phone}
                                placeholder={placeholderText(
                                    "user.input.phone-number.placeholder.label"
                                )}
                                className="form-control"
                                pattern="[0-9]*"
                                min={0}
                                onKeyPress={(event) => numValidate(event)}
                                onChange={(e) => onChangeInput(e)}
                            />
                            <span className="text-danger d-block fw-400 fs-small mt-2">
                                {errors["phone"] ? errors["phone"] : null}
                            </span>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">
                                {getFormattedMessage(
                                    "user.input.password.label"
                                )}
                                :
                            </label>
                            <span className="required" />
                            <input
                                type="password"
                                name="password"
                                placeholder={placeholderText(
                                    "user.input.password.placeholder.label"
                                )}
                                className="form-control"
                                value={userValue.password}
                                onChange={(e) => onChangeInput(e)}
                            />
                            <span className="text-danger d-block fw-400 fs-small mt-2">
                                {errors["password"] ? errors["password"] : null}
                            </span>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">
                                {getFormattedMessage(
                                    "user.input.confirm-password.label"
                                )}
                                :
                            </label>
                            <span className="required" />
                            <input
                                type="password"
                                name="confirm_password"
                                className="form-control"
                                placeholder={placeholderText(
                                    "user.input.confirm-password.placeholder.label"
                                )}
                                onChange={(e) => onChangeInput(e)}
                                value={userValue.confirm_password}
                            />
                            <span className="text-danger d-block fw-400 fs-small mt-2">
                                {errors["confirm_password"]
                                    ? errors["confirm_password"]
                                    : null}
                            </span>
                        </div>
                        <div className="col-md-6 mb-3">
                        <label className="form-label">
                                Status :<span className="required" />
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={userValue.status}
                                onChange={handleChange}
                                className={`form-control ${
                                    errors.status ? "is-invalid" : ""
                                }`}
                            >
                                <option value="">Select Status</option>
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                            <span className="text-danger d-block fw-400 fs-small mt-2">
                                {errors["status"] ? errors["status"] : null}
                            </span>
                        </div>
                        <ModelFooter
                            onEditRecord={singleUser}
                            onSubmit={onSubmit}
                            editDisabled={disabled}
                            link="/app/salesman"
                            addDisabled={!userValue.first_name}
                        />
                    </div>
                </Form>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    const {
        roles,
        customers,
        warehouses,
        settings,
        currencies,
        countryState,
        dateFormat,
        defaultCountry,
        distributors,
        supervisors,
    } = state;
    return {
        roles,
        customers,
        warehouses,
        settings,
        currencies,
        countryState,
        dateFormat,
        defaultCountry,
        distributors,
        supervisors,
    };
};

export default connect(mapStateToProps, {
    fetchAllRoles,
    fetchSetting,
    fetchCurrencies,
    fetchCacheClear,
    fetchAllCustomer,
    fetchWarehouseList,
    editSetting,
    fetchState,
    fetchDistributorsList,
    fetchSupervisorList,
})(SalesmanForm);
