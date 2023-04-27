import { NextPage } from "next";
import React from "react";
import MapComponent from "./map";


function MapPage(): JSX.Element {
  return <MapComponent></MapComponent>;
}

const Map: NextPage = MapPage;

export default Map;
