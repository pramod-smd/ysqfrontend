import React, { useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Card, Table } from "react-bootstrap";
import moment from "moment";
import { Image } from "react-bootstrap-v5";
import MasterLayout from "../MasterLayout";
import TabTitle from "../../shared/tab-title/TabTitle";
import HeaderTitle from "../header/HeaderTitle";
import { getAvatarName, placeholderText } from "../../shared/sharedMethod";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { useParams } from "react-router-dom";
import { fetchUser } from "../../store/action/userAction";
import Spinner from "../../shared/components/loaders/Spinner";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import { Permissions } from "../../constants";
import { fetchConfig } from "../../store/action/configAction";

const DistributorDetails = (props) => {
    const { users, isLoading, fetchUser, allConfigData } = props;
    const { id } = useParams();
    const dispatch = useDispatch();
    const { config } = useSelector((state) => state);

    const result = users.reduce(
        (obj, cur) => ({ ...obj, [cur.type]: cur }),
        {}
    );
    const user = result.users;

    const editLink =
        config && config.includes(Permissions.EDIT_DISTRIBUTOR)
            ? "/app/distributor/edit/" + id
            : "";

    useEffect(() => {
        dispatch(fetchConfig());
        fetchUser(id);
    }, []);

    return (
        <MasterLayout>
            <TopProgressBar />
            <HeaderTitle
                title={getFormattedMessage("distributor-details.title")}
                to="/app/distributor"
                editLink={editLink}
            />
            <TabTitle title={placeholderText("distributor-details.title")} />
            {isLoading ? (
                <Spinner />
            ) : (
                <>
                    <div>
                        <Card>
                            <Card.Body>
                                <div className="row">
                                    <div className="col-xxl-5 col-12">
                                        <div className="d-sm-flex align-items-center mb-5 mb-xxl-0 flex-row text-sm-start">
                                            <div className="image image-circle image-lg-small w-100px">
                                                {user &&
                                                user.attributes.image ? (
                                                    <Image
                                                        src={
                                                            user.attributes
                                                                .image
                                                        }
                                                        alt="User Profile"
                                                        className="object-fit-cover"
                                                    />
                                                ) : (
                                                    <span className="user_avatar">
                                                        {getAvatarName(
                                                            user &&
                                                                user.attributes
                                                                    .first_name +
                                                                    " " +
                                                                    user
                                                                        .attributes
                                                                        .last_name
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="ms-0 ms-md-10 mt-5 mt-sm-0">
                                                <div>
                                                    <span
                                                        className={`badge ${
                                                           user && user?.attributes?.status === 1
                                                                ? "bg-light-success"
                                                                : "bg-light-danger"
                                                        } mb-2`}
                                                    >
                                                        { user && user?.attributes?.status === 1
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </span>
                                                </div>

                                                <h2>
                                                    {" "}
                                                    {user &&
                                                        user.attributes
                                                            .first_name +
                                                            " " +
                                                            user.attributes
                                                                .last_name}
                                                </h2>
                                                <a
                                                    href="javascript:void(0)"
                                                    className="text-gray-600 text-decoration-none fs-4"
                                                >
                                                    {user &&
                                                        user.attributes?.email}
                                                </a>
                                                <br />
                                                <span className="text-warning">
                                                    <strong>
                                                        {user &&
                                                            user.attributes
                                                                ?.unique_code}
                                                    </strong>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                    <div className="pt-5">
                        <Card>
                            <Card.Header as="h5">
                                {getFormattedMessage(
                                    "user-details.table.title"
                                )}
                            </Card.Header>
                            <Card.Body className="pt-0">
                                <Table responsive>
                                    <tbody>
                                        <tr>
                                            <td className="py-4">
                                                {getFormattedMessage(
                                                    "globally.input.country.label"
                                                )}
                                            </td>
                                            <td className="py-4">
                                                {user &&
                                                    user.attributes
                                                        ?.countryDetails?.name}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-4">Region</td>
                                            <td className="py-4">
                                                {user &&
                                                    user.attributes
                                                        ?.regionDetails?.name}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-4">
                                                {getFormattedMessage(
                                                    "user.input.first-name.label"
                                                )}
                                            </td>
                                            <td className="py-4">
                                                {user &&
                                                    user.attributes.first_name}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-4">
                                                {getFormattedMessage(
                                                    "user.input.last-name.label"
                                                )}
                                            </td>
                                            <td className="py-4">
                                                {user &&
                                                    user.attributes.last_name}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-4">
                                                {getFormattedMessage(
                                                    "user.input.email.label"
                                                )}
                                            </td>
                                            <td className="py-4">
                                                {user && user.attributes.email}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-4">
                                                {getFormattedMessage(
                                                    "user.input.phone-number.label"
                                                )}
                                            </td>
                                            <td className="py-4">
                                                {user && user.attributes.phone}
                                            </td>
                                        </tr>
                                        {/*<tr>*/}
                                        {/*    <td>{getFormattedMessage('user.input.role.label')}</td>*/}
                                        {/*    <td className='fs-5 fw-bold'>{user && user.attributes.role[0].display_name}</td>*/}
                                        {/*</tr>*/}
                                        <tr>
                                            <td className="py-4">
                                                {getFormattedMessage(
                                                    "user-details.table.created-on.row.label"
                                                )}
                                            </td>
                                            <td className="py-4">
                                                {moment(
                                                    user &&
                                                        user.attributes
                                                            .created_at
                                                ).format("DD-MM-yyyy")}
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </div>
                </>
            )}
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const { users, isLoading, allConfigData } = state;
    return { users, isLoading, allConfigData };
};

export default connect(mapStateToProps, { fetchUser })(DistributorDetails);
