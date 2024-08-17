var express = require('express');
var bairroApp = require("../app/Bairro/controller/ctlBairro")

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

//* GET métodos */
router.get('/', authenticationMiddleware, bairroApp.getAllBairro);
router.get('/openCursosInsert', authenticationMiddleware, bairroApp.openBairroInsert);
router.get('/openCursosUpdate/:id:oper', authenticationMiddleware, bairroApp.openBairroUpdate);

/* POST métodos */
router.post('/insertBairro', authenticationMiddleware, bairroApp.insertBairro);
router.post('/deleteBairro', authenticationMiddleware, bairroApp.deleteBairro);
router.post('/getDados', authenticationMiddleware, bairroApp.getDados);
router.post('/updateCursos', authenticationMiddleware, bairroApp.updateBairro);

module.exports = router;
