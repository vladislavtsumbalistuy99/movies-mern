import React, { useEffect, useState } from "react";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";
import { Pagination } from "../components/Pagination";

export const Movies = () => {
  const { request, error, clearError } = useHttp();
  const message = useMessage();
  const [movies, setMovies] = useState([]);
  const [showInfo, setShowInfo] = useState({});
  const [searchPar, setSeachPar] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage, setMoviesPerPage] = useState(4);

  const toggleInfo = (id) => {
    setShowInfo((prevShowInfo) => ({
      ...prevShowInfo,
      [id]: !prevShowInfo[id],
    }));
  };

  useEffect(() => {
    fetch("http://localhost:3000/api/movies")
      .then((res) => res.json())
      .then((movies) => setMovies(movies));
  }, []);

  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);

  const deleteMovieHandler = async (id) => {
    try {
      const data = await request("/api/movies/" + id, "DELETE");
      const newMovies = await request("/api/movies/", "GET");
      setMovies(newMovies);
      message(data.message);
    } catch (e) {}
  };

  const searchHandler = async (event) => {
    setSeachPar(event.target.value);
  };

  const showSearchResult = async () => {
    try {
      if (searchPar === "") {
        const newMovies = await request("/api/movies/", "GET");
        setMovies(newMovies);
      } else {
        const data = await request("/api/movies/search/" + searchPar, "GET");
        if (typeof data != Array) {
          const newData = [data];
          setMovies(newData);
        } else {
          setMovies(data);
        }
      }
    } catch (e) {}
  };

  const sortHandler = async () => {
    try {
      const sortedMovies = await request("/api/movies/sort", "GET");
      setMovies(sortedMovies);
    } catch (e) {}
  };

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="App">
      <h1>Movies list:</h1>
      <div className="row">
        <i
          className="small material-icons col s8 push-s3 waves-effect"
          onClick={sortHandler}
        >
          sort_by_alpha
        </i>
        <div className="input-field col s6 push-s3">
          <i className="material-icons prefix waves-effect" onClick={showSearchResult}>
            search
          </i>
          <textarea
            id="icon_prefix2"
            className="materialize-textarea"
            onChange={searchHandler}
          ></textarea>
          <label htmlFor="icon_prefix2">Search</label>
        </div>
      </div>
      {currentMovies.map((movie) => (
        <div className="row" key={movie.id}>
          <div className="col s6 offset-s3">
            <div className="card blue darken-1">
              <div className="card-content white-text">
                <div>Title: {movie.title}</div>
                {showInfo[movie.id] ? (
                  <div>
                    <div>Release year: {movie.year}</div>
                    <div>Format: {movie.format}</div>
                    <div>Stars: {movie.stars}</div>
                  </div>
                ) : null}
              </div>
              <div className="card-action">
                <button
                  className="btn yellow darken-4"
                  style={{ marginRight: 10 }}
                  onClick={() => toggleInfo(movie.id)}
                >
                  Show/Hide Details
                </button>
                <button
                  className="btn red lighten-1 white-text"
                  onClick={() => deleteMovieHandler(movie.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      <Pagination
        moviesPerPage={moviesPerPage}
        totalMovies={movies.length}
        paginate={paginate}
      />
    </div>
  );
};
