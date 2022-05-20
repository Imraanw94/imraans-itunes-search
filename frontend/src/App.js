import "bootstrap/dist/css/bootstrap.min.css"; // Import some styling from Bootstrap
import { FavList } from "./components/Favourites/FavList";

import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import HomePage from "./components/Home/HomePage";

function App() {
  // On initial load, we initialise the "inFavourites" value
  useEffect(() => {
    if (sessionStorage.getItem("inFavourites") === null) {
      sessionStorage.setItem("inFavourites", false);
    }
  }, []);

  return (
    <div>
      <BrowserRouter>
        <div>
          <Header />
          <hr></hr>
          <Routes>
            <Route exact={true} path="/" element={<HomePage />}></Route>
            <Route path="/fav" element={<FavList />}></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
