import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { connect, useDispatch } from "react-redux";
import {useNavigate } from "react-router-dom";
import * as EmailValidator from "email-validator";
import {
    addWarehouse,
    editWarehouse,
} from "../../store/action/userAction";
import ImagePicker from "../../shared/image-picker/ImagePicker";
import {
    getAvatarName,
    getFormattedMessage,
    placeholderText,
    numValidate,
} from "../../shared/sharedMethod";
import user from "../../assets/images/avatar.png";
import ModelFooter from "../../shared/components/modelFooter";
import ReactSelect from "../../shared/select/reactSelect";
import { AreaList } from "../../store/action/areaAction";
import {
    fetchSetting,
    editSetting,
    fetchCacheClear,
    fetchState,
} from "../../store/action/settingAction";



import { fetchRegions } from "../../store/action/regionAction";
import { Filters } from "../../constants";
import { fetchDistributorsList } from "../../store/action/userAction";
import Select from "react-select";

const CreateWarehouseForm = (props) => {
    const {
        areas,
        AreaList,
        addWarehouse,
        distributors,
        fetchDistributorsList,
        id,
        singleUser,
        isEdit,
        isCreate,
        defaultCountry,
        fetchSetting,
        regions,
        fetchRegions,
    } = props;
    const Dispatch = useDispatch();
    const navigate = useNavigate();
    const [filteredData, setFilteredData] = useState(regions);
    const [filteredArea, setFilteredArea] = useState(null);
    const [userValue, setUserValue] = useState({
        first_name: singleUser ? singleUser[0].first_name : "",
        last_name: singleUser ? singleUser[0].last_name : "",
        email: singleUser ? singleUser[0].email : "",
        phone: singleUser ? singleUser[0].phone : "",
        password: "",
        confirm_password: "",
        role_id: singleUser ? singleUser[0].role_id : "",
        image: singleUser ? singleUser[0].image : "",
        country: singleUser ? singleUser[0].country : "",
        region: singleUser ? singleUser[0].region : "",
        distributor_id: singleUser ? singleUser[0].user_id : "",
        area: singleUser ? singleUser[0].area : "",
        status: singleUser ? singleUser[0].status : "",
    });
    const [roleId, setRoleId] = useState(null);
    const [regionId, setRegionId] = useState(null);
    const [isDisabled, setIsDisabled] = useState(false);

    const [errors, setErrors] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        password: "",
        confirm_password: "",
        role_id: "",
        country: "",
        region: "",
        distributor_id: "",
        area: "",
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
          singleUser[0].country === userValue.country &&
          singleUser[0].user_id === userValue.distributor_id &&
          singleUser[0].role_id === userValue.role_id &&
          singleUser[0].region === userValue.region &&
          singleUser[0].area === userValue.area &&
          singleUser[0].status === userValue.status &&
          singleUser[0].password === userValue.password &&
          singleUser[0].confirm_password === userValue.confirm_password;

    useEffect(() => {
        AreaList();
        fetchSetting();
        fetchDistributorsList();       
    }, []);

    useEffect(() => {
        const loginUserData =
            JSON.parse(localStorage.getItem("loginUserArray")) || {};
        if (loginUserData && loginUserData?.role_id == 3) {
            setIsDisabled(true);
            setRoleId(loginUserData?.role_id)
            setRegionId(loginUserData?.region)
            setUserValue({
                ...userValue,
                distributor_id:
                    loginUserData.distributor_id || loginUserData.id,
                role_id: loginUserData.role_id,
                // region: loginUserData?.region,
            });
        }
    }, []);   

    useEffect(() => {           
        if (userValue?.distributor_id){            
            const regions =
                distributors &&
                distributors.filter(
                    (item) => item?.id == userValue?.distributor_id
                );
            const filterareas = areas && areas.filter(
                (item) => item?.region_id == regions[0]?.attributes?.region
            );
            setFilteredArea(filterareas);
        }

        if(regionId){
            const filterareas = areas && areas.filter(
                (item) => item?.region_id == regionId
            );
            setFilteredArea(filterareas);    
        }
        setImagePreviewUrl(
            singleUser ? singleUser[0].image && singleUser[0].image : user
        );
    }, [areas]);

    useEffect(() => {       
        if (props.user) {
            setUserValue((prevState) => ({
                ...prevState,
                status: String(props.user.status),
            }));
        }
    }, [props.user]);

    const validateUserValue = (userValue) => {
        let errors = {};
        let isValid = true;


        const nameRegex = /^[a-zA-Z0-9\s']+$/;

        if (!userValue["distributor_id"]) {
            errors["distributor_id"] = "Please select distributor";
            isValid = false;
        }

        if (!userValue["area"]) {
            errors["area"] = "Please select area";
            isValid = false;
        }

        if (!userValue["first_name"]) {
            errors["first_name"] = getFormattedMessage(
                "user.input.first-name.validate.label"
            );
            isValid = false;
        } else if (!nameRegex.test(userValue["first_name"])) {
            errors["first_name"] = "First name contains invalid characters (no hyphens allowed)";
            isValid = false;
        }

        if (!userValue["last_name"]) {
            errors["last_name"] = getFormattedMessage(
                "user.input.last-name.validate.label"
            );
            isValid = false;
        } else if (!nameRegex.test(userValue["last_name"])) {
            errors["last_name"] = "Last name contains invalid characters (no hyphens allowed)";
            isValid = false;
        }

        // Email validation
        if (!EmailValidator.validate(userValue["email"])) {
            errors["email"] = !userValue["email"]
                ? getFormattedMessage("user.input.email.validate.label")
                : getFormattedMessage("user.input.email.valid.validate.label");
            isValid = false;
        }

        if (!userValue["phone"]) {
            errors["phone"] = getFormattedMessage(
                "user.input.phone-number.validate.label"
            );
            isValid = false;
        }

        if (!userValue.status) {
            errors["status"] = "Please select status";
            isValid = false;
        }

        // Password match validation
        if (userValue.password !== userValue.confirm_password) {
            errors["confirm_password"] = "Passwords do not match";
            isValid = false;
        }

        return { errors, isValid };
    };


    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserValue((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const onChangeInput = (e) => {
        
        if (e.target.name == "distributor_id"){
            setUserValue((userValue)=>({
                ...userValue,
                area:""
              })               
            );
            const regions = distributors.filter(
                (item) => item.id == e.target.value
            );
            const filterareas = areas && areas.filter(
                (item) => item.region_id == regions[0].attributes?.region
            );
            setFilteredArea(filterareas);
        }
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
        formData.append("region", data.region);
        formData.append("role_id", 4);
        formData.append("distributor_id", data.distributor_id);
        formData.append("area", data.area);
        formData.append("status", data.status);
        if (isEdit) {
            formData.append("warehouse_id", singleUser[0]?.id);
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
        const { errors, isValid } = validateUserValue(userValue);

        setErrors(errors);

        if (singleUser && isValid) {
            if (!disabled) {
                Dispatch(
                    editWarehouse(
                        singleUser[0]?.ware_id,
                        prepareFormData(userValue),
                        navigate
                    )
                );
            }
        } else if (isValid) {
            setUserValue(userValue);
            addWarehouse(prepareFormData(userValue), navigate, Filters.OBJ);
            setImagePreviewUrl(imagePreviewUrl ? imagePreviewUrl : user);
        }
    };  

    let distributorOptions = [];

    if (roleId == 3) {
        // distributorOptions = [
        //     <option key="1" value={userValue?.distributor_id} disabled>
        //         {userValue?.first_name} {userValue?.last_name}
        //     </option>,
        // ];
        distributorOptions = distributors?.map((item) => ({
            value: item.id,
            label: `${item.attributes?.first_name} ${item.attributes?.last_name}`,
        }));
    } else {
        distributorOptions = distributors?.map((item) => ({
            value: item.id,
            label: `${item.attributes?.first_name} ${item.attributes?.last_name}`,
        }));
    }

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
                        {/* distributor  */}
                        {/* <div className="col-md-6">
                            <label className="form-label">
                                Distributors :<span className="required" />
                            </label>
                            <Select
                                options={distributorOptions}
                                value={
                                    userValue?.distributor_id
                                        ? distributorOptions.find(
                                              (option) =>
                                                  option.value ==
                                                  userValue.distributor_id
                                          )
                                        : null
                                }
                                // onChange={(selectedOption) =>
                                //     onCountryChange({
                                //         target: {
                                //             name: "distributor_id",
                                //             value: selectedOption?.value,
                                //         },
                                //     })
                                // }
                                placeholder="Please select distributor"
                                isClearable
                                className="basic-single"
                                classNamePrefix="select"
                            />

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
                                isDisabled={isDisabled}
                                value={
                                    userValue?.distributor_id
                                        ? distributorOptions.find(
                                              (option) =>
                                                  option.value ==
                                                  userValue.distributor_id
                                          )
                                        : null
                                }
                                onChange={(selectedOption) => {
                                    onChangeInput({
                                        target: {
                                            name: "distributor_id",
                                            value: selectedOption
                                                ? selectedOption.value
                                                : null,
                                        },
                                    });
                                }}
                                placeholder="Please select distributor"
                                isClearable
                                className="basic-single"
                                classNamePrefix="select"
                            />

                            <span className="text-danger d-block fw-400 fs-small mt-2">
                                {errors["distributor_id"]
                                    ? errors["distributor_id"]
                                    : null}
                            </span>
                        </div>                        
                        {/* Area  */}
                        <div className="col-md-6">
                            <label
                                htmlFor="exampleInputEmail1"
                                className="form-label"
                            >
                                Area :<span className="required" />
                            </label>
                            <select
                                className="form-control"
                                autoFocus={true}
                                name="area"
                                value={userValue?.area}
                                onChange={(e) => onChangeInput(e)}
                            >
                                <option value="">Please select Area</option>
                                {filteredArea &&
                                    filteredArea.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                            </select>
                            <span className="text-danger d-block fw-400 fs-small mt-2">
                                {errors["area"] ? errors["area"] : null}
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
                            <label htmlFor="status">
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
                            link="/app/warehouse"
                            addDisabled={!userValue.first_name}
                        />
                    </div>
                </Form>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    const { areas, settings, countryState, dateFormat, regions, distributors } =
        state;
    return {
        areas,
        settings,
        countryState,
        dateFormat,
        regions,
        distributors,
    };
};

export default connect(mapStateToProps, {
    AreaList,
    fetchSetting,
    fetchCacheClear,
    editSetting,
    fetchState,
    fetchRegions,
    fetchDistributorsList,
    addWarehouse,
})(CreateWarehouseForm);
