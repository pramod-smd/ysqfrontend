import React, { useEffect, useState } from "react";
import axiosApi from "../../config/apiConfig";
import { Tokens } from "../../constants";
import {
    GoogleMap,
    Marker,
    OverlayView,
    InfoWindow,
    LoadScript,
} from "@react-google-maps/api";
import MasterLayout from "../MasterLayout";

const mapContainerStyle = {
    height: "500px",
    width: "100%",
};

const center = { lat: 28.7041, lng: 77.1025 };

const AllSalesmanTracker = () => {
    const [salesmen, setSalesmen] = useState([]);
    const [selectedSalesman, setSelectedSalesman] = useState(null);
    const token = localStorage.getItem(Tokens.ADMIN);

    useEffect(() => {
        const fetchSalesmanData = async () => {
            try {
                const response = await axiosApi.get("all-assigned-salesman", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                setSalesmen(response?.data);
            } catch (error) {
                console.error("Error fetching salesman data:", error);
            }
        };

        fetchSalesmanData();

        const intervalId = setInterval(() => {
            fetchSalesmanData();
        }, 5000);

        return () => clearInterval(intervalId);
    }, [token]);

    return (
        <MasterLayout>
            <h1>Salesman Tracker</h1>
            <LoadScript googleMapsApiKey="AIzaSyD6lpgvCGHSvAInVE7wbZ2-OrwJPyVn0OA">
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={5}
                >
                    {salesmen.map((salesman) => (
                        salesman?.salesman &&
                        <React.Fragment key={salesman?.salesman && salesman?.salesman?.id}>
                            {/* Marker */}
                            <Marker
                                position={{
                                    lat: parseFloat(salesman?.salesman?.latitude),
                                    lng: parseFloat(
                                        salesman?.salesman?.longitude
                                    ),
                                }}
                                onClick={() =>
                                    setSelectedSalesman(salesman?.salesman)
                                }
                            />
                            {/* Custom Overlay */}
                            <OverlayView
                                position={{
                                    lat: parseFloat(salesman?.salesman?.latitude),
                                    lng: parseFloat(
                                        salesman?.salesman?.longitude
                                    ),
                                }}
                                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        transform: "translateY(-118%)",
                                    }}
                                >
                                    <div
                                        style={{
                                            whiteSpace: "nowrap",
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                            color:"red",
                                            marginBottom: "5px",
                                        }}
                                    >
                                        {salesman?.salesman?.first_name}{" "}
                                        {salesman?.salesman?.last_name}
                                    </div>
                                    <img
                                        src={salesman?.salesman?.image_url}
                                        alt="Salesman"
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                            borderRadius: "50%",
                                            border: "2px solid black",
                                            marginBottom: "10px",
                                        }}
                                    />
                                </div>
                            </OverlayView>
                        </React.Fragment>

                    ))}

                    {selectedSalesman && (
                        <InfoWindow
                            position={{
                                lat: parseFloat(selectedSalesman?.latitude),
                                lng: parseFloat(selectedSalesman?.longitude),
                            }}
                            onCloseClick={() => setSelectedSalesman(null)}
                        >
                            <div>
                                <h3>
                                    {selectedSalesman?.first_name}{" "}
                                    {selectedSalesman?.last_name}
                                </h3>
                                <p>Email: {selectedSalesman?.email}</p>
                                <p>Phone: {selectedSalesman?.phone}</p>
                                <img
                                    src={selectedSalesman?.image_url}
                                    alt="Salesman"
                                    style={{
                                        width: "100px",
                                        height: "auto",
                                        borderRadius: "50%",
                                    }}
                                />
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </LoadScript>
        </MasterLayout>
    );
};

export default AllSalesmanTracker;
