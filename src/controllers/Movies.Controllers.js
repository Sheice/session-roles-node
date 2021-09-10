const Movie = require('../models/Movie');
const path = require('path');
const cloudinary = require('cloudinary');
const fs = require('fs-extra');

const MoviesCtrl = {};

// config cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})


MoviesCtrl.getMovies = async (req, res) => {

    const movies = await Movie.find();
    return res.json({success: true, movies});
}

MoviesCtrl.createMovie = async (req, res) => {
    const { title, description, author, category, } = req.body;
    if(!title || !description || !author || !category || !req.file){
        return res.json({success: false, msg:'Completa todos los datos'});
    }

    if(req.file.size > 2000000){
        fs.unlink(req.file.path);
        return res.json({success: false, msg:'El archivo es muy pesado'})
    }

    console.log(path.extname(req.file.originalname))

    if(path.extname(req.file.originalname) === '.jpg' || path.extname(req.file.originalname) === '.jpeg' || path.extname(req.file.originalname) === '.png'){
       
        const image =  await cloudinary.v2.uploader.upload(req.file.path)
     
      
        const newMovie = new Movie({
            title,
            description,
            author,
            category,
            imgUrl: image.url,
            imgIdPublic: image.public_id
        });
    
        fs.unlink(req.file.path);
        const movie = await newMovie.save();
    
    
        
        return res.json({success: true, msg:'Agregado correctamente', movie})   
    }

fs.unlink(req.file.path);
return res.json({success: false, msg:'Extensión de la imágen inválida'}); 
}

MoviesCtrl.getMovieById = async (req, res) => {
    const oneMovie = await Movie.findById(req.params.movieID);

    if(!oneMovie){
        res.json({success: false, msg:'Ocurrió un error, intente de nuevo'})
    }

    res.json({success: true, movie: oneMovie});
}

MoviesCtrl.updateMovie = async (req, res) => {
    const movie = await Movie.findById(req.params.movieID);

    if(!movie){
        return res.json({success: false, msg:'Ha ocurrido un error, intentelo de nuevo'});
    }

    if(req.file){
        if(req.file.size > 200000){
            fs.unlink(req.file.path);
            return res.json({success: false, msg:'El archivo es muy pesado'})

        }
    
        if(path.extname(req.file.originalname) === '.jpg' || path.extname(req.file.originalname) === '.jpeg' || path.extname(req.file.originalname) === '.png'){
            await cloudinary.v2.uploader.destroy(movie.imgIdPublic)
            const image =  await cloudinary.v2.uploader.upload(req.file.path);
    
            const reqBody = req.body;
            const movieUpdated = await Movie.findByIdAndUpdate(req.params.movieID, {
                reqBody,
                imgUrl: image.url,
                imgIdPublic: image.public_id
            }, {new: true});
            fs.unlink(req.file.path);
    
           return res.json({success: true, msg:'Se ha actualizado correctamente', movieUpdated})
        }
        fs.unlink(req.file.path);
        return res.json({success: false, msg:'Extensión de la imágen inválida'});
        
    } else {
        const movieUpdated = await Movie.findByIdAndUpdate(req.params.movieID, req.body,{new: true});
        return res.json({success: true, msg:'Se ha actualizado correctamente', movieUpdated})
    }
}

MoviesCtrl.deleteMovie = async (req, res) => {
    const movie = await Movie.findByIdAndDelete(req.params.movieID);
   if(movie){
       await cloudinary.v2.uploader.destroy(movie.imgIdPublic)
    res.json({success: true, movie, msg:'Se ha eliminado correctamente'})
   }
   res.json({success: false, msg: 'Ha ocurrido un error, intente de nuevo'});
}


module.exports = MoviesCtrl;