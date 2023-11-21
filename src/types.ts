import { FeatureCollection, MultiPoint, Point } from "geojson";
import { Map } from "mapbox-gl";

export type Exclude<FeatureCollection, Point> = FeatureCollection extends
  | Point
  | MultiPoint
  ? never
  : FeatureCollection;

export interface LayerType {
  id: string;
  type: string;
  source: string;
  paint: Object;
}

export interface DataSourceType {
  type: string;
  name: string;
  data: Exclude<FeatureCollection, Point>;
}

export interface MapInputDataType {
  dataSources: {
    [key: string]: DataSourceType;
  };
}

export type MapBoxMap = Map | null;

export interface ApiDataType {
  values: { [rows: string]: Array<any> };
  geojson: Exclude<FeatureCollection, Point>;
}
