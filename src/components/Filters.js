import "./ImageGallery.css";
import { useImagesContext } from "../providers/images-context";

const Filters = () => {
  const { onFilterByDetections } = useImagesContext();

  return (
    <div className="filters-wrapper">
      <span className="filter-label">Filters: </span>
      <div className="filter-input">
        <input
          type="checkbox"
          id="detections"
          name="detections"
          onChange={onFilterByDetections}
        />
        <label hmtlFor="detections">Includes Gas Detections</label>
      </div>
    </div>
  );
};

export default Filters;
