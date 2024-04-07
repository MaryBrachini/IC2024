var express = require('express');
var loginApp = require("../app/login/controller/ctlLogin")

////var login = require("../controllers/login/login")
var router = express.Router();
//const passport = require('passport');

//Função necessária para evitar que usuários não autenticados acessem o sistema.
function authenticationMiddleware(req, res, next) {
  // Verificar se existe uma sessão válida e se o usuário está logado
  if (req.session && req.session.isLogged) {
    // Se estiver logado, continue para a próxima rota
    next();
  } else {
    // Se não estiver logado, redirecione para a página de login
    console.log("[app.js] Usuário não autenticado. Redirecionando para a página de login.");
    res.redirect("/Login");
  }
};

/* GET home page. */
router.get('/', authenticationMiddleware, function (req, res, next) {
  userName = req.session.userName;
  res.render('index', { "title": 'Página principal', "userName": userName });

});

/* GET login page. */
router.get('/Login', loginApp.Login);
/* POST login page. */
router.post('/Login', loginApp.Login);
/* GET logout page. */
router.get('/Logout', loginApp.Logout);

module.exports = router;