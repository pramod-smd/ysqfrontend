import React, { useEffect } from "react";
import { Card, Row, Table } from "react-bootstrap";
import { connect } from "react-redux";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { fetchStockAlert } from "../../store/action/stockAlertAction";

const StockAlert = (props) => {
    const { fetchStockAlert, stockAlertDetails } = props;

    useEffect(() => {
        fetchStockAlert();
    }, []);

    return (
        <div className="pt-6">
            <Row className="g-4">
                <div className="col-12">
                    <Card>
                        <Card.Header className="pb-0 px-10">
                            <h5 className="mb-0">{getFormattedMessage( "dashboard.stockAlert.title" )}</h5>
                        </Card.Header>
                        <Card.Body className="pt-7 pb-2">
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>
                                            {getFormattedMessage(
                                                "dashboard.stockAlert.code.label"
                                            )}
                                        </th>
                                        <th>
                                            {getFormattedMessage(
                                                "dashboard.stockAlert.product.label"
                                            )}
                                        </th>
                                        <th>
                                            {getFormattedMessage(
                                                "dashboard.stockAlert.warehouse.label"
                                            )}
                                        </th>
                                        <th>
                                            Remaining Quantity
                                        </th>
                                        <th>
                                            {getFormattedMessage(
                                                "dashboard.stockAlert.alertQuantity.label"
                                            )}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-nowrap">
                                    {stockAlertDetails &&
                                        stockAlertDetails.map((product) => {

                                            return (
                                                <tr key={product?.id}>
                                                    <td className="py-4">
                                                        {product?.product?.code}
                                                    </td>
                                                    {/* <td className="py-4">
                                                        {alert.name}
                                                    </td> */}
                                                    <td className="py-4">
                                                        {
                                                            product?.product?.name
                                                        }
                                                    </td>
                                                    <td className="py-4">
                                                        {
                                                            product?.warehouse?.name
                                                        }
                                                    </td>
                                                    <td className="py-4">
                                                        <div>
                                                            <div className="badge bg-light-info me-2">
                                                                <span>
                                                                    {
                                                                      product?.warehouse_quantities
                                                                    }
                                                                </span>
                                                            </div>
                                                            <span className="badge bg-light-success me-2">
                                                                <span>
                                                                    {
                                                                       product?.product?.product_unit?.name
                                                                    }
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4">
                                                        <div>
                                                            <div className="badge bg-light-danger me-2">
                                                                {
                                                                    product?.product?.stock_alert
                                                                }
                                                            </div>
                                                            <span className="badge bg-light-success me-2">
                                                            <span>
                                                                    {
                                                                       product?.product?.product_unit?.name
                                                                    }
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </div>
            </Row>
        </div>
    );
};

const mapStateToProps = (state) => {
    const { stockAlertDetails } = state;
    return { stockAlertDetails };
};

export default connect(mapStateToProps, { fetchStockAlert })(StockAlert);
