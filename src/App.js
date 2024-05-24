import "./App.css";
import logo from "./logo.svg";

import { useCallback, useEffect, useRef, useState } from "react";
import NavigationBar from "./pages/NavigationBar";
import axios from "axios";

function App() {
  const baseURL = "http://localhost:7071";
  const [images, setImages] = useState([]);
  const [scanResults, setScanResults] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState("November");

  //TODO: API functions (more to be added) should be in their own file!
  const getEvents = () => {
    axios
      .get(`${baseURL}/events`)
      .then(function (response) {
        setScanResults(response.data.scanResults);
        setImages(response.data.scanResults);
        console.log(response);
      })
      .catch(function (error) {
        //TODO: this should display an error in the UI!
        console.log(error);
      });
  };

  const getCameras = () => {
    axios
      .get(`${baseURL}/camera`)
      .then((response) => {
        setCameras(response.data);
      })
      .catch(function (error) {
        //TODO: this should display an error in the UI!
        console.log(error);
      });
  };
  const canvasRef = useRef(null);

  useEffect(() => {
    getEvents();
    getCameras();
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      const img = new Image();
      img.src = images[currentImageIndex]?.jpg;
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        for (
          let i = 0;
          i < images[currentImageIndex]?.detectionsList?.length;
          i++
        ) {
          const coordinates =
            images[currentImageIndex].detectionsList[i].roicoordsList;

          ctx.beginPath();
          ctx.moveTo(coordinates[0], coordinates[1]);
          ctx.lineTo(coordinates[2], coordinates[3]);
          ctx.lineTo(coordinates[4], coordinates[5]);
          ctx.lineTo(coordinates[6], coordinates[7]);
          ctx.lineTo(coordinates[0], coordinates[1]);
          ctx.strokeStyle = "red";
          ctx.stroke();
        }
      };
    }
  }, [canvasRef, currentImageIndex, images]);

  const onNextImage = useCallback(() => {
    const nextImageIndex =
      currentImageIndex + 1 < images.length ? currentImageIndex + 1 : 0;

    setCurrentImageIndex(nextImageIndex);
  }, [currentImageIndex, images]);

  const onPrevImage = useCallback(() => {
    const prevImageIndex =
      currentImageIndex - 1 >= 0 ? currentImageIndex - 1 : images.length - 1;

    setCurrentImageIndex(prevImageIndex);
  }, [currentImageIndex, images]);

  const onFilterByDetections = useCallback(
    (e) => {
      if (e.target.checked) {
        const filteredImages = scanResults.filter(
          (image) => image.detectionsList.length > 0
        );

        setImages(filteredImages);
      } else {
        setImages(scanResults);
      }
    },
    [scanResults]
  );

  return (
    //TODO: This code should be factored out into multiple files
    <div
      className="App"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <NavigationBar />
      <div
        // TODO: Styles can be defined in a seperate file using mui useStyle
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center",
          width: "85%",
          height: "100%",
        }}
      >
        <button type="button" onClick={onPrevImage}>
          Previous Image
        </button>
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
            }}
          >
            {cameras?.length ? (
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <span>Selected Camera</span>
                <select
                  name="selectedCamera"
                  onChange={(e) => {
                    setSelectedCamera(e.target.value);
                  }}
                >
                  {cameras.map((camera) => (
                    <option
                      value={camera.tags.name}
                      selected={selectedCamera === camera.tags.name}
                    >
                      {camera.tags.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            <span style={{ fontSize: 14, fontWeight: 500 }}>Filters</span>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 10,
                fontSize: 14,
              }}
            >
              <input
                type="checkbox"
                id="detections"
                name="detections"
                onChange={onFilterByDetections}
              />
              <label hmtlFor="detections">Includes Gas Detections</label>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <div> {images.length} total images </div>
            <div> Index: {currentImageIndex} </div>
          </div>
          {images.length > 0 && (
            <canvas
              ref={canvasRef}
              width="300"
              height="400"
              style={{
                border: "2px solid black",
              }}
            />
          )}
          {images[currentImageIndex]?.createdOn && (
            <div> Scan Timestamp: {images[currentImageIndex].createdOn} </div>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              fontSize: 14,
            }}
          >
            <h3 style={{ marginBottom: 5 }}>Image Metadata</h3>

            {images[currentImageIndex]?.noiseFloorMetric ? (
              <span>{`Noise Floor Level: ${images[currentImageIndex].noiseFloorMetric}`}</span>
            ) : null}

            {images[currentImageIndex]?.overallConf ? (
              <span>{`Confidence Level: ${images[currentImageIndex].overallConf}`}</span>
            ) : null}

            <div style={{ marginBottom: 5 }}>
              {" "}
              Number of Detections:{" "}
              {images[currentImageIndex]?.detectionsList.length}{" "}
            </div>
            {images[currentImageIndex]?.detectionsList?.length ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  fontSize: 14,
                  alignItems: "flex-start",
                }}
              >
                <span>Mean coldens values: </span>
                <span
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    maxWidth: 345,
                    marginBottom: 3,
                    textAlign: "start",
                  }}
                >
                  {images[currentImageIndex]?.detectionsList
                    .map((detection) => detection.meancoldens)
                    .join(", ")}
                </span>
              </div>
            ) : null}
            {images[currentImageIndex]?.detectionsList?.length ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <span>Mean confidence values: </span>
                <span
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    maxWidth: 345,
                    marginBottom: 3,
                    textAlign: "start",
                  }}
                >
                  {images[currentImageIndex]?.detectionsList
                    .map((detection) => detection.meanconf)
                    .join(", ")}
                </span>
              </div>
            ) : null}
            {images[currentImageIndex]?.detectionsList?.length ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  fontSize: 14,
                  alignItems: "flex-start",
                }}
              >
                <span>Sum confidence values: </span>
                <span
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    maxWidth: 345,
                    marginBottom: 3,
                    textAlign: "start",
                  }}
                >
                  {images[currentImageIndex]?.detectionsList
                    .map((detection) => detection.sumconf)
                    .join(", ")}
                </span>
              </div>
            ) : null}
          </div>
        </div>
        {/* TODO: This button also does nothing  */}
        <button type="button" onClick={onNextImage}>
          Next Image
        </button>
      </div>
    </div>
  );
}

export default App;
