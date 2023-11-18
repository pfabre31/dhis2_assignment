import React, { useRef, useEffect } from "react";
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
    });
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

  return (
    <>
      <div
        ref={mapContainer}
        className="map-container"
        style={{ width: "100%", height: "100%" }}
      />
      <div className="legend map-overlay">
        <div className="legend-title">
          Proportion of district population that slept under a mosquito net last
          night (%)
        </div>
        <div id="legend-container"></div>
      </div>
    </>
  );
};
