import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./Map.css";
mapboxgl.accessToken =
  "pk.eyJ1IjoibGFpc3NlcGF1bCIsImEiOiJjam5ocTByd2gwZjU2M3BvM3R5NndidThkIn0.DZIEmZkAfnn7s3fTWv0JHA";
import { Layer } from "./Layer";

export const Map = (props) => {
  const map = useRef(null);
  const mapContainer = useRef(null);
  let [featureBeingHovered, setFeatureBeingHovered] = useState(null);
  //Using Jenkins discretization
  let [discretizationStops, setDiscretizationStops] = useState([
    46, 52.4, 76.1, 94.8,
  ]);
  let [colorGradient, setColorGradient] = useState([
    "#FFDD00",
    "#D88124",
    "#AB1212",
  ]);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-11.52, 8.51],
      zoom: 7,
    });
    map.current.on("load", () => {
      addLayer();
      drawLegend();
      map.current.addControl(
        new mapboxgl.ScaleControl({ position: "bottom-left" })
      );
      setUpHoverEvent();
    });
  });

  const addLayer = () => {
    const mosquitoSource = props.dataSources["mosquito"];
    const mosquitoLayer = Layer("mosquito-layer-1", "fill", "mosquitoSource", {
      "fill-color": {
        property: "SUAMNLN",
        stops: [
          [discretizationStops[0], colorGradient[0]],
          [discretizationStops[1], colorGradient[0]],
          [discretizationStops[1] + 0.001, colorGradient[1]],
          [discretizationStops[2], colorGradient[1]],
          [discretizationStops[2] + 0.001, colorGradient[2]],
          [discretizationStops[3], colorGradient[2]],
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

  const drawLegend = () => {
    const legend = document.getElementById("legend-container");

    discretizationStops.forEach((v, i) => {
      if (i === discretizationStops.length - 1) return false;
      const group = `${v} - ${discretizationStops[i + 1]}`;
      const color = colorGradient[i];

      const item = document.createElement("div");
      item.classList.add("legend-item");
      const key = document.createElement("span");
      key.className = "legend-key";
      key.style.backgroundColor = color;

      const value = document.createElement("span");
      value.innerHTML = `${group}`;

      item.appendChild(key);
      item.appendChild(value);
      legend.appendChild(item);
    });
  };

  const setUpHoverEvent = () => {
    map.current.on("mousemove", "mosquito-layer-1", (e) => {
      if (
        e.features.length > 0 &&
        e.features[0].properties.name !== featureBeingHovered?.properties.name
      ) {
        setFeatureBeingHovered(e.features[0]);
        map.current.getCanvas().style.cursor = "pointer";
      }
    });

    map.current.on("mouseleave", "mosquito-layer-1", (e) => {
      setFeatureBeingHovered(null);
      map.current.getCanvas().style.cursor = "";
    });
  };

  return (
    <>
      <div
        ref={mapContainer}
        className="map-container"
        style={{ width: "100%", height: "100%" }}
      />
      <div className="map-overlay" id="info-box">
        <h2 className="map-title">
          Sierra Leone district population having slept under a mosquito net
          last night{" "}
        </h2>
        <div id="mosquito-proportion">
          <p>
            {featureBeingHovered
              ? `${featureBeingHovered.properties.name} ${featureBeingHovered.properties.SUAMNLN} %`
              : "Hover a district to see individual values"}
          </p>
        </div>
      </div>
      <div className="legend map-overlay">
        <div className="legend-title">Proportion per district (%)</div>
        <div id="legend-container"></div>
      </div>
    </>
  );
};
