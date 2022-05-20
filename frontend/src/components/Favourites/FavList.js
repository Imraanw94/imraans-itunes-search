import { useEffect, useState } from "react";
import { Card, Container, ListGroup, Row } from "react-bootstrap";
import { AudiobookResult } from "../Home/SearchResults/AudiobookResult";
import { EbookResult } from "../Home/SearchResults/EbookResult";
import { MovieResult } from "../Home/SearchResults/MovieResult";
import { MusicResult } from "../Home/SearchResults/MusicResult";
import { PodcastResult } from "../Home/SearchResults/PodcastResult";
import { SoftwareResult } from "../Home/SearchResults/SoftwareResult";
import { TVShowResult } from "../Home/SearchResults/TVShowResult";
export function FavList(props) {
  /**
   * @type {array}
   * favouritesData is used to store the data received from the fetch API
   */
  const [favouritesData, setFavouritesData] = useState([]);
  /**
   * @type {object}
   * favComponents is used to store the components to be rendered within FavList
   */
  const [favComponents, setFavComponents] = useState(null);
  /**
   * @type {boolean}
   * loading is used to indicate to the user that the application is still
   * waiting to receive data from the API
   */
  const [loading, setLoading] = useState(false);
  /**
   * @type {object}
   * error is used to indicate to the user if there has been an error trying to
   * retrieve data from the API
   */
  const [error, setError] = useState(null);
  /**
   * @type {boolean}
   * nothing is used to indicate whether or not the user has saved any media to favourites
   */
  const [nothing, setNothing] = useState(false);

  // On initial load of the Component, call the function to load user favourites
  useEffect(() => {
    loadFavourites();
  }, []);

  // This function uses the fetch API to obtain the details of the user's favourited media.
  // We use the IDs of the favourited media to fetch the rest of the details
  function loadFavourites() {
    // Array of IDs to lookup
    let idLookup = [];
    // This is a check if we're unit testing this component, as IDs are saved in the local storage of the browser
    if (props.testIDs !== undefined) {
      idLookup = props.testIDs;
    } else {
      // Get the IDs from the local storage of the browser
      idLookup = localStorage.getItem("favourites");
    }
    fetch(
      //Instead of hassling with stringifying arrays into a URL, I use URLSearchParams to set the paramaters for the call
      // URL would look like: /favourites?idArray=%5B1498844775%2C1108257204%2C1490222697%2C287000993%2C1497290440%2C811377230%2C448142450%5D
      "/favourites?" + new URLSearchParams({ idArray: idLookup }).toString()
    )
      .then((response) => {
        // Get the response from the API call
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        setFavouritesData(data); // Set the data to a usable state
      })
      .catch((error) => {
        console.error("Error fetching data: ", error); // Handle any error in fetching the data
        setError(error);
      })
      .finally(() => {
        setLoading(false); // We're no longer waiting for any response
      });
  }

  // Everytime favouritesData changes, render the components to display the data
  useEffect(() => {
    // If there are any favourited media, render the components to display them and remove the component that displays nothing
    if (favouritesData.resultCount > 0) {
      setNothing(false);
      setFavComponents(favouritesData.results.map(checkMediaKind));
    } else {
      setNothing(true);
    }
  }, [favouritesData]);

  // Depending on the media type/kind, return the respective Component to render
  function checkMediaKind(result, index, arr) {
    let mediaType = "";
    let key = "";
    // If the result has a kind value, set the media type to that value
    // If the result does not have a kind value, it has a wrapperType we can set the mediaType as
    if (result.kind !== undefined) {
      mediaType = result.kind;
      key = mediaType + index;
    } else {
      mediaType = result.wrapperType;
      key = mediaType + index;
    }
    // Switch case to return a Component respective to its mediaType
    switch (mediaType) {
      case "audiobook":
        return (
          <AudiobookResult
            key={key}
            index={index}
            result={result}
            onDelete={loadFavourites}
          />
        );
      case "ebook":
        return (
          <EbookResult
            key={key}
            index={index}
            result={result}
            onDelete={loadFavourites}
          />
        );
      case "feature-movie":
        return (
          <MovieResult
            key={key}
            index={index}
            result={result}
            onDelete={loadFavourites}
          />
        );
      case "song":
        return (
          <MusicResult
            key={key}
            index={index}
            result={result}
            onDelete={loadFavourites}
          />
        );
      case "podcast":
        return (
          <PodcastResult
            key={key}
            index={index}
            result={result}
            onDelete={loadFavourites}
          />
        );
      case "software":
        return (
          <SoftwareResult
            key={key}
            index={index}
            result={result}
            onDelete={loadFavourites}
          />
        );
      case "collection":
        return (
          <TVShowResult
            key={key}
            index={index}
            result={result}
            onDelete={loadFavourites}
          />
        );
    }
  }

  // If loading is set to true when fetching the data, display a loading Card
  function LoadingCard() {
    return (
      <Container style={{ marginTop: "15px" }}>
        <Card border="warning">
          <Card.Body>
            <Card.Title>Loading Page...</Card.Title>
            <Card.Text>Please wait while we load your page...</Card.Text>
          </Card.Body>
        </Card>
      </Container>
    );
  }
  // If the error state is truthy after trying to fetch the data, display an
  // error Card
  function ErrorCard() {
    return (
      <Container style={{ marginTop: "15px" }}>
        <Card border="danger">
          <Card.Body>
            <Card.Title>Error</Card.Title>
            <Card.Text>"Error fetching data"</Card.Text>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  // If nothing is set to true, display a Card saying there are no favourites
  function NoFavouritesCard() {
    return (
      <Container style={{ marginTop: "15px" }}>
        <Card border="info">
          <Card.Body>
            <Card.Title>Nothing Here Yet!</Card.Title>
            <Card.Text>
              No Favourites added yet. Use this site to search the iTunes API
              for your favourite media!
            </Card.Text>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  // Conditional rendering to display correct information
  return (
    <Container>
      <Row>
        <ListGroup>
          <ListGroup.Item variant="info">
            {loading && <LoadingCard />}
            {error && <ErrorCard />}
            {nothing && <NoFavouritesCard />}
            {!loading && !error && !nothing && favComponents}
          </ListGroup.Item>
        </ListGroup>
      </Row>
    </Container>
  );
}
