import {
  Box, Button, ButtonGroup, Flex, HStack, IconButton, Input, SkeletonText, Text
} from "@chakra-ui/react";
import { FaLocationArrow, FaTimes } from "react-icons/fa";
import React, { useRef, useState } from "react";
import {
  useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer
} from "@react-google-maps/api";
import { mapStyle } from "./mapStyle";

const center = { lat: 18.5204, lng: 73.8567 };
const LIBRARIES = ["places"];

function Map() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "",
    libraries: LIBRARIES
  });

  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [curr, setCurr] = useState(null);


  const originRef = useRef();
  const destinationRef = useRef();

  if (!isLoaded) {
    return <div>LOADING</div>;
  }

  async function calculateRoute() {
    if (originRef.current.value === "" || destinationRef.current.value === "") {
      return;
    }
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value, destination: destinationRef.current.value, // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    setCurr("");
    originRef.current.value = "";
    destinationRef.current.value = "";
  }


  return (
    <Flex
      position="relative"
      flexDirection="column"
      alignItems="center"
      h="100vh"
      w="100vw"
    >
      <Box position="absolute" left={0} top={0} h="100%" w="100%">

        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            styles: mapStyle
          }}
          onLoad={(map) => setMap(map)}
        >
          <Marker position={center} />
          {directionsResponse && (<div>
            <Marker
              clickable={false}
              position={directionsResponse.routes[0].legs[0].start_location}
              options={{
                icon: {
                  url: "https://www.picng.com/upload/vinyl/png_vinyl_35563.png",
                  scaledSize: new google.maps.Size(18, 18)
                }
              }}
            />
            <Marker
              clickable={false}
              position={directionsResponse.routes[0].legs[0].end_location}
              options={{
                icon: {
                  url: "https://images.unsplash.com/photo-1580407836821-60af99465138?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
                  scaledSize: new google.maps.Size(18, 18)
                }
              }}
            />
            <DirectionsRenderer
              directions={directionsResponse}
              options={{
                polylineOptions: {
                  clickable: false, strokeColor: "black", strokeWeight: 3, strokeOpacity: 1, geodesic: false
                }, suppressMarkers: true
              }}
            />
          </div>)}
          {curr && <Marker position={curr}></Marker>}
        </GoogleMap>
      </Box>
      <Box p={4} borderRadius="lg" m={4} bgColor="white" shadow="base" minW="container.md" zIndex="1"
      >
        <HStack spacing={2} justifyContent="space-between">
          <Box flexGrow={1}>
            <Autocomplete>
              <Input type="text" placeholder="Origin" ref={originRef} />
            </Autocomplete>
          </Box>
          <Box flexGrow={1}>
            <Autocomplete>
              <Input type="text" placeholder="Destination" ref={destinationRef} />
            </Autocomplete>
          </Box>

          <ButtonGroup>
            <Button colorScheme="linkedin" type="submit" onClick={calculateRoute}>
              Calculate Route
            </Button>
            <IconButton
              icon={<FaTimes />}
              onClick={clearRoute}
            />
          </ButtonGroup>
        </HStack>
        <HStack margin={1} spacing={4} mt={4} justifyContent="space-between">
          <Text>Distance: {distance} </Text>
          <Text>Duration: {duration} </Text>
          <IconButton
            aria-label="center back"
            icon={<FaLocationArrow />}
            isRound
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                  const { latitude, longitude } = position.coords;
                  const x = { lat: latitude, lng: longitude };
                  setCurr(x);
                  map.panTo(x);
                  map.setZoom(9);
                });
              } else {
                map.panTo(center);
                map.setZoom(9);
              }
            }}
          />
        </HStack>
      </Box>
    </Flex>);
}

export default React.memo(Map);
