var express = require('express');
var UBSApp = require("../app/UBS/controller/ctlUBS")

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
router.get('/', authenticationMiddleware, UBSApp.getAllUBS);
router.get('/insertUBS', authenticationMiddleware, UBSApp.insertUBS);
router.get('/viewUBS/:id/:oper', authenticationMiddleware, UBSApp.viewUBS);

/* POST métodos */
router.post('/insertUBS', authenticationMiddleware, UBSApp.insertUBS);
router.post('/DeleteUBS', authenticationMiddleware, UBSApp.DeleteUBS);
router.post('/viewUBS', authenticationMiddleware, UBSApp.viewUBS);

module.exports = router;
