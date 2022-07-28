import React, { Component } from "react";
import { API_URL, API_KEY } from "../../config";
import Navigation from "../elements/Navigation/Navigation";
import MovieInfo from "../elements/MovieInfo/MovieInfo";
import MovieInfoBar from "../elements/MovieInfoBar/MovieInfoBar";
import FourColGrid from "../elements/FourColGrid/FourColGrid";
import Actor from "../elements/Actor/Actor";
import Spinner from "../elements/Spinner/Spinner";
import "./Movie.css";

class Movie extends Component {
  state = {
    movie: null,
    actors: null,
    directors: [],
    loading: false,
  };

  componentDidMount() {
    const { movieId } = this.props.match.params;

    if (localStorage.getItem(`${movieId}`)) {
      const state = JSON.parse(localStorage.getItem(`${movieId}`));
      this.setState({ ...state });
    } else {
      this.setState({ loading: true });
      // First fetch the movie...
      const endpoint = `${API_URL}movie/${movieId}?api_key=${API_KEY}&language=en-US`;
      this.fetchItems(endpoint);
    }
  }

  fetchItems = async (endpoint) => {
    const { movieId } = this.props.match.params;

    try {
      const result = await (await fetch(endpoint)).json();

      if (result.status_code) {
        this.setState({ loading: false });
      } else {
        this.setState({ movie: result });
        const creditsEndpoint = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`;
        const creditsResult = await (await fetch(creditsEndpoint)).json();
        const directors = creditsResult.crew.filter(
          (member) => member.job === "Director"
        );

        this.setState(
          {
            actors: creditsResult.cast,
            directors, // the same as directors: directors
            loading: false,
          },
          () => {
            localStorage.setItem(`${movieId}`, JSON.stringify(this.state));
          }
        );
      }
    } catch (e) {
      console.error("Error: ", e);
    }
  };

  // fetchItems = endpoint => {
  //     const { movieId } = this.props.match.params;

  //     fetch(endpoint)
  //         .then(result => result.json())
  //         .then(result => {

  //             if (result.status_code) {
  //                 this.setState({ loading: false });
  //             } else {
  //                 this.setState({ movie: result }, () => {
  //                     // ... then fetch actors in the setState callback function
  //                     const creditsEndpoint = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`;
  //                     fetch(creditsEndpoint)
  //                         .then(creditsResult => creditsResult.json())
  //                         .then(creditsResult => {
  //                             const directors = creditsResult.crew.filter((member) => member.job === "Director");

  //                             this.setState({
  //                                 actors: creditsResult.cast,
  //                                 directors, // the same as directors: directors
  //                                 loading: false
  //                             }, () => {
  //                                 localStorage.setItem(`${movieId}`, JSON.stringify(this.state));
  //                             });
  //                         })
  //                     console.log('Second: ', creditsResult);
  //                 });
  //             }

  //             console.log('First: ', result);
  //         })
  //         .catch(error => console.error('Error: ', error))
  // }

  render() {
    const { movie, actors, directors, loading } = this.state;
    const { location } = this.props;

    return (
      <div className="rmdb-movie">
        {movie ? (
          <div>
            <Navigation movie={location.movieName} />
            <MovieInfo movie={movie} directors={directors} />
            <MovieInfoBar
              time={movie.runtime}
              budget={movie.budget}
              revenue={movie.revenue}
            />
          </div>
        ) : null}
        {this.state.actors ? (
          <div className="rmdb-movie-grid">
            <FourColGrid header={"Actors"}>
              {actors.map((element) => {
                return <Actor key={element.id.toString()} actor={element} />;
              })}
            </FourColGrid>
          </div>
        ) : null}
        {!actors && !loading ? <h1>No Movie Found!</h1> : null}
        {loading ? <Spinner /> : null}
      </div>
    );
  }
}

export default Movie;
