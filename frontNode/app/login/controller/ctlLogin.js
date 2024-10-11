const axios = require('axios');

const Login = async (req, res) => {
  try {
    if (req.method === "POST" && req.body.username) {
     /*  console.log("[ctlLogin.js] Valor Servidor:", process.env.SERVIDOR); */

      // Envia a requisição ao servidor de autenticação
      const resp = await axios.post(process.env.SERVIDOR + "/login", {
        username: req.body.username,
        password: req.body.password
      });

     /*  console.log("Resposta completa de login:", resp.data); */

      if (!resp.data.auth) {
        return res.render("login/login", {
          title: "Login",
          message: resp.data.message
        });
      } else {
        // Salva as informações na sessão
        req.session.isLogged = true;
        req.session.userName = req.body.username;
        req.session.token = resp.data.token; // Armazena o token na sessão
        /* console.log("Token armazenado na sessão:", req.session.token); */
        return res.redirect("/");
      }
    }

    // Renderiza a página de login se não for POST ou se o username estiver vazio
    return res.render("login/login", { title: "Login", message: "" });

  } catch (error) {
    console.error('[ctoLogin] **** Erro na autenticação:');
    return res.render("login/login", {
      title: "Login",
      message: "Erro ao conectar com o servidor de autenticação."
    });
  }
};

// Função para lidar com o logout do usuário
function Logout(req, res) {
  if (res.headersSent) {
    console.log("Resposta já enviada.");
    return;
  }

  console.log("[LOGOUT ] *** Resposta já enviada.");

  req.session.destroy((err) => {
    if (err) {
      console.error("Erro ao destruir a sessão:", err);
      return res.redirect("/"); // Ou uma página de erro apropriada
    }
    res.redirect("/Login");
  });
}


// Exporta as funções Login e Logout para uso em outras partes do aplicativo
module.exports = {
  Login,
  Logout,
};
