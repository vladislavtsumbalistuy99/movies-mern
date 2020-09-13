import React, { useEffect, useState } from "react";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";

export const AddMovies = () => {
  const message = useMessage();
  const { request, error, clearError } = useHttp();
  const shortid = require("shortid");

  const [form, setForm] = useState({
    id: "",
    title: "",
    year: "",
    format: "",
    stars: [],
  });

  const [uploadMovies, setUploadMovies] = useState([]);

  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);

  const changeHandler = (event) => {
    setForm({
      ...form,
      id: shortid.generate(),
      [event.target.name]: event.target.value,
    });
  };

  const newMovieHandler = async () => {
    try {
      const data = await request("/api/movies/addMovie", "POST", { ...form });
      message(data.message);
      setForm({
        id: "",
        title: "",
        year: "",
        format: "",
        stars: [],
      });
    } catch (e) {}
  };

  const handleChangeFile = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = async (e) => {
      const movies = e.target.result;
      stringMoviesToArray(movies);
    };
    reader.readAsText(e.target.files[0]);
  };

  const stringMoviesToArray = (movies) => {
    const array = movies
      .replace(/\bTitle: \b/g, "")
      .replace(/\bRelease Year: \b/g, "")
      .replace(/\bFormat: \b/g, "")
      .replace(/\bStars: \b/g, "")
      .split("\n");
    const filtered = array.filter((e) => e !== "");
    let moviesArr = [];
    for (let i = 0; i < filtered.length; i = i + 4) {
      let newArr = filtered.concat(0, 3);
      let obj = {
        id: shortid.generate(),
        title: newArr[i],
        year: newArr[i + 1],
        format: newArr[i + 2],
        stars: newArr[i + 3],
      };
      moviesArr.push(obj);
    }

    setUploadMovies(moviesArr);
  };

  const uploadMovieHandler = async () => {
    try {
      message("Wait...");
      for (let i = 0; i < uploadMovies.length; i++) {
        await request("/api/movies/addMovie", "POST", uploadMovies[i]);
      }
      message("Movies added!");
    } catch (e) {}
  };

  return (
    <div className="row">
      <div className="col s6 offset-s3">
        <h1>Add new movie</h1>
        <div className="card blue darken-1">
          <div className="card-content white-text">
            <span className="card-title">Enter data</span>
            <div>
              <div className="input-field">
                <input
                  placeholder="Enter title"
                  id="title"
                  type="text"
                  name="title"
                  className="yellow-input"
                  value={form.title}
                  onChange={changeHandler}
                />
              </div>

              <div className="input-field">
                <input
                  placeholder="Enter year"
                  id="year"
                  type="text"
                  name="year"
                  className="yellow-input"
                  value={form.year}
                  onChange={changeHandler}
                />
              </div>

              <div className="input-field">
                <input
                  placeholder="Enter format"
                  id="format"
                  type="text"
                  name="format"
                  className="yellow-input"
                  value={form.format}
                  onChange={changeHandler}
                />
              </div>

              <div className="input-field">
                <input
                  placeholder="Enter stars with a space"
                  id="stars"
                  type="text"
                  name="stars"
                  className="yellow-input"
                  value={form.stars}
                  onChange={changeHandler}
                />
              </div>
            </div>
          </div>
          <div className="card-action">
            <button
              className="btn yellow darken-4"
              style={{ marginRight: 10 }}
              onClick={newMovieHandler}
            >
              Add movie
            </button>
            <p className="card-title white-text">Or just upload a file:</p>
            <input type="file" onChange={handleChangeFile} />
            <button
              className="btn yellow darken-4"
              style={{ marginRight: 10 }}
              onClick={uploadMovieHandler}
            >
              Upload movies
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
