import { Feature, FeatureCollection } from "geojson";
import { DataSource } from "./components/DataSource";
import { ApiDataType, DataSourceType } from "./types";

/*
Returns a Source component encapsulating the "slept under a mosquito net" data per district
in Sierra Leone. 
**/
export const getMosquitoDataSource = (data: ApiDataType): DataSourceType => {
  //We add the "slept under a mosquito net" property to the geojson
  const newGeojson = {
    ...data.geojson,
    features: data.geojson.features.map((f: Feature) => {
      return {
        ...f,
        properties: {
          ...f.properties,
          //SUAMN = Sleep under a mosquito net
          SUAMN: parseFloat(
            data.values.rows.find((e: any) => e[1] === f.id)[2]
          ),
        },
      };
    }),
  } as FeatureCollection;

  return DataSource("geojson", "mosquitoSource", newGeojson);
};
