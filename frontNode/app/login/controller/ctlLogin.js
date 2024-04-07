const axios = require("axios");
const { json } = require("express");

const Login = async (req, res) => {
  let resp;
  //req.session.destroy();
  console.log("[ctlLogin|Login] valor de body:", req.body);
  /* console.log("[ctlLogin.js] Valor ServidorDW:", process.env.SERVIDOR); */
  if (req.method == "POST" && req.body.username !== "") {
    console.log("[ctlLogin.js] Valor ServidorDW:", process.env.SERVIDOR);
    resp = await axios.post("http://localhost:20100" + "/login", {
      username: req.body.username,
      password: req.body.password
    });  
    console.log("primeiro: "+JSON.stringify(resp.data));
    if (!resp.data.auth) {
      console.log("segundo");
      return res.render("login/login", {
        title: "Login",
        message: resp.data.message
      }); 
    } else {
      console.log("terceiro");   
      // Defina a variável de sessão corretamente
      session = req.session;
      req.session.isLogged = true;
      req.session.userName = req.body.username;
      req.session.token = resp.data.token;
      return res.redirect("/"); 
    }
  }
  
  // Corrija o objeto de renderização
  return res.render("login/login", { title: "Login", message: "" });
}

function Logout(req, res) {
  // Defina a variável de sessão corretamente
  req.session.isLogged = false;
  req.session.token = false;
  res.redirect("/Login");
}

module.exports = {
  Login,
  Logout,
};
