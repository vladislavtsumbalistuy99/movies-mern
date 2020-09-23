const { Router } = require("express");
const Movies = require("../models/Movies");
const { check, validationResult } = require("express-validator");
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

router.post(
  "/addMovie",
  [
    check("title").not().isEmpty().withMessage("Title can't be empty"),
    check("year")
      .matches(/(18[5-8][0-9]|189[0-9]|19[0-9]{2}|20[01][0-9]|2020)/)
      .withMessage("Year must be between 1850 and 2020"),
    check("stars").not().isEmpty().withMessage("Stars can't be empty"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: errors.array()[0].msg,
        });
      }
      const { id, title, year, format, stars } = req.body;
      const arrStars = stars.split(" ");
      let result = [];
      for (let str of arrStars) {
        if (!result.includes(str)) {
          //str = str + ', '
          result.push(str);
        }
      }

      const checkTitle = await Movies.find({ title: title });
      if(checkTitle.length >0){
        for(let i =0;i<checkTitle.length;i++){
          if(year == checkTitle[i].year || stars.toString() == checkTitle[i].stars.toString()){
            res.status(200).json({ message: "Oops, this moovie already exist!" });
            return
          }
        } 
      }
      // const checkYear = await Movies.find({ title: year });

      const movie = new Movies({ id, title, year, format, stars: result });
      await movie.save();

      res.status(201).json({ message: "Movie added" });
    } catch (e) {
      res.status(500).json({ message: "Oops, something went wrong..." });
    }
  }
);

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const toDelete = await Movies.findOne({ id });

    await toDelete.delete();

    res.status(201).json({ message: "Movie deleted" });
  } catch (e) {
    res.status(500).json({ message: "Oops, something went wrong..." });
  }
});

router.get("/search/:param", async (req, res) => {
  try {
    const { param } = req.params;
    const moviesByTitle = await Movies.find({ $text: { $search: param } });
    const moviesBystar = await Movies.find({ stars: param });
    let movies;
    if (moviesByTitle.length > 0) {
      movies = moviesByTitle;
    } else {
      movies = moviesBystar;
    }
    res.json(movies);
  } catch (e) {
    res.status(500).json({ message: "Oops, something went wrong..." });
  }
});

router.get("/sort", async (req, res) => {
  try {
    Movies.find(function (err, movies) {
      movies.sort((a, b) => {
        let x = a.title.toLowerCase();
        let y = b.title.toLowerCase();
        return x > y ? 1 : -1;
      });
      res.json(movies);
    });
  } catch (e) {
    res.status(500).json({ message: "Oops, something went wrong..." });
  }
});

module.exports = router;
