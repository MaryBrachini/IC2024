const axios = require("axios");

//@ Abre o formulário de manutenção de estado
const getAllEstado = (req, res) =>
  (async () => {
    userName = req.session.userName;
    try {
      resp = await axios.get(process.env.SERVIDOR + "/GetAllEstado", {});
      //console.log("[ctlLogin.js] Valor resp:", resp.data);
      res.render("estado/view_manutencao", {
        title: "Manutenção de estado",
        data: resp.data,
        userName: userName,
      });
    } catch (erro) {
      console.log("[ctlEstado.js|getAllEstado] Try Catch:Erro de requisição");
    }
  })();

//@ Abre formulário de cadastro de estado
const openEstadoInsert = (req, res) =>
  (async () => {
    var oper = "";
    userName = req.session.userName;
    token = req.session.token;
    try {
      if (req.method == "GET") {
        oper = "c";
        res.render("estado/view_cadEstado", {
          title: "Cadastro de estado",
          oper: oper,
          userName: userName,
        });
      }
    } catch (erro) {
      console.log(
        "[ctlEstado.js|insertEstado] Try Catch: Erro não identificado",
        erro
      );
    }
  })();

//@ Função para validar campos no formulário
function validateForm(regFormPar) {
  if (regFormPar.estadoid == "") {
    regFormPar.estadoid = 0;
  } else {
    regFormPar.estadoid = parseInt(regFormPar.estadoid);
  }

  regFormPar.removido = regFormPar.removido === "true"; //converte para true ou false um check componet

  return regFormPar;
}

//@ Abre formulário de cadastro de estado
const openEstadoUpdate = (req, res) =>
  (async () => {
    var oper = "";
    userName = req.session.userName;
    token = req.session.token;
    try {
      if (req.method == "GET") {
        oper = "u";
        const id = req.params.id;
        parseInt(id);
        res.render("estado/view_cadEstado", {
          title: "Cadastro de estado",
          oper: oper,
          idBusca: id,
          userName: userName,
        });
      }
    } catch (erro) {
      console.log(
        "[ctlEstado.js|updateEstado] Try Catch: Erro não identificado",
        erro
      );
    }
  })();


//@ Recupera os dados dos estado
const getDados = (req, res) =>
  (async () => {
    const idBusca = req.body.idBusca;    
    parseInt(idBusca);
    console.log("[ctlEstado.js|getDados] valor id :", idBusca);
    try {
      resp = await axios.post(
        process.env.SERVIDOR + "/GetEstadoByID",
        {
          estadoid: idBusca,
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
        "[ctlEstado.js|getDados] Try Catch: Erro não identificado",
        erro
      );
    }
    
  })();

//@ Realiza inserção de estado
const insertEstado = (req, res) =>
  (async () => {
    token = req.session.token;
    try {
      if (req.method == "POST") {
        const regPost = validateForm(req.body);
        regPost.estadoid = 0;
        const resp = await axios.post(
          process.env.SERVIDOR + "/InsertEstado",
          regPost,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (resp.data.status == "ok") {
          res.json({ status: "ok", mensagem: "Estado inserido com sucesso!" });
        } else {
          res.json({ status: "erro", mensagem: "Erro ao inserir estado!" });
        }
      }
    } catch (erro) {
      console.log(
        "[ctlEstado.js|insertEstado] Try Catch: Erro não identificado",
        erro
      );
    }
  })();

 
  
//@ Realiza atualização de estado
///@ console.log("[ctlEstado.js|updateEstado] Valor regPost: ", regPost);
const updateEstado = (req, res) =>
  (async () => {
    token = req.session.token;
    try {
      if (req.method == "POST") {
        const regPost = validateForm(req.body);
        const resp = await axios.post(
          process.env.SERVIDOR + "/UpdateEstado",
          regPost,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (resp.data.status == "ok") {
          res.json({ status: "ok", mensagem: "Estado atualizado com sucesso!" });
        } else {
          res.json({ status: "erro", mensagem: "Erro ao atualizar estado!" });
        }
      }
    } catch (erro) {
      console.log(
        "[ctlEstado.js|updateEstado] Try Catch: Erro não identificado.",
        erro
      );
    }
  })();

//@ Realiza remoção soft de estado
//@ "[ctlEstado.js|deleteEstado] Try Catch: Erro não identificado", erro);
const deleteEstado = (req, res) =>
(async () => {
  token = req.session.token;
  try {
    if (req.method == "POST") {
      const regPost = validateForm(req.body);
      regPost.estadoid = parseInt(regPost.estadoid);
      const resp = await axios.post(
        process.env.SERVIDOR + "/DeleteEstado",
        {
          estadoid: regPost.estadoid,
        },        
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      if (resp.data.status == "ok") {
        res.json({ status: "ok", mensagem: "Estado removido com sucesso!" });
      } else {
        res.json({ status: "erro", mensagem: "Erro ao remover estado!" });
      }
    }
  } catch (erro) {
    console.log(
      "[ctlEstado.js|deleteEstado] Try Catch: Erro não identificado", erro);
  }
})();
module.exports = {
  getAllEstado,
  openEstadoInsert,
  openEstadoUpdate,
  getDados,
  insertEstado,
  updateEstado,
  deleteEstado,
};