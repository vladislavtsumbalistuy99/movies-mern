const { Router } = require("express");
const Movies = require("../models/Movies");
const router = Router();

router.get("/", async (req, res) => {
  try {
    Movies.find(function (err, movies) {
      res.json(movies);
    });
  } catch (e) {
    res.status(500).json({ message: "Oops, something went wrong..." });
  }
  // Movies.find()
  // .then(movies => res.json(movies))
  // .catch(err => res.status(400).json('Error: ' + err));
});


router.post("/addMovie", async (req, res) => {
  try {
    const { id, title, year, format, stars } = req.body;
    const arrStars = stars.split(' ');
    console.log(arrStars);
    const movie = new Movies({ id, title, year, format, stars:arrStars });
    console.log(movie);
    await movie.save();

    res.status(201).json({ message: "Movie added" });
  } catch (e) {
    res.status(500).json({ message: "Oops, something went wrong..." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const toDelete = await Movies.findOne({id})
    
    await toDelete.delete()

    res.status(201).json({ message: "Movie deleted" });
  } catch (e) {
    res.status(500).json({ message: "Oops, something went wrong..." });
  }
});

router.get("/search/:param", async (req, res) => {
  try {
    const { param } = req.params;
    const moviesByTitle = await Movies.findOne({title:param})
    const moviesBystar = await Movies.find({stars:param})
    const movies = moviesByTitle || moviesBystar;
    res.json(movies);
  } catch (e) {
    res.status(500).json({ message: "Oops, something went wrong..." });
  }
});

router.get("/sort", async (req, res) => {
  try {
    Movies.find(function (err, movies) {
      movies.sort((a, b) => a.title > b.title ? 1 : -1);
      res.json(movies);
    });
  } catch (e) {
    res.status(500).json({ message: "Oops, something went wrong..." });
  }
});



module.exports = router;
