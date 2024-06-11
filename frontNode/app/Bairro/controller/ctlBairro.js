const axios = require("axios");

//@ Abre o formulário de manutenção de bairro
const getAllBairro = (req, res) =>
  (async () => {
    userName = req.session.userName;
    try {
      resp = await axios.get(process.env.SERVIDOR + "/GetAllBairro", {});
      res.render("bairro/view_manutencao", {
        title: "Manutenção de bairro",
        data: resp.data,
        userName: userName,
      });
    } catch (erro) {
      console.log("[ctlBairro.js|getAllBairro] Try Catch: Erro de requisição");
    }
  })();

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
const getDados = (req, res) =>
  (async () => {
    const idBusca = req.body.idBusca;    
    parseInt(idBusca);
    console.log("[ctlBairro.js|getDados] valor id :", idBusca);
    try {
      resp = await axios.post(
        process.env.SERVIDOR + "/GetBairroByID",
        {
          bairroId: idBusca,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      if (resp.data.status == "ok") {
        res.json({ status: "ok", registro: resp.data.registro[0] });
      }
    } catch (error) { 
      console.log(
        "[ctlBairro.js|getDados] Try Catch: Erro não identificado",
        erro
      );
    }
    
  })();

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
  getAllBairro,
  openBairroInsert,
  openBairroUpdate,
  getDados,
  insertBairro,
  updateBairro,
  deleteBairro,
};
