var express = require('express');
var LogradouroApp = require("../app/Logradouro/controller/ctlLogradouro");

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
router.get('/', authenticationMiddleware, LogradouroApp.getAllLogradouro);
router.get('/insertLogradouro', authenticationMiddleware, LogradouroApp.insertLogradouro);
router.get('/viewLogradouro/:id/:oper', authenticationMiddleware, LogradouroApp.viewLogradouro);

/* POST métodos */
router.post('/insertLogradouro', authenticationMiddleware, LogradouroApp.insertLogradouro);
router.post('/DeleteLogradouro', authenticationMiddleware, LogradouroApp.DeleteLogradouro);
router.post('/viewLogradouro', authenticationMiddleware, LogradouroApp.viewLogradouro);

module.exports = router;
