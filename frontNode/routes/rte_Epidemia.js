var express = require('express');
var epidemiaApp = require("../app/Epidemia/controller/ctlEpidemia")

////var login = require("../controllers/login/login")
var router = express.Router();
//const passport = require('passport');

// Função necessária para evitar que usuários não autenticados acessem o sistema.
function authenticationMiddleware(req, res, next) {
    // Verificar se existe uma sessão válida.
    isLogged = req.session.isLogged;    
  
    if (!isLogged) {      
      res.redirect("/Login");   
    }
    next();   
}; 

//* GET métodos */
router.get('/', authenticationMiddleware, epidemiaApp.getAllEpidemia);
router.get('/openCursosInsert', authenticationMiddleware, epidemiaApp.openEpidemiaInsert);
router.get('/openCursosUpdate/:id', authenticationMiddleware, epidemiaApp.openEpidemiaUpdate);

/* POST métodos */
router.post('/insertEpidemia', authenticationMiddleware, epidemiaApp.insertEpidemia);
router.post('/deleteEpidemia', authenticationMiddleware, epidemiaApp.deleteEpidemia);
router.post('/getDados', authenticationMiddleware, epidemiaApp.getDados);
router.post('/updateCursos', authenticationMiddleware, epidemiaApp.updateEpidemia);

module.exports = router;
