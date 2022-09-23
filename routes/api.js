const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

//Import controllers
const HomePageController = require("../controller/home-page.controller");
const MangaPageController = require("../controller/manga-page.controller");
const ReadingPageController = require("../controller/reading-page.controller");
const FindPageController = require("../controller/find-page.controller");

let router = express.Router();

// router.get('/get-file', function(req, res){
//   const filePath = req.query.path;
//   const imgPath = path.resolve('uploads', filePath);
//   if (fs.existsSync(imgPath)) {
//     return res.sendFile(imgPath);
//   } 
//   return res.send('Không tim thấy file !');
// });

router.use(function (req, res, next) {
  if (
    req.headers.authorization !== undefined &&
    req.headers.authorization != ""
  ) {
    let appController = new AppController(req, res);
    try {
      // let decoded = jwt.verify(
      //   req.headers.authorization,
      //   process.env.JWT_KEY || "dev"
      // );
      next();
    } catch (err) {
      return appController.responseJson({ error_code: 203 });
    }
  } else {
    next();
  }
});


/***** HOME-PAGE *****/
router.get('/home-page/get-list-newest-comic', function(req, res){
  return new HomePageController(req, res, 'getListNewestComic');
});

/***** MANGA-PAGE *****/
router.get('/manga-page/get-infors-comic/:id', function(req, res){
  return new MangaPageController(req, res, 'getInforsComic');
});

/***** READING-PAGE *****/
router.get('/reading-page/get-list-images/:id', function(req, res){
  return new ReadingPageController(req, res, 'getListImages');
});

router.get('/test', function(req, res){
  return new MangaPageController(req, res, 'testFunc');
});

/***** FIND-PAGE *****/
router.get('/find-page/get-list-comics', function(req, res){
  return new FindPageController(req, res, 'getListComics');
});
router.get('/find-page/get-list-category', function(req, res){
  return new FindPageController(req, res, 'getListCategory');
});

module.exports = router;
