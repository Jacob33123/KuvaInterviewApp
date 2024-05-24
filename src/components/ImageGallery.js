import "./ImageGallery.css";
import { useEffect, useRef } from "react";
import { useImagesContext } from "../providers/images-context";
import ImageMetadata from "./ImageMetadata";
import CameraSelect from "./CameraSelect";
import Filters from "./Filters";

const ImageGallery = () => {
  const { currentImageIndex, images, onPrevImage, onNextImage } =
    useImagesContext();
  const canvasRef = useRef(null);

  // Draw gas detection rectangles based off coordinate metadata
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

  return (
    <div className="image-gallery-wrapper">
      <div className="image-gallery">
        <div className="gallery-button-wrapper">
          <div className="gallery-button" onClick={onPrevImage}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="60"
              height="60"
              fill="black"
              class="bi bi-caret-left-fill"
              viewBox="0 0 16 16"
            >
              <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
            </svg>
          </div>
        </div>
        <div className="mid-section">
          <div className="upper-wrapper">
            <Filters />
            <CameraSelect />
          </div>
          <div className="image-count">
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
            <div style={{ fontSize: 14 }}>
              {" "}
              Scan Timestamp: {images[currentImageIndex].createdOn}{" "}
            </div>
          )}
          <ImageMetadata />
        </div>
        <div className="gallery-button-wrapper">
          <div className="gallery-button" onClick={onNextImage}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="60"
              height="60"
              // fill="black"
              class="bi bi-caret-right-fill"
              viewBox="0 0 16 16"
            >
              <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
