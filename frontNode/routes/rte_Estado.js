var express = require('express');
var estadoApp = require("../app/Estado/controller/ctlEstado")

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
router.get('/', authenticationMiddleware, estadoApp.getAllEstado);
router.get('/openCursosInsert', authenticationMiddleware, estadoApp.openEstadoInsert);
router.get('/openCursosUpdate/:id', authenticationMiddleware, estadoApp.openEstadoUpdate);

/* POST métodos */
router.post('/insertEstado', authenticationMiddleware, estadoApp.insertEstado);
router.post('/deleteEstado', authenticationMiddleware, estadoApp.deleteEstado);
router.post('/getDados', authenticationMiddleware, estadoApp.getDados);
router.post('/updateCursos', authenticationMiddleware, estadoApp.updateEstado);

module.exports = router;
