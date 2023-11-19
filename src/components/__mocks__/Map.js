import React from "react";

/* Only legend and map hover logic is tested as all the rest relies on Mapbox internal logic**/
const Map = () => {
  const map = React.useRef(null);
  const mapContainer = React.useRef(null);
  let [featureBeingHovered, setFeatureBeingHovered] = React.useState(null);
  let [discretizationStops, setDiscretizationStops] = React.useState([
    46, 52.4, 76.1, 94.8,
  ]);
  let [colorGradient, setColorGradient] = React.useState([
    "#FFDD00",
    "#D88124",
    "#AB1212",
  ]);

  React.useEffect(() => {
    drawLegend();
  });

  const drawLegend = () => {
    const legend = document.getElementById("legend-container");

    discretizationStops.forEach((v, i) => {
      if (i === discretizationStops.length - 1) return;
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

  const handleMouseMove = (e) => {
    if (
      e.target.features.length > 0 &&
      e.target.features[0].properties.name !==
        featureBeingHovered?.properties.name
    ) {
      setFeatureBeingHovered(e.target.features[0]);
    }
  };

  const handleMouseLeave = () => {
    setFeatureBeingHovered(null);
  };

  return (
    <>
      <div
        data-testid="map"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        ref={mapContainer}
        className="map-container"
        style={{ width: "100%", height: "100%" }}
      />
      <div className="map-overlay" id="info-box">
        <h2 className="map-title">
          Sierra Leone district population having slept under a mosquito net
          last night{" "}
        </h2>
        <div data-testid="infobox" id="mosquito-proportion">
          <p>
            {featureBeingHovered
              ? `${featureBeingHovered.properties.name} ${featureBeingHovered.properties.SUAMNLN}%`
              : "Hover a district to see individual values"}
          </p>
        </div>
      </div>
      <div data-testid="legend" className="legend map-overlay">
        <div className="legend-title">Proportion per district (%)</div>
        <div id="legend-container"></div>
      </div>
    </>
  );
};
export default Map;
