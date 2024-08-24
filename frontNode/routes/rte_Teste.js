var express = require('express');
var testeApp = require("../app/Teste/controller/ctlTeste");

var router = express.Router();

// Função necessária para evitar que usuários não autenticados acessem o sistema.
function authenticationMiddleware(req, res, next) {
    isLogged = req.session.isLogged;    
  
    if (!isLogged) {      
      res.redirect("/Login");   
    } else {
      next(); 
    }
}

//* GET métodos */
router.get('/', authenticationMiddleware, testeApp.GetAllTestes);
router.get('/openTesteInsert', authenticationMiddleware, testeApp.openTesteInsert);
router.get('/openTesteUpdate/:id', authenticationMiddleware, testeApp.openTesteUpdate);

/* POST métodos */
router.post('/insertTeste', authenticationMiddleware, testeApp.insertTeste);
router.post('/deleteTeste', authenticationMiddleware, testeApp.deleteTeste);
router.post('/getDados', authenticationMiddleware, testeApp.getDados);
router.post('/updateTeste', authenticationMiddleware, testeApp.updateTeste);

module.exports = router;
