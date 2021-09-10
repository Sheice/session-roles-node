const { Router } = require("express");
const {getMovieById, getMovies, updateMovie, deleteMovie, createMovie} = require('../controllers/Movies.Controllers');
const {verifyToken, isModerator} = require('../middlewares/auth.jwt');

const route = Router();

route.get('/', getMovies);

route.post('/add', [verifyToken, isModerator], createMovie);

route.get('/one/:movieID', getMovieById);

route.put('/update/:movieID', [verifyToken, isModerator], updateMovie);

route.delete('/delete/:movieID', [verifyToken, isModerator], deleteMovie);

module.exports = route;