import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./Map.css";
mapboxgl.accessToken =
  "pk.eyJ1IjoibGFpc3NlcGF1bCIsImEiOiJjam5ocTByd2gwZjU2M3BvM3R5NndidThkIn0.DZIEmZkAfnn7s3fTWv0JHA";

import { Layer } from "./Layer";

export const Map = (props) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const valueGroups = ["46-52.4", "52.4-76.1", "76.1-94.8"]; //Using Jenkins discretization
  const colorGradient = ["#FFDD00", "#D88124", "#AB1212"];
  let [districtBeingHovered, setDistrictBeingHovered] = useState(null);

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
    console.log(props.dataSources["mosquito"]);
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

  const drawLegend = () => {
    const legend = document.getElementById("legend-container");

    valueGroups.forEach((group, i) => {
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
        e.features[0].properties.name !== districtBeingHovered?.properties.name
      ) {
        setDistrictBeingHovered(e.features[0]);
        map.current.getCanvas().style.cursor = "pointer";
        map.current.setFeatureState(
          { source: "mosquitoSource", id: e.features[0].id },
          { hover: true }
        );
      }
    });

    map.current.on("mouseleave", "mosquito-layer-1", (e) => {
      console.log("mouseleave");
      if (districtBeingHovered)
        map.current.setFeatureState(
          { source: "mosquitoSource", id: districtBeingHovered.id },
          { hover: false }
        );
      setDistrictBeingHovered(null);
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
          Proportion of Sierra Leone district population that slept under a
          mosquito net last night{" "}
        </h2>
        <div id="mosquito-proportion">
          <p>
            {districtBeingHovered
              ? `${districtBeingHovered.properties.name} ${districtBeingHovered.properties.SUAMNLN} %`
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
