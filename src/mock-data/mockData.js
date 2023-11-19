import mapboxgl from "mapbox-gl";

const mockGeojson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "feature-1",
      geometry: { type: "Point", coordinates: [102.0, 0.5] },
      properties: { prop0: "value0" },
    },
    {
      type: "Feature",
      id: "feature-2",
      geometry: {
        type: "LineString",
        coordinates: [
          [102.0, 0.0],
          [103.0, 1.0],
          [104.0, 0.0],
          [105.0, 1.0],
        ],
      },
      properties: {
        prop0: "value0",
        prop1: 0.0,
      },
    },
    {
      type: "Feature",
      id: "feature-3",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [100.0, 0.0],
            [101.0, 0.0],
            [101.0, 1.0],
            [100.0, 1.0],
            [100.0, 0.0],
          ],
        ],
      },
      properties: {
        prop0: "value0",
        prop1: { this: "that" },
      },
    },
  ],
};

export const mockApiData = {
  values: {
    rows: [
      ["a", "feature-1", "40.13"],
      ["b", "feature-2", "45.31"],
      ["c", "feature-3", "12.124"],
    ],
  },
  geojson: mockGeojson,
};

export const mockMap = {
  map: null,
  mapContainer: null,
};
