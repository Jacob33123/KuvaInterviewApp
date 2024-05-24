import "./App.css";

import NavigationBar from "./pages/NavigationBar";
import { ImagesContextProvider } from "./providers/images-context";
import ImageGallery from "./components/ImageGallery";

function App() {
  return (
    <div className="App">
      <NavigationBar />
      <ImagesContextProvider>
        <ImageGallery />
      </ImagesContextProvider>
    </div>
  );
}

export default App;
