import "./ImageGallery.css";
import React from "react";
import { useImagesContext } from "../providers/images-context";

const ImageMetadata = () => {
  const { currentImageIndex, images } = useImagesContext();

  return (
    <div className="image-metadata">
      <h4 style={{ margin: "5px 0 5px 0" }}>Image Metadata</h4>

      {images[currentImageIndex]?.noiseFloorMetric ? (
        <span>{`Noise Floor Level: ${images[currentImageIndex].noiseFloorMetric}`}</span>
      ) : null}

      {images[currentImageIndex]?.overallConf ? (
        <span>{`Confidence Level: ${images[currentImageIndex].overallConf}`}</span>
      ) : null}

      <div style={{ marginBottom: 5 }}>
        {" "}
        Number of Detections: {
          images[currentImageIndex]?.detectionsList.length
        }{" "}
      </div>

      {images[currentImageIndex]?.detectionsList?.length ? (
        <div className="detection-list-item">
          <span>Mean coldens values: </span>
          <span className="detection-list-value">
            {images[currentImageIndex]?.detectionsList
              .map((detection) => detection.meancoldens)
              .join(", ")}
          </span>
        </div>
      ) : null}

      {images[currentImageIndex]?.detectionsList?.length ? (
        <div className="detection-list-item">
          <span>Mean confidence values: </span>
          <span className="detection-list-value">
            {images[currentImageIndex]?.detectionsList
              .map((detection) => detection.meanconf)
              .join(", ")}
          </span>
        </div>
      ) : null}

      {images[currentImageIndex]?.detectionsList?.length ? (
        <div className="detection-list-item">
          <span>Sum confidence values: </span>
          <span className="detection-list-value">
            {images[currentImageIndex]?.detectionsList
              .map((detection) => detection.sumconf)
              .join(", ")}
          </span>
        </div>
      ) : null}
    </div>
  );
};

export default ImageMetadata;
