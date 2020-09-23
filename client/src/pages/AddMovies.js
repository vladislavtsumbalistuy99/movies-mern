import React, { useEffect, useState } from "react";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";
import Select from "react-select";
import swal from 'sweetalert';


export const AddMovies = () => {
  const message = useMessage();
  const { request, error, clearError } = useHttp();
  const shortid = require("shortid");
  const colourStyles = {
    control: styles => ({ ...styles, backgroundColor: 'white' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: '#2196F3',
        cursor: isDisabled ? 'not-allowed' : 'default',
    
      };
    },
  };
  const options = [
    { value: "DVD", label: "DVD" },
    { value: "VHS", label: "VHS" },
    { value: "Blu-Ray", label: "Blu-Ray" },
  ];

  const [form, setForm] = useState({
    id: "",
    title: "",
    year: "",
    format: "",
    stars: [],
  });

  const [selectedOption, setSelectedOption] = useState(null);
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

  const changeSelectorHandler = (selectedOption) => {
    setSelectedOption(selectedOption)
    setForm({
      ...form,
      format: selectedOption.value,
    });
  };

  const newMovieHandler = async () => {
    try {
      console.log(form)
      const data = await request("/api/movies/addMovie", "POST", { ...form });
      message(data.message);
      setForm({
        id: "",
        title: "",
        year: "",
        format: "",
        stars: [],
      });
      setSelectedOption(null)
    } catch (e) {}
  };

  const handleChangeFile = (e) => {
    e.preventDefault();
    if (e.target.files[0].type == 'text/plain') {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const movies = e.target.result;
        if(movies === ''){
          document.getElementById("fileLoader").value = "";
          swal("Oops!", "File should not be empty!", "error");
          return;
        }
        stringMoviesToArray(movies);
      };
      reader.readAsText(e.target.files[0]);
    } else {
      e.target.value = null;
      swal("Oops!", "File should be .txt!", "error");
    }

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

              <Select
                value={selectedOption}
                onChange={changeSelectorHandler}
                options={options}
                name="format"
                id="format"
                styles={colourStyles}
                placeholder='Choose type'
              />

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
            <input type="file" onChange={handleChangeFile} id='fileLoader' />
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
