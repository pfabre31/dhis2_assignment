import React from "react";
import { DataQuery } from "@dhis2/app-runtime";
import "./App.module.css";
import { Map } from "./components/Map";
import { getMosquitoDataSource } from "./utils";

const apiQuery: any = {
  geojson: {
    resource: "organisationUnits.geojson",
    params: {
      level: 2,
    },
  },
  values: {
    resource: "analytics",
    params: {
      dimension: ["dx:nkjlWUMIdHh", "ou:LEVEL-2"],
      filter: "pe:LAST_12_MONTHS",
    },
  },
};

const MyApp = () => (
  <div className="container" style={{ width: "100%", height: "100%" }}>
    <DataQuery query={apiQuery}>
      {({ error, loading, data }) => {
        if (error) return <span>{"ERROR"}</span>;
        if (loading) return <span>...</span>;
        return (
          <>
            {" "}
            <Map
              dataSources={{
                mosquito: getMosquitoDataSource(data as any),
              }}
            ></Map>
          </>
        );
      }}
    </DataQuery>
  </div>
);

export default MyApp;
