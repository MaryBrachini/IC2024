const axios = require("axios");
const { json } = require("express");

// Função para lidar com o login do usuário
const Login = async (req, res) => {
  let resp;

  //req.session.destroy();
  console.log("[ctlLogin|Login] valor de body:", req.body);
  /* console.log("[ctlLogin.js] Valor Servidor:", process.env.SERVIDOR); */

  // Verifica se a solicitação é do tipo POST e se o campo de nome de usuário não está vazio
  if (req.method == "POST" && req.body.username !== "") {
    
    console.log("[ctlLogin.js] Valor Servidor:", process.env.SERVIDOR);

    // Envia uma solicitação POST para o servidor de autenticação com as credenciais fornecidas
    resp = await axios.post(process.env.SERVIDOR + "/login", {
      username: req.body.username,
      password: req.body.password
    });

    console.log("primeiro: "+JSON.stringify(resp.data));

    // Verifica se a autenticação foi bem-sucedida com base na resposta do servidor
    if (!resp.data.auth) {
      console.log("segundo");
      // Se a autenticação falhar, renderiza a página de login novamente com uma mensagem de erro
      return res.render("login/login", {
        title: "Login",
        message: resp.data.message
      }); 
    } else {
      console.log("terceiro");  
       
      // Se a solicitação não for do tipo POST ou se o campo de nome de usuário estiver vazio,
      // renderiza a página de login novamente sem exibir uma mensagem de erro
      session = req.session;
      req.session.isLogged = true;
      req.session.userName = req.body.username;
      req.session.token = resp.data.token;
      // Redireciona o usuário para a página inicial
      return res.redirect("/"); 
    }
  }
  
  // Corrija o objeto de renderização
  return res.render("login/login", { title: "Login", message: "" });
}

// Função para lidar com o logout do usuário
function Logout(req, res) {
  // Defina a variável de sessão corretamente
  req.session.isLogged = false;
  req.session.token = false;
  // Redireciona o usuário de volta para a página de login
  res.redirect("/Login");
}

// Exporta as funções Login e Logout para uso em outras partes do aplicativo
module.exports = {
  Login,
  Logout,
};
