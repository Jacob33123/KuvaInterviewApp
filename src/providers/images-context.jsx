import axios from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const ImagesContext = createContext(undefined);

export const ImagesContextProvider = ({ children }) => {
  const baseURL = "http://localhost:7071";
  const [images, setImages] = useState([]);
  const [scanResults, setScanResults] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState("November");

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

  useEffect(() => {
    getEvents();
    getCameras();
  }, []);

  const onSelectCamera = useCallback(
    (e) => {
      setSelectedCamera(e.target.value);
    },
    [setSelectedCamera]
  );

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
    <ImagesContext.Provider
      value={{
        currentImageIndex,
        images,
        cameras,
        selectedCamera,
        onSelectCamera,
        onNextImage,
        onPrevImage,
        onFilterByDetections,
      }}
    >
      {children}
    </ImagesContext.Provider>
  );
};

export const useImagesContext = () => {
  const imagesContext = useContext(ImagesContext);

  if (imagesContext === undefined) {
    throw new Error("useImagesContext must be inside a ImagesContextProvider");
  }

  return imagesContext;
};
