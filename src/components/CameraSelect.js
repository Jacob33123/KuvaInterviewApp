import "./ImageGallery.css";
import { useImagesContext } from "../providers/images-context";

const CameraSelect = () => {
  const { cameras, selectedCamera, onSelectCamera } = useImagesContext();

  return cameras?.length ? (
    <div className="camera-select">
      <span>Selected Camera:</span>
      <select name="selectedCamera" onChange={onSelectCamera}>
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
  ) : null;
};

export default CameraSelect;
