import { DataSource } from "./components/DataSource";

/*
Returns a Source component encapsulating the "slept under a mosquito net" data per district
in Sierra Leone. 
**/
export const getMosquitoDataSource = (data) => {
  console.log(data);
  //We add the "slept under a mosquito net" property to the geojson
  const newGeojson = {
    ...data.geojson,
    features: data.geojson.features.map((f) => {
      return {
        ...f,
        properties: {
          ...f.properties,
          //SUAMNLN = Slept under a mosquito net last night
          SUAMNLN: parseFloat(data.values.rows.find((e) => e[1] === f.id)[2]),
        },
      };
    }),
  };

  return DataSource("geojson", "mosquitoSource", newGeojson);
};
