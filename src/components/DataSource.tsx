import { FeatureCollection, Point } from "geojson";
import { DataSourceType, Exclude } from "../types";

export const DataSource = (
  type: string,
  name: string,
  data: Exclude<FeatureCollection, Point>
): DataSourceType => {
  return { type, name, data };
};
