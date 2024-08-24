const axios = require("axios");

const GetAllBairros = async (req, res) => {
 
  const userName = req.session.userName;  

  console.log("1 [ctlBairro.js|GetAllBairros] Nome de usuário:", userName);

  try {
    resp = await axios.get(process.env.SERVIDOR + "/bairro/GetAllBairros", {timeout: 5000 });
    res.send("try");
    
  } catch (erro) {
    console.error("Erro na requisição:", erro.message);
    res.send("catch");
  }
  };

/* try {
    const resp = await axios.get(url, { timeout: 5000 });

    console.log("3 [ctlBairro.js|GetAllBairros] Dados recebidos:", resp.data);

    if (!Array.isArray(resp.data.registro)) {
      resp.data.registro = [];
      console.log("if");
    }

    console.log("4 [ctlBairro.js|GetAllBairros] Dados que serão passados para a view:", resp.data);

    if (!res.headersSent) {
      res.render("bairro/view_manutencao", {
        title: "Manutenção do bairro",
        data: resp.data,
        userName: userName,
      });
    }
  } catch (erro) {
    if (!res.headersSent) {
      if (erro.code === 'ECONNABORTED') {
        console.error("5 [ctlBairro.js|GetAllBairros] Erro: Tempo de requisição excedido.");
        res.status(500).send("O tempo de resposta do servidor excedeu. Tente novamente mais tarde.");
      } else {
        console.error("6 [ctlBairro.js|GetAllBairros] Erro de requisição:", erro.message);
        res.status(500).send("Erro ao processar a requisição para obter todos os bairros");
      }
    }
  }
};
 */

//@ Abre formulário de cadastro de bairro
const openBairroInsert = (req, res) =>
  (async () => {
    var oper = "";
    userName = req.session.userName;
    token = req.session.token;
    try {
      if (req.method == "GET") {
        oper = "c";
        res.render("bairro/view_cadBairro", {
          title: "Cadastro de bairro",
          oper: oper,
          userName: userName,
        });
      }
    } catch (erro) {
      console.log(
        "[ctlBairro.js|insertBairro] Try Catch: Erro não identificado",
        erro
      );
    }
  })();

//@ Função para validar campos no formulário
function validateForm(regFormPar) {
  if (regFormPar.bairroId == "") {
    regFormPar.bairroId = 0;
  } else {
    regFormPar.bairroId = parseInt(regFormPar.bairroId);
  }

  regFormPar.removido = regFormPar.removido === "true";

  return regFormPar;
}

//@ Abre formulário de cadastro de bairro
const openBairroUpdate = (req, res) =>
  (async () => {
    var oper = "";
    userName = req.session.userName;
    token = req.session.token;
    try {
      if (req.method == "GET") {
        oper = "u";
        const id = req.params.id;
        parseInt(id);
        res.render("bairro/view_cadBairro", {
          title: "Cadastro de bairro",
          oper: oper,
          idBusca: id,
          userName: userName,
        });
      }
    } catch (erro) {
      console.log(
        "[ctlBairro.js|insertBairro] Try Catch: Erro não identificado",
        erro
      );
    }
  })();


//@ Recupera os dados dos bairro
const getDados = (req, res) => {
  (async () => {
    const idBusca = parseInt(req.body.idBusca, 10); // Garanta que idBusca seja um número
    console.log("[ctlBairro.js|getDados] valor id :", idBusca);
    
    try {
      const resp = await axios.post(
        process.env.SERVIDOR + "/GetBairroByID",
        { bairroId: idBusca },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + req.session.token,
          },
        }
      );

      if (resp.data.status === "ok") {
        res.json({ status: "ok", registro: resp.data.registro[0] || {} });
      } else {
        res.json({ status: "erro", mensagem: "Erro ao obter dados do bairro." });
      }
    } catch (erro) {
      console.log("[ctlBairro.js|getDados] Erro não identificado", erro);
      res.status(500).send("Erro ao processar a requisição para obter dados do bairro");
    }
  })();
};


//@ Realiza inserção de bairro
const insertBairro = (req, res) =>
  (async () => {
    token = req.session.token;
    try {
      if (req.method == "POST") {
        const regPost = validateForm(req.body);
        regPost.bairroId = 0;
        const resp = await axios.post(
          process.env.SERVIDOR + "/InsertBairro",
          regPost,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (resp.data.status == "ok") {
          res.json({ status: "ok", mensagem: "Bairro inserido com sucesso!" });
        } else {
          res.json({ status: "erro", mensagem: "Erro ao inserir bairro!" });
        }
      }
    } catch (erro) {
      console.log(
        "[ctlBairro.js|insertBairro] Try Catch: Erro não identificado",
        erro
      );
    }
  })();

//@ Realiza atualização de bairro
const updateBairro = (req, res) =>
  (async () => {
    token = req.session.token;
    try {
      if (req.method == "POST") {
        const regPost = validateForm(req.body);
        const resp = await axios.post(
          process.env.SERVIDOR + "/UpdateBairro",
          regPost,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (resp.data.status == "ok") {
          res.json({ status: "ok", mensagem: "Bairro atualizado com sucesso!" });
        } else {
          res.json({ status: "erro", mensagem: "Erro ao atualizar bairro!" });
        }
      }
    } catch (erro) {
      console.log(
        "[ctlBairro.js|updateBairro] Try Catch: Erro não identificado.",
        erro
      );
    }
  })();

//@ Realiza remoção soft de bairro
const deleteBairro = (req, res) =>
  (async () => {
    token = req.session.token;
    try {
      if (req.method == "POST") {
        const regPost = validateForm(req.body);
        regPost.bairroId = parseInt(regPost.bairroId);
        const resp = await axios.post(
          process.env.SERVIDOR + "/DeleteBairro",
          {
            bairroId: regPost.bairroId,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (resp.data.status == "ok") {
          res.json({ status: "ok", mensagem: "Bairro removido com sucesso!" });
        } else {
          res.json({ status: "erro", mensagem: "Erro ao remover bairro!" });
        }
      }
    } catch (erro) {
      console.log(
        "[ctlBairro.js|deleteBairro] Try Catch: Erro não identificado", erro);
    }
  })();
module.exports = {
  GetAllBairros,
  openBairroInsert,
  openBairroUpdate,
  getDados,
  insertBairro,
  updateBairro,
  deleteBairro,
};
