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
    } catch (e) {}
  };

  const handleChangeFile = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      console.log(text);
      alert(text);
    };
    console.log(reader)
    reader.readAsText(e.target.files[0]);
    console.log(reader)
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
                  placeholder="Enter stars"
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
            <input type="file" onChange={handleChangeFile} />
          </div>
        </div>
      </div>
    </div>
  );
};
