import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
mapboxgl.accessToken =
  "pk.eyJ1IjoibGFpc3NlcGF1bCIsImEiOiJjam5ocTByd2gwZjU2M3BvM3R5NndidThkIn0.DZIEmZkAfnn7s3fTWv0JHA";
import { Source } from "./Source";
import { Layer } from "./Layer";

export const Map = (props) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-11.52);
  const [lat, setLat] = useState(8.51);
  const [zoom, setZoom] = useState(6);
  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });
    map.current.on("load", addLayer);
  });

  const addLayer = () => {
    const mosquitoSource = props.dataSources["mosquito"];
    const mosquitoLayer = Layer("mosquito-layer-1", "fill", "mosquitoSource", {
      "fill-color": {
        property: "SUAMNLN",
        stops: [
          [46, "#FFDD00"],
          [52.4, "#FFDD00"],
          [52.41, "#D88124"],
          [76.1, "#D88124"],
          [76.11, "#AB1212"],
          [94.8, "#AB1212"],
        ],
      },
      "fill-outline-color": "black",
    });
    map.current.addSource(mosquitoSource.name, {
      type: mosquitoSource.type,
      data: mosquitoSource.data,
    });
    map.current.addLayer(mosquitoLayer);
  };

  return (
    <div
      ref={mapContainer}
      className="map-container"
      style={{ width: "100%", height: "100%" }}
    />
  );
};
