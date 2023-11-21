import React, { useRef, useEffect, useState } from "react";
import mapboxgl, { AnyLayer } from "mapbox-gl";
import { Layer } from "./Layer";
import { jenks } from "simple-statistics";
import { MapBoxMap, MapInputDataType } from "../types";
import "mapbox-gl/dist/mapbox-gl.css";
import "./Map.css";
import { Feature } from "geojson";

mapboxgl.accessToken =
  "pk.eyJ1IjoibGFpc3NlcGF1bCIsImEiOiJjam5ocTByd2gwZjU2M3BvM3R5NndidThkIn0.DZIEmZkAfnn7s3fTWv0JHA";

export const Map = (props: MapInputDataType) => {
  const map = useRef<MapBoxMap>(null);
  const mapContainer = useRef(null);
  let [featureBeingHovered, setFeatureBeingHovered] = useState<Feature | null>(
    null
  );

  //Should be changed according to data
  const discretizationNbOfGroups = 3;

  let [discretizationStops, setDiscretizationStops] = useState(
    jenks(
      props.dataSources["mosquito" as keyof MapInputDataType].data.features
        .map((f: GeoJSON.Feature) => f.properties?.SUAMN)
        .sort(),
      discretizationNbOfGroups
    )
  );
  let [colorGradient, setColorGradient] = useState({
    "yellow-red": ["#ffdd00", "#d88124", "#ab1212"],
    blues: ["#cad6f6", "#567db6", "#171778"],
  });

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current as any,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-11.52, 8.51],
      zoom: 7,
    });
    map.current.on("load", () => {
      addMosquitoNetLayer();
      drawLegend();
      map.current?.addControl(new mapboxgl.ScaleControl());
      setUpHoverEvent();
    });
  });

  const addMosquitoNetLayer = (): void => {
    const mosquitoSource = props.dataSources["mosquito"];
    const mosquitoLayer = Layer("mosquito-layer-1", "fill", "mosquitoSource", {
      "fill-color": {
        property: "SUAMN",
        stops: [
          [discretizationStops[0], colorGradient["blues"][0]],
          [discretizationStops[1], colorGradient["blues"][0]],
          [discretizationStops[1] + 0.1, colorGradient["blues"][1]],
          [discretizationStops[2], colorGradient["blues"][1]],
          [discretizationStops[2] + 0.1, colorGradient["blues"][2]],
          [discretizationStops[3], colorGradient["blues"][2]],
        ],
      },

      "fill-outline-color": "black",
    });
    map.current?.addSource(mosquitoSource.name, {
      type: mosquitoSource.type as any,
      data: mosquitoSource.data,
    });
    map.current?.addLayer(mosquitoLayer as AnyLayer);
  };

  const drawLegend = (): void => {
    const legend = document.getElementById("legend-container");

    discretizationStops.forEach((v, i) => {
      if (i === discretizationStops.length - 1) return false;

      const dataRangeLabel = `${v} - ${discretizationStops[i + 1]}`;
      const color = colorGradient["blues"][i];

      const item = document.createElement("div");
      item.classList.add("legend-item");

      const key = document.createElement("span");
      key.className = "legend-key";
      key.style.backgroundColor = color;

      const value = document.createElement("span");
      value.innerHTML = `${dataRangeLabel}`;

      item.appendChild(key);
      item.appendChild(value);

      legend?.appendChild(item);
    });
  };

  const setUpHoverEvent = (): void => {
    if (!map.current) return;
    map.current.on("mousemove", "mosquito-layer-1", (e) => {
      //Checking that a feature is hovered and that it is not already being hovered
      if (!map.current) return;
      if (
        e.features &&
        e.features.length > 0 &&
        e.features[0].properties?.name !== featureBeingHovered?.properties?.name
      ) {
        setFeatureBeingHovered(e.features[0]);
        map.current.getCanvas().style.cursor = "pointer";
      }
    });

    map.current.on("mouseleave", "mosquito-layer-1", (e) => {
      if (!map.current) return;
      setFeatureBeingHovered(null);
      map.current.getCanvas().style.cursor = "";
    });
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div
        ref={mapContainer}
        className="map-container"
        style={{ width: "100%", height: "100%" }}
      />
      <div className="map-overlay" id="info-box">
        <h2 className="map-title">
          Sierra Leone population sleeping under a mosquito net at night{" "}
        </h2>
        <div id="mosquito-proportion">
          <p>
            {featureBeingHovered
              ? `${featureBeingHovered.properties?.name} ${featureBeingHovered.properties?.SUAMN} %`
              : "Hover a district to see individual values"}
          </p>
        </div>
      </div>
      <div className="legend map-overlay">
        <div className="legend-title">Proportion per district (%)</div>
        <div id="legend-container"></div>
      </div>
    </div>
  );
};
