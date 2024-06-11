var express = require('express');
var OcorrenciasApp = require("../app/Ocorrencias/controller/ctlOcorrencias");

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
router.get('/', authenticationMiddleware, OcorrenciasApp.getAllOcorrencias);
router.get('/insertOcorrencias', authenticationMiddleware, OcorrenciasApp.insertOcorrencias);
router.get('/viewOcorrencias/:id/:oper', authenticationMiddleware, OcorrenciasApp.viewOcorrencias);

/* POST métodos */
router.post('/insertOcorrencias', authenticationMiddleware, OcorrenciasApp.insertOcorrencias);
router.post('/DeleteOcorrencias', authenticationMiddleware, OcorrenciasApp.DeleteOcorrencias);
router.post('/viewOcorrencias', authenticationMiddleware, OcorrenciasApp.viewOcorrencias);

module.exports = router;
