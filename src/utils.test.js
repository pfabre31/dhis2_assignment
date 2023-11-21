import { DataSource } from "./components/DataSource";
import { getMosquitoDataSource } from "./utils";
import { mockApiData } from "./mock-data/mockData";

describe("getMosquitoDataSource function", () => {
  const output = getMosquitoDataSource(mockApiData);
  it("should add the SUAMN property to every feature of the mock geojson", () => {
    expect(output.data.features[0].properties.SUAMN).toBe(40.13);
    expect(output.data.features[1].properties.SUAMN).toBe(45.31);
    expect(output.data.features[2].properties.SUAMN).toBe(12.124);
  });
});
