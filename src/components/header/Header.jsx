import React, { useEffect, useState } from "react";
import { Image, Nav, Navbar } from "react-bootstrap-v5";
import { connect, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Tokens } from "../../constants/index";
import { logoutAction } from "../../store/action/authAction";
import ChangePassword from "../auth/change-password/ChangePassword";
import { getAvatarName } from "../../shared/sharedMethod";
import English from "../../assets/images/gb.svg";
import French from "../../assets/images/fr.svg";
import Arabic from "../../assets/images/sa.svg";
import Turkish from "../../assets/images/tr.svg";
import German from "../../assets/images/de.svg";
import Spanish from "../../assets/images/es.svg";
import Vietnamese from "../../assets/images/vn.svg";
import Chinese from "../../assets/images/cn.svg";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { updateLanguage } from "../../store/action/updateLanguageAction";
import User from "../../assets/images/avatar.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMaximize,
    faMinimize,
    faUser,
    faLock,
    faGlobe,
    faRightFromBracket,
    faAngleDown,
    faBell,
    faLanguage,
} from "@fortawesome/free-solid-svg-icons";
import { Dropdown, Row } from "react-bootstrap";
import { productQuantityReportAction } from "../../store/action/paymentQuantityReport";
import { Filters } from "../../constants";
import LanguageModel from "../user-profile/LanguageModel";
import PosRegisterModel from "../posRegister/PosRegisterModel";
import CountryModel from "../user-profile/countryModel";

const Header = (props) => {
    const {
        logoutAction,
        newRoutes,
        updateLanguage,
        selectedLanguage,
        productQuantityReportAction,
        productQuantityReport,
    } = props;
    const navigate = useNavigate();
    const users = localStorage.getItem(Tokens.USER);
    const firstName = localStorage.getItem(Tokens.FIRST_NAME);
    const lastName = localStorage.getItem(Tokens.LAST_NAME);
    const token = localStorage.getItem(Tokens.ADMIN);
    const imageUrl = localStorage.getItem(Tokens.USER_IMAGE_URL);
    const image = localStorage.getItem(Tokens.IMAGE);
    const updatedEmail = localStorage.getItem(Tokens.UPDATED_EMAIL);
    const updatedFirstName = localStorage.getItem(Tokens.UPDATED_FIRST_NAME);
    const updatedLastName = localStorage.getItem(Tokens.UPDATED_LAST_NAME);
    const updatedLanguage = localStorage.getItem(Tokens.UPDATED_LANGUAGE);
    const [deleteModel, setDeleteModel] = useState(false);
    const [languageModel, setLanguageModel] = useState(false);
    const [countryModel, setCountryModel] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [warehouseValue, setWarehouseValue] = useState({
        label: "All",
        value: null,
    });
    const [totalRecords, setTotalRecords] = useState(0);
    const [showPosRegisterModel, setShowPosRegisterModel] = useState(false);
    const { allConfigData } = useSelector((state) => state);
    const loginUserArray = JSON.parse(localStorage.getItem("loginUserArray"));
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isLoading;
        productQuantityReportAction(
            warehouseValue.value,
            Filters.OBJ,
            (isLoading = false),
            setTotalRecords
        );
    }, []);

    const isAdmin =
        loginUserArray &&
        (loginUserArray.role_id === 1 || loginUserArray.role_id === 2);

    const onClickDeleteModel = () => {
        setDeleteModel(!deleteModel);
    };

    const onClickLanguageModel = () => {
        setLanguageModel(!languageModel);
    };

    const onClickCountryModel = () => {
        setCountryModel(!countryModel);
    };

    const onLogOut = () => {
        logoutAction(token, navigate);
        navigate("/login");
    };

    const onProfileClick = () => {
        window.location.href = "#/app/profile/edit";
    };

    // const changeLanguage = (language) => {
    //     updateLanguage({language: language});
    // };
    //
    // const activeLanguage = updatedLanguage ? updatedLanguage : selectedLanguage;
    //
    // const activeFlag = () => {
    //     if (activeLanguage === 'en') {
    //         return English
    //     }
    //     if (activeLanguage === 'fr') {
    //         return French
    //     }
    //     if (activeLanguage === 'ar') {
    //         return Arabic
    //     }
    //     if (activeLanguage === 'tr') {
    //         return Turkish
    //     }
    //     if (activeLanguage === 'gr') {
    //         return German
    //     }
    //     if (activeLanguage === 'sp') {
    //         return Spanish
    //     }
    //     if (activeLanguage === 'vi') {
    //         return Vietnamese
    //     }
    //     if (activeLanguage === 'cn') {
    //         return Chinese
    //     }
    // };

    const countryMap = {
        102: "Indonesia",
        214: "Taiwan",
    };

    const fullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    const handleClickPOSBtn = () => {
        setShowPosRegisterModel(true);
    };

    const onClickshowPosRegisterModel = () => {
        setShowPosRegisterModel(false);
    };

    return (
        <Navbar
            collapseOnSelect
            expand="lg"
            className="align-items-stretch ms-auto py-1"
        >
            <div className="d-flex align-items-stretch justify-content-center">
                <Nav className="align-items-stretch justify-content-between flex-row">
                    <ul className="nav align-items-center">
                        {isFullscreen === true ? (
                            <li
                                className="px-sm-3 px-2"
                                onClick={() => fullScreen()}
                            >
                                <FontAwesomeIcon
                                    icon={faMinimize}
                                    className="text-primary fs-2"
                                />
                            </li>
                        ) : (
                            <li
                                className="px-sm-3 px-2"
                                onClick={() => fullScreen()}
                            >
                                <FontAwesomeIcon
                                    icon={faMaximize}
                                    className="text-primary fs-2"
                                />
                            </li>
                        )}
                        <li className="px-sm-3 px-2 d-flex align-items-center">
                            <FontAwesomeIcon
                                icon={faGlobe}
                                className="text-primary me-2 fs-4"
                            />
                            <span className="fs-5 text-gray-700">
                                {countryMap[localStorage?.country]
                                    ? countryMap[localStorage?.country]
                                    : "Country not available"}
                            </span>
                        </li>
                    </ul>
                    <Dropdown className="d-flex align-items-stretch">
                        <Dropdown.Toggle
                            className="hide-arrow bg-transparent border-0 p-0 d-flex align-items-center"
                            id="dropdown-basic"
                        >
                            <div className="d-flex align-items-center justify-content-center">
                                {imageUrl || image ? (
                                    <Image
                                        src={
                                            imageUrl ? imageUrl : image || User
                                        }
                                        className="image image-circle image-tiny"
                                        alt="user-avatar"
                                        height="50"
                                        width="50"
                                    />
                                ) : (
                                    <span className="custom-user-avatar">
                                        {getAvatarName(
                                            updatedFirstName && updatedLastName
                                                ? updatedFirstName +
                                                      " " +
                                                      updatedLastName
                                                : firstName + " " + lastName
                                        )}
                                    </span>
                                )}
                                <span className="ms-2 text-gray-600 d-none d-sm-block">
                                    {updatedFirstName && updatedLastName ? (
                                        <>
                                            {updatedFirstName +
                                                " " +
                                                updatedLastName}
                                        </>
                                    ) : (
                                        <>
                                            {" "}
                                            {firstName + " " + lastName}
                                            <br />(
                                            {
                                                loginUserArray?.roles[0]
                                                    ?.display_name
                                            }
                                            )
                                        </>
                                    )}
                                </span>
                            </div>
                            <FontAwesomeIcon
                                icon={faAngleDown}
                                className="text-gray-600 ms-2 d-none d-sm-block"
                            />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <div className="text-center pb-1 border-bottom mb-4">
                                <div className="text-center text-decoration-none pb-5 w-100 align-items-center">
                                    <div className="image image-circle w-100 image-tiny pb-5">
                                        {imageUrl || image ? (
                                            <img
                                                src={
                                                    imageUrl ? imageUrl : image
                                                }
                                                className="img-fluid"
                                                height="50"
                                                width="50"
                                                alt="user-avatar"
                                            />
                                        ) : (
                                            <span className="user_avatar mx-auto">
                                                {getAvatarName(
                                                    updatedFirstName &&
                                                        updatedLastName
                                                        ? updatedFirstName +
                                                              " " +
                                                              updatedLastName
                                                        : firstName +
                                                              " " +
                                                              lastName
                                                )}
                                            </span>
                                        )}
                                    </div>
                                    <div className="d-flex flex-column">
                                        <h3 className="text-gray-900">
                                            {updatedFirstName &&
                                            updatedLastName ? (
                                                <>
                                                    {updatedFirstName +
                                                        " " +
                                                        updatedLastName}
                                                </>
                                            ) : (
                                                <>
                                                    {" "}
                                                    {firstName + " " + lastName}
                                                </>
                                            )}
                                        </h3>
                                        <h4 className="mb-0 fw-400 fs-6">
                                            {updatedEmail
                                                ? updatedEmail
                                                : users}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                            <Dropdown.Item
                                onClick={(e) => onProfileClick(e)}
                                className="px-5 fs-6"
                            >
                                <span className="dropdown-icon me-4 text-gray-600">
                                    <FontAwesomeIcon icon={faUser} />
                                </span>
                                {getFormattedMessage(
                                    "header.profile-menu.profile.label"
                                )}
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={onClickDeleteModel}
                                className="px-5 fs-6"
                            >
                                <span className="dropdown-icon me-4 text-gray-600">
                                    <FontAwesomeIcon icon={faLock} />
                                </span>
                                {getFormattedMessage(
                                    "header.profile-menu.change-password.label"
                                )}
                            </Dropdown.Item>
                            {/* <Dropdown.Item
                                onClick={onClickLanguageModel}
                                className="px-5 fs-6"
                            >
                                <span className="dropdown-icon me-4 text-gray-600">
                                    <FontAwesomeIcon icon={faLanguage} />
                                </span>
                                {getFormattedMessage(
                                    "header.profile-menu.change-language.label"
                                )}
                            </Dropdown.Item> */}
                            {isAdmin && (
                                <Dropdown.Item
                                    onClick={onClickCountryModel}
                                    className="px-5 fs-6"
                                >
                                    <span className="dropdown-icon me-4 text-gray-600">
                                        <FontAwesomeIcon icon={faGlobe} />
                                    </span>
                                    Change Country
                                </Dropdown.Item>
                            )}
                            <Dropdown.Item
                                onClick={(e) => onLogOut(e)}
                                className="px-5 fs-6"
                            >
                                <span className="dropdown-icon me-4 text-gray-600">
                                    <FontAwesomeIcon
                                        icon={faRightFromBracket}
                                    />
                                </span>
                                {getFormattedMessage(
                                    "header.profile-menu.logout.label"
                                )}
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Nav>
            </div>
            {deleteModel === true && (
                <ChangePassword
                    deleteModel={deleteModel}
                    onClickDeleteModel={onClickDeleteModel}
                />
            )}

            {languageModel === true && (
                <LanguageModel
                    languageModel={languageModel}
                    onClickLanguageModel={onClickLanguageModel}
                />
            )}

            {countryModel === true && (
                <CountryModel
                    countryModel={countryModel}
                    onClickCountryModel={onClickCountryModel}
                />
            )}

            <PosRegisterModel
                showPosRegisterModel={showPosRegisterModel}
                onClickshowPosRegisterModel={onClickshowPosRegisterModel}
            />
        </Navbar>
    );
};

const mapStateToProps = (state) => {
    const { selectedLanguage, productQuantityReport } = state;
    return { selectedLanguage, productQuantityReport };
};

export default connect(mapStateToProps, {
    logoutAction,
    updateLanguage,
    productQuantityReportAction,
})(Header);
