const axios = require("axios");
const moment = require("moment");

//@ Abre o formulário de manutenção de cidade
const getAllCidade = (req, res) =>
  (async () => {
    userName = req.session.userName;
    try {
      resp = await axios.get(process.env.SERVIDOR + "/getAllCidade", {});
      res.render("cidade/view_manutencao", {
        title: "Manutenção da Cidade",
        data: resp.data,
        userName: userName,
      });
    } catch (erro) {
      console.log("[ctlCidade.js|getAllCidade] Try Catch: Erro de requisição");
    }
  })();

//@ Abre e faz operações de CRUD no formulário de cadastro de cidade
const insertCidade = (req, res) =>
  (async () => {
    var oper = "";
    var registro = {};
    var Estado = {};
    userName = req.session.userName;
    token = req.session.token;
    try {
      if (req.method == "GET") {
        oper = "c";
        Estado = await axios.get(
          process.env.SERVIDOR + "/GetAllEstado",
          {}
        );
        registro = {
          cidadeID: 0,
          nomeCidade: "",
          estadoid: "",
          removido: false,
        };
        res.render("cidade/view_cadCidade", {
          title: "Cadastro de cidade",
          data: registro,
          Estado: Estado.data.registro,
          oper: oper,
          userName: userName,
        });
      } else {
        oper = "c";
        const cidadeREG = validateForm(req.body);
        resp = await axios.post(
          process.env.SERVIDOR + "/insertCidade",
          {
            cidadeID: 0,
            nomeCidade: cidadeREG.nomeCidade,
            estadoid: cidadeREG.estadoid,
            removido: false,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (resp.data.status == "ok") {
          registro = {
            cidadeID: 0,
            nomeCidade: "",
            estadoid: "",
            removido: false,
          };
        } else {
          registro = cidadeREG;
        }
        Estado = await axios.get(
          process.env.SERVIDOR + "/GetAllEstado",
          {}
        );
        oper = "c";
        res.render("cidade/view_cadCidade", {
          title: "Cadastro de cidade",
          data: registro,
          Estado: Estado.data.registro,
          oper: oper,
          userName: userName,
        });
      }
    } catch (erro) {
      console.log("[ctlCidade.js|insertCidade] Try Catch: Erro não identificado", erro);
    }
  })();

//@ Abre o formulário de cadastro de cidade para futura edição
const viewCidade = (req, res) =>
  (async () => {
    var oper = "";
    var registro = {};
    userName = req.session.userName;
    token = req.session.token;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        oper = req.params.oper;
        parseInt(id);
        resp = await axios.post(
          process.env.SERVIDOR + "/getCidadeByID",
          {
            cidadeID: id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (resp.data.status == "ok") {
          registro = resp.data.registro[0];
          res.render("cidade/view_cadCidade", {
            title: "Cadastro de cidade",
            data: registro,
            oper: oper,
            userName: userName,
          });
        }
      } else {
        oper = "vu";
        const cidadeREG = validateForm(req.body);
        const id = parseInt(cidadeREG.id);
        resp = await axios.post(
          process.env.SERVIDOR + "/updateCidade",
          {
            cidadeID: id,
            nomeCidade: cidadeREG.nomeCidade,
            estadoid: cidadeREG.estadoid,
            removido: false,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (resp.data.status == "ok") {
          res.json({ status: "ok" });
        } else {
          res.json({ status: "erro" });
        }
      }
    } catch (erro) {
      res.json({ status: "[ctlCidade.js|viewCidade] Cidade não pode ser alterada" });
      console.log("[ctlCidade.js|viewCidade] Try Catch: Erro não identificado", erro);
    }
  })();

//@ Deleta a cidade
const DeleteCidade = (req, res) =>
  (async () => {
    var oper = "";
    userName = req.session.userName;
    token = req.session.token;
    try {
      oper = "v";
      const id = parseInt(req.body.id);
    
      resp = await axios.post(
        process.env.SERVIDOR + "/DeleteCidade",
        {
          cidadeID: id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      if (resp.data.status == "ok") {
        res.json({ status: "ok" });
      } else {
        res.json({ status: "erro" });
      }
    } catch (erro) {
      console.log("[ctlCidade.js|DeleteCidade] Try Catch: Erro não identificado", erro);
    }
  })();

module.exports = {
  getAllCidade,
  viewCidade,
  insertCidade,
  DeleteCidade,
};
