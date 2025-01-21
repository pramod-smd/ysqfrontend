import React, { useCallback, useEffect, useState, useRef } from "react";
import {
    GoogleMap,
    LoadScript,
    Marker,
    useJsApiLoader,
} from "@react-google-maps/api";
import Form from "react-bootstrap/Form";
import { connect, useSelector } from "react-redux";
import * as EmailValidator from "email-validator";
import { useNavigate } from "react-router-dom";
import {
    getAvatarName,
    getFormattedMessage,
    placeholderText,
    numValidate,
    decimalValidate,
} from "../../shared/sharedMethod";
import { editCustomer } from "../../store/action/customerAction";
import ModelFooter from "../../shared/components/modelFooter";
import ReactDatePicker from "../../shared/datepicker/ReactDatePicker";
import moment from "moment";
import ImagePicker from "../../shared/image-picker/ImagePicker";
import user from "../../assets/images/avatar.png";
import { fetchSetting } from "../../store/action/settingAction";
import { fetchDistributors } from "../../store/action/userAction";
import { ChannelList } from "../../store/action/chanelAction";
import { AreaList } from "../../store/action/areaAction";
import Select from "react-select";
import { fetchDistributorsList } from "../../store/action/userAction";
import { fetchCountry } from "../../store/action/countryAction";
const containerStyle = {
    width: "auto",
    height: "70vh",
};
const center = {
    lat: -3.745,
    lng: -38.523,
};
const libraries = ['places'];


const CustomerForm = (props) => {
    const {
        areas,
        AreaList,
        loginUser,
        chanels,
        ChannelList,
        distributors,
        fetchDistributorsList,
        addCustomerData,
        id,
        editCustomer,
        singleCustomer,
        isCreate,
        defaultCountry,
        fetchSetting,
        fetchCountry,
        countries
    } = props;

    const [showCountry, setShowCountry] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [position, setPosition] = useState(center);
    const [Country, setCountry] = useState("");
    const [filteredArea, setFilteredArea] = useState(null);
    const [selectedArea, setSelectedArea] = useState("");
    const [subAreas, setSubAreas] = useState([]);
    const [filteredSubAreas, setFilteredSubAreas] = useState([]);

    // Reference for the map instance
    const mapRef = useRef(null);

    const [customerValue, setCustomerValue] = useState({
        name: singleCustomer ? singleCustomer[0].name : "",
        email: singleCustomer ? singleCustomer[0].email : "",
        phone: singleCustomer ? singleCustomer[0].phone : "",
        country: singleCustomer ? singleCustomer[0].country : "",
        city: singleCustomer ? singleCustomer[0].city : "",
        address: singleCustomer ? singleCustomer[0].address : "",
        postal_code: singleCustomer ? singleCustomer[0].postal_code : "",
        latitude: singleCustomer ? singleCustomer[0].latitude : "",
        longitude: singleCustomer ? singleCustomer[0].longitude : "",
        image: singleCustomer ? singleCustomer[0].image : "",
        user_id: singleCustomer ? singleCustomer[0]?.user_id : "",
        chanel_id: singleCustomer ? singleCustomer[0]?.chanel_id : "",
        credit_limit: singleCustomer ? singleCustomer[0]?.credit_limit : 0,
        area_id: singleCustomer ? singleCustomer[0]?.area_id : 0,
        sub_area_id: singleCustomer ? singleCustomer[0]?.sub_area_id : 0,
        status: singleCustomer ? singleCustomer[0]?.status : "",
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        phone: "",
        country: "",
        city: "",
        address: "",
        postal_code: "",
        latitude: "",
        longitude: "",
        image: "",
        user_id: "",
        chanel_id: "",
        credit_limit: "",
        area_id: "",
        status: "",
    });

    const avatarName = getAvatarName(
        singleCustomer &&
            singleCustomer[0].image === "" &&
            singleCustomer[0].name
    );
    const newImg =
        singleCustomer &&
        singleCustomer[0].image &&
        singleCustomer[0].image === null &&
        avatarName;
    const [imagePreviewUrl, setImagePreviewUrl] = useState(newImg && newImg);
    const [selectImg, setSelectImg] = useState(null);

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyD6lpgvCGHSvAInVE7wbZ2-OrwJPyVn0OA",
        libraries: libraries, // Load the 'places' library
    });

    useEffect(() => {
        setImagePreviewUrl(
            singleCustomer
                ? singleCustomer[0].image && singleCustomer[0].image
                : user
        );
    }, []);

    const disabled =
        singleCustomer &&
        singleCustomer[0].phone === customerValue.phone &&
        singleCustomer[0].name === customerValue.name &&
        singleCustomer[0].user_id === customerValue?.user_id &&
        singleCustomer[0].chanel_d === customerValue?.chanel_d &&
        singleCustomer[0].country === customerValue.country &&
        singleCustomer[0].city === customerValue.city &&
        singleCustomer[0].email === customerValue.email &&
        singleCustomer[0].credit_limit === customerValue.credit_limit &&
        singleCustomer[0].postal_code === customerValue.postal_code &&
        singleCustomer[0].address === customerValue.address &&
        singleCustomer[0].latitude === customerValue.latitude &&
        singleCustomer[0].area_id === customerValue.area_id &&
        singleCustomer[0].sub_area_id === customerValue.sub_area_id &&
        singleCustomer[0].status === customerValue.status &&
        singleCustomer[0].longitude === customerValue.longitude;

        const handleValidation = () => {
            let errorss = {};
            let isValid = true;

            const nameRegex = /^[a-zA-Z0-9\s']+$/;

            if (!customerValue["user_id"]) {
                errorss["user_id"] = "Please select distributor";
                isValid = false;
            } else if (!customerValue["area_id"]) {
                errorss["area_id"] = "Please select area";
                isValid = false;
            } else if (!customerValue["chanel_id"]) {
                errorss["chanel_id"] = "Please select chanel";
                isValid = false;
            } else if (!customerValue["name"]) {
                errorss["name"] = getFormattedMessage("globally.input.name.validate.label");
                isValid = false;
            } else if (!nameRegex.test(customerValue["name"])) {
                errorss["name"] = "Name contains invalid characters";
                isValid = false;
            } else if (!EmailValidator.validate(customerValue["email"])) {
                if (!customerValue["email"]) {
                    errorss["email"] = getFormattedMessage("globally.input.email.validate.label");
                } else {
                    errorss["email"] = getFormattedMessage("globally.input.email.valid.validate.label");
                }
                isValid = false;
            } else if (!customerValue["postal_code"]) {
                errorss["postal_code"] = "Please enter postal code";
                isValid = false;
            } else if (!customerValue["country"]) {
                errorss["country"] = getFormattedMessage("globally.input.country.validate.label");
                isValid = false;
            } else if (!customerValue["address"]) {
                errorss["address"] = getFormattedMessage("globally.input.address.validate.label");
                isValid = false;
            } else if (!customerValue["phone"]) {
                errorss["phone"] = getFormattedMessage("globally.input.phone-number.validate.label");
                isValid = false;
            } else if (!customerValue["status"]) {
                errorss.status = "Please select status";
                isValid = false;
            }

            setErrors(errorss);
            return isValid;
        };


    // const onChangeInput = (e) => {
    //     if (e.target.name == "user_id") {
    //         const regions = distributors.filter(
    //             (item) => item.id == e.target.value
    //         );
    //         const filterareas = areas.filter(
    //             (item) => item.region_id == regions[0].attributes?.region
    //         );
    //         setFilteredArea(filterareas);
    //     }

    //     const { name, value } = e.target;
    //     setCustomerValue((prev) => ({
    //         ...prev,
    //         [name]: value,
    //     }));

    //     if (name === "user_id") {
    //         const selectedDistributor = distributors.find(
    //             (item) => item.id === Number(value)
    //         );
    //         if (selectedDistributor) {
    //             const countryCode =
    //                 selectedDistributor.attributes?.countryDetails?.id || "";
    //             const countryName =
    //                 selectedDistributor.attributes?.countryDetails?.name || "";

    //             setCustomerValue((prev) => ({
    //                 ...prev,
    //                 country: countryCode,
    //                 countryName: countryName,
    //             }));
    //         } else {
    //             setCustomerValue((prev) => ({
    //                 ...prev,
    //                 country: "",
    //                 countryName: "",
    //             }));
    //         }
    //     }
    // };

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        if (name === "user_id") {
            if (value === "") {
                setFilteredArea([]);
                setCustomerValue((prev) => ({
                    ...prev,
                    country: "",
                    countryName: "",
                }));
            } else {
                const selectedDistributor = distributors.find(
                    (item) => item.id == value
                );
                if (selectedDistributor) {
                    const region = selectedDistributor.attributes?.region;
                    const filterareas = areas.filter(
                        (item) => item.region_id == region
                    );

                    setFilteredArea(filterareas);

                    const countryCode =
                        selectedDistributor.attributes?.countryDetails?.id ||
                        "";
                    const countryName =
                        selectedDistributor.attributes?.countryDetails?.name ||
                        "";

                    setCustomerValue((prev) => ({
                        ...prev,
                        country: countryCode,
                        countryName: countryName,
                    }));
                }
            }
        }

        if (name === "area_id") {
            const selectedArea = areas.find((item) => item.id == value);
            setFilteredSubAreas(selectedArea?.sub_areas || []);
            setCustomerValue((prev) => ({
                ...prev,
                sub_area_id: "",
            }));
        }

        setCustomerValue((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    console.log("areas",areas);
    

    useEffect(() => {
        if (props.customer) {
            setCustomerValue((prevState) => ({
                ...prevState,
                status: String(props.customer.status),
            }));
        }
    }, [props.customer]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setCustomerValue((prevState) => ({
            ...prevState,
            [name]: value,
        }));
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

    useEffect(() => {
        if (customerValue?.user_id) {
            const regions =
                distributors &&
                distributors.filter(
                    (item) => item?.id == customerValue?.user_id
                );
            const filterareas = areas.filter(
                (item) => item?.region_id == regions[0]?.attributes?.region
            );
            setFilteredArea(filterareas);
        }

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                (center.lat = position.coords.latitude),
                    (center.lng = position.coords.longitude),
                    setCustomerValue({
                        ...customerValue,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                setPosition({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                if (mapRef.current) {
                    mapRef.current.panTo(position);
                }
            });
        } else {
            console.log("Geolocation is not available in your browser.");
        }
    }, []);

    const handleMapClick = useCallback((event) => {
        setPosition({
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        });
        if (singleCustomer) {
            singleCustomer[0].latitude = event.latLng.lat();
            singleCustomer[0].longitude = event.latLng.lng();
        }
        if (mapRef.current) {
            mapRef.current.panTo(position);
        }
    }, []);

    useEffect(() => {
        AreaList();
        fetchSetting();
        fetchDistributorsList();
        ChannelList();
        fetchCountry();
    }, []);

    useEffect(() => {
        singleCustomer &&
            setPosition({
                lat: parseFloat(singleCustomer[0]["latitude"]),
                lng: parseFloat(singleCustomer[0]["longitude"]),
            });
        if (defaultCountry) {
            const countries =
                defaultCountry &&
                defaultCountry.countries &&
                defaultCountry.countries.filter(
                    (country) => country.name === defaultCountry.country
                );
        }
        if (mapRef.current) {
            mapRef.current.panTo(position);
        }
    }, [defaultCountry]);

    useEffect(() => {
        if (customerValue.area_id) {
            const selectedArea = areas.find(
                (area) => area.id === Number(customerValue.area_id)
            );
            if (selectedArea) {
                setFilteredSubAreas(selectedArea.sub_areas || []);
            }
        }
    }, [customerValue.area_id, areas]);

    const navigate = useNavigate();

    const onSubmit = (event) => {
        event.preventDefault();
        const valid = handleValidation();
        customerValue.latitude = position.lat;
        customerValue.longitude = position.lng;
        if (selectImg) {
            customerValue.image = imagePreviewUrl;
        } else {
            customerValue.image = "";
        }

        if (singleCustomer && valid) {
            if (!disabled) {
                setCustomerValue(customerValue);
                editCustomer(id, customerValue, navigate);
            }
        } else {
            if (valid) {
                setCustomerValue(customerValue);
                addCustomerData(customerValue);
            }
        }
    };

    const [map, setMap] = React.useState(null);
    const onLoad = React.useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);
        setMap(map);
    }, []);

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null);
    }, []);

    const handleInputChanges = (e) => {
        const { name, value } = e.target;
        setPosition((prev) => ({
            ...prev,
            [name]: parseFloat(value),
        }));

        if (mapRef.current) {
            mapRef.current.panTo(position);
        }
    };

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading...</div>;

    const handleInputChange = (e) => {
        setInputValue(e.target.value);

        // Call Google Places Autocomplete API
        if (e.target.value) {
            const autocompleteService =
                new window.google.maps.places.AutocompleteService();
            autocompleteService.getPlacePredictions(
                {
                    input: e.target.value,
                    types: ["geocode"], // Suggest addresses only
                    //   componentRestrictions: { country: "us" }, // Restrict to a country
                },
                (predictions, status) => {
                    if (
                        status ===
                        window.google.maps.places.PlacesServiceStatus.OK
                    ) {
                        setSuggestions(predictions);
                    } else {
                        setSuggestions([]);
                    }
                }
            );
        } else {
            setSuggestions([]);
        }
    };
    // Get selected place's details and position
    const handleSuggestionClick = (placeId) => {
        const placesService = new window.google.maps.places.PlacesService(
            document.createElement("div")
        );

        placesService.getDetails({ placeId }, (place, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                const location = place.geometry.location;

                const currentPosition = {
                    lat: parseFloat(location.lat()),
                    lng: parseFloat(location.lng()),
                };
                setPosition(currentPosition);
                if (mapRef.current) {
                    mapRef.current.panTo(currentPosition);
                }
                setInputValue(place.formatted_address || place.name);
                setSuggestions([]);
            }
        });
    };

    const distributorOptions = distributors?.map((item) => ({
        value: item.id,
        label: `${item.attributes?.first_name} ${item.attributes?.last_name}`,
    }));

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
                            <label htmlFor="user_id" className="form-label">
                                Distributor :<span className="required" />
                            </label>
                            <select
                                className="form-control"
                                autoFocus={true}
                                name="user_id"
                                value={customerValue?.user_id}
                                onChange={onChangeInput}
                            >
                                <option value="">
                                    Please select distributor
                                </option>
                                {distributors.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.attributes?.first_name}{" "}
                                        {item.attributes?.last_name}
                                    </option>
                                ))}
                            </select>
                            <span className="text-danger d-block fw-400 fs-small mt-2">
                                {errors["user_id"] ? errors["user_id"] : null}
                            </span>
                        </div> */}

                        <div className="col-md-6">
                            <label htmlFor="user_id" className="form-label">
                                Distributor :<span className="required" />
                            </label>
                            <Select
                                id="user_id"
                                options={distributorOptions}
                                value={
                                    distributorOptions.find(
                                        (option) =>
                                            option.value ===
                                            customerValue?.user_id
                                    ) || null
                                }
                                onChange={(selectedOption) =>
                                    onChangeInput({
                                        target: {
                                            name: "user_id",
                                            value: selectedOption?.value || "",
                                        },
                                    })
                                }
                                placeholder="Please select distributor"
                                isClearable
                                className="basic-single"
                                classNamePrefix="select"
                            />
                            <span className="text-danger d-block fw-400 fs-small mt-2">
                                {errors["user_id"] ? errors["user_id"] : null}
                            </span>
                        </div>

                        {/* Area */}
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
                                name="area_id"
                                value={customerValue?.area_id}
                                onChange={(e) => onChangeInput(e)}
                            >
                                <option value="">Please select area</option>
                                {filteredArea &&
                                    filteredArea.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item?.name}
                                        </option>
                                    ))}
                            </select>
                            <span className="text-danger d-block fw-400 fs-small mt-2">
                                {errors["area_id"] ? errors["area_id"] : null}
                            </span>
                        </div>

                        {/* Sub-Area Dropdown */}
                        <div className="col-md-6">
                            <label
                                htmlFor="subAreaDropdown"
                                className="form-label"
                            >
                                Sub-Area: <span className="required" />
                            </label>
                            <select
                                className="form-control"
                                name="sub_area_id"
                                value={customerValue?.sub_area_id}
                                onChange={(e) => onChangeInput(e)}
                            >
                                <option value="">Please select sub-area</option>
                                {filteredSubAreas.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.sub_area_name}
                                    </option>
                                ))}
                            </select>
                            <span className="text-danger d-block fw-400 fs-small mt-2">
                                {errors["sub_area_id"]
                                    ? errors["sub_area_id"]
                                    : null}
                            </span>
                        </div>

                        {/* channels  */}
                        <div className="col-md-6">
                            <label
                                htmlFor="exampleInputEmail1"
                                className="form-label"
                            >
                                Channel :<span className="required" />
                            </label>
                            <select
                                className="form-control"
                                autoFocus={true}
                                name="chanel_id"
                                value={customerValue?.chanel_id}
                                onChange={(e) => onChangeInput(e)}
                            >
                                <option value="">Please select chanel</option>
                                {chanels &&
                                    chanels.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item?.name}
                                        </option>
                                    ))}
                            </select>
                            <span className="text-danger d-block fw-400 fs-small mt-2">
                                {errors["chanel_id"]
                                    ? errors["chanel_id"]
                                    : null}
                            </span>
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label">
                                {getFormattedMessage(
                                    "globally.input.name.label"
                                )}
                                :
                            </label>
                            <span className="required" />
                            <input
                                type="text"
                                name="name"
                                value={customerValue.name}
                                placeholder={placeholderText(
                                    "globally.input.name.placeholder.label"
                                )}
                                className="form-control"
                                autoFocus={true}
                                onChange={(e) => onChangeInput(e)}
                            />
                            <span className="text-danger d-block fw-400 fs-small mt-2">
                                {errors["name"] ? errors["name"] : null}
                            </span>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">
                                {getFormattedMessage(
                                    "globally.input.email.label"
                                )}
                                :
                            </label>
                            <span className="required" />
                            <input
                                type="text"
                                name="email"
                                className="form-control"
                                placeholder={placeholderText(
                                    "globally.input.email.placeholder.label"
                                )}
                                onChange={(e) => onChangeInput(e)}
                                value={customerValue.email}
                            />
                            <span className="text-danger d-block fw-400 fs-small mt-2">
                                {errors["email"] ? errors["email"] : null}
                            </span>
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label">
                                {getFormattedMessage(
                                    "globally.input.phone-number.label"
                                )}
                                :
                            </label>
                            <span className="required" />
                            <input
                                type="text"
                                name="phone"
                                className="form-control"
                                pattern="[0-9]*"
                                placeholder={placeholderText(
                                    "globally.input.phone-number.placeholder.label"
                                )}
                                onKeyPress={(event) => numValidate(event)}
                                onChange={(e) => onChangeInput(e)}
                                value={customerValue.phone}
                            />
                            <span className="text-danger d-block fw-400 fs-small mt-2">
                                {errors["phone"] ? errors["phone"] : null}
                            </span>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Credit limit</label>
                            <span className="required" />
                            <input
                                type="text"
                                name="credit_limit"
                                className="form-control"
                                placeholder="Enter credit limit"
                                onKeyPress={(event) => decimalValidate(event)}
                                onChange={(e) => onChangeInput(e)}
                                value={
                                    customerValue.credit_limit &&
                                    Number(customerValue.credit_limit)
                                }
                            />
                            <span className="text-danger d-block fw-400 fs-small mt-2">
                                {errors["credit_limit"]
                                    ? errors["credit_limit"]
                                    : null}
                            </span>
                        </div>
                        {/* Country  */}
                        {/* <div className="col-md-6">
                            <label className="form-label">
                                Country :<span className="required" />
                            </label>
                            <input
                                type="text"
                                name="country"
                                value={customerValue.country || ""}
                                className="form-control"
                                readOnly
                            />
                            <span className="text-danger d-block fw-400 fs-small mt-2">
                                {errors["country"] ? errors["country"] : null}
                            </span>
                        </div> */}
                        <div className="col-md-6">
                            <label htmlFor="country" className="form-label">
                                Country :<span className="required" />
                            </label>
                            <select
                                className="form-control"
                                name="country"
                                value={customerValue?.country || ""}
                                onChange={onChangeInput}
                                disabled
                            >
                                <option value="">Please select country</option>
                                {countries &&
                                    countries.map((item) => (
                                        <option key={item.id} value={item?.id}>
                                            {item?.name}
                                        </option>
                                    ))}
                            </select>
                            <span className="text-danger d-block fw-400 fs-small mt-2">
                                {errors["country"] ? errors["country"] : null}
                            </span>
                        </div>

                        {/* postal_code */}
                        <div className="col-md-6 mb-3">
                            <label className="form-label">
                                {getFormattedMessage(
                                    "globally.input.postal_code.label"
                                )}
                                :
                            </label>
                            <span className="required" />
                            <input
                                type="text"
                                name="postal_code"
                                className="form-control"
                                placeholder={placeholderText(
                                    "globally.input.postal_code.placeholder.label"
                                )}
                                onChange={(e) => onChangeInput(e)}
                                value={customerValue.postal_code}
                            />
                            <span className="text-danger d-block fw-400 fs-small mt-2">
                                {errors["postal_code"]
                                    ? errors["postal_code"]
                                    : null}
                            </span>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">
                                {getFormattedMessage(
                                    "globally.input.address.label"
                                )}
                                :
                            </label>
                            <span className="required" />
                            <textarea
                                type="text"
                                rows="4"
                                cols="50"
                                name="address"
                                className="form-control"
                                placeholder={placeholderText(
                                    "globally.input.address.placeholder.label"
                                )}
                                onChange={(e) => onChangeInput(e)}
                                value={customerValue.address}
                            />
                            <span className="text-danger d-block fw-400 fs-small mt-2">
                                {errors["address"] ? errors["address"] : null}
                            </span>
                        </div>
                        {/* status */}
                        <div className="col-md-6 mb-3">
                            <label htmlFor="user_id" className="form-label">
                                Status :<span className="required" />
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={customerValue.status}
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
                        <div>
                            <label>Search Location</label>
                            <input
                                type="text"
                                className="form-control"
                                value={inputValue}
                                onChange={handleInputChange}
                                placeholder="Type location name..."
                            />
                            <ul style={{ listStyleType: "none", padding: 0 }}>
                                {suggestions.map((suggestion, index) => (
                                    <li
                                        key={index}
                                        style={{
                                            cursor: "pointer",
                                            padding: "10px",
                                            borderBottom: "1px solid #ccc",
                                        }}
                                        onClick={() =>
                                            handleSuggestionClick(
                                                suggestion.place_id
                                            )
                                        }
                                    >
                                        {suggestion.description}
                                    </li>
                                ))}
                            </ul>
                            {/* {selectedAddress && <p>Selected Address: {selectedAddress}</p>} */}
                        </div>

                        <div className="col-md-6 mb-3">
                            <label>Latitude:</label>
                            <input
                                className="form-control"
                                type="number"
                                name="lat"
                                value={position?.lat}
                                onChange={handleInputChanges}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label>Longitude:</label>
                            <input
                                className="form-control"
                                type="number"
                                name="lng"
                                value={position?.lng}
                                onChange={handleInputChanges}
                            />
                        </div>

                        <div className="col-md-12 mb-3">
                            <GoogleMap
                                mapContainerStyle={containerStyle}
                                center={position}
                                zoom={12}
                                onLoad={(map) => (mapRef.current = map)}
                                // onUnmount={onUnmount}
                                onClick={handleMapClick}
                            >
                                {position && (
                                    <Marker
                                        position={position}
                                        draggable={true}
                                        onDragEnd={(e) => {
                                            setPosition({
                                                lat: e.latLng.lat(),
                                                lng: e.latLng.lng(),
                                            });
                                        }}
                                    />
                                )}
                            </GoogleMap>
                            {/* <div className="row">
                                <div className="col-md-6 mb-3 mt-3">
                                    <h1>
                                        {singleCustomer &&
                                        singleCustomer[0]["latitude"]
                                            ? singleCustomer[0]["latitude"]
                                            : position?.lat}
                                    </h1>
                                    <span className="text-danger d-block fw-400 fs-small mt-2">
                                        {errors["latitude"]
                                            ? errors["latitude"]
                                            : null}
                                    </span>
                                </div>
                                <div className="col-md-6 mb-3 mt-3">
                                    <h2>
                                        {singleCustomer &&
                                        singleCustomer[0]["longitude"]
                                            ? singleCustomer[0]["longitude"]
                                            : position?.lng}
                                    </h2>
                                    <span className="text-danger d-block fw-400 fs-small mt-2">
                                        {errors["longitude"]
                                            ? errors["longitude"]
                                            : null}
                                    </span>
                                </div>
                            </div> */}
                        </div>

                        <ModelFooter
                            onEditRecord={singleCustomer}
                            onSubmit={onSubmit}
                            editDisabled={disabled}
                            addDisabled={!customerValue.name}
                            link="/app/customers"
                        />
                    </div>
                </Form>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    const { areas, chanels, distributors, defaultCountry, countries } = state;
    return {
        areas,
        chanels,
        distributors,
        defaultCountry,
        countries
    };
};

export default connect(mapStateToProps, {
    AreaList,
    ChannelList,
    editCustomer,
    fetchSetting,
    fetchDistributorsList,
    fetchCountry
})(CustomerForm);
