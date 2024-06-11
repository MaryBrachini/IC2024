var express = require('express');
var cidadeApp = require("../app/Cidade/controller/ctlCidade");

var router = express.Router();

// Função necessária para evitar que usuários não autenticados acessem o sistema.
function authenticationMiddleware(req, res, next) {
    // Verificar se existe uma sessão válida.
    isLogged = req.session.isLogged;    
  
    if (!isLogged) {      
      res.redirect("/Login");   
    }
    next();   
}; 

/* GET métodos */
router.get('/', authenticationMiddleware, cidadeApp.getAllCidade);
router.get('/insertCidade', authenticationMiddleware, cidadeApp.insertCidade);
router.get('/viewCidade/:id/:oper', authenticationMiddleware, cidadeApp.viewCidade);

/* POST métodos */
router.post('/insertCidade', authenticationMiddleware, cidadeApp.insertCidade);
router.post('/DeleteCidade', authenticationMiddleware, cidadeApp.DeleteCidade);
router.post('/viewCidade', authenticationMiddleware, cidadeApp.viewCidade);

module.exports = router;
