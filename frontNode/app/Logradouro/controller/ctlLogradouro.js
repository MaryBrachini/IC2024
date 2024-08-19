const axios = require("axios");
const moment = require("moment");

//@ Abre o formulário de manutenção de logradouro
const getAllLogradouro = (req, res) =>
  (async () => {
    userName = req.session.userName;
    try {
      resp = await axios.get(process.env.SERVIDOR + "/getAllLogradouro", {});
      res.render("logradouro/view_manutencao", {
        title: "Manutenção do Logradouro",
        data: resp.data,
        userName: userName,
      });
    } catch (erro) {
      console.log("[ctlLogradouro.js|getAllLogradouro] Try Catch: Erro de requisição");
    }
  })();

//@ Abre e faz operações de CRUD no formulário de cadastro de logradouro
const insertLogradouro = (req, res) =>
  (async () => {
    var oper = "";
    var registro = {};
    var Cidade = {};
    userName = req.session.userName;
    token = req.session.token;
    try {
      if (req.method == "GET") {
        oper = "c";
        Cidade = await axios.get(
          process.env.SERVIDOR + "/GetAllCidade",
          {}
        );
        registro = {
          logradouroid: 0,
          nomelogradouro: "",
          cidadeidfk: "",
          removido: false,
        };
        res.render("logradouro/view_cadLogradouro", {
          title: "Cadastro de logradouro",
          data: registro,
          Cidade: Cidade.data.registro,
          oper: oper,
          userName: userName,
        });
      } else {
        oper = "c";
        const logradouroREG = validateForm(req.body);
        resp = await axios.post(
          process.env.SERVIDOR + "/insertLogradouro",
          {
            logradouroid: 0,
            nomelogradouro: logradouroREG.nomelogradouro,
            cidadeidfk: logradouroREG.cidadeidfk,
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
            logradouroid: 0,
            nomelogradouro: "",
            cidadeidfk: "",
            removido: false,
          };
        } else {
          registro = logradouroREG;
        }
        Cidade = await axios.get(
          process.env.SERVIDOR + "/GetAllCidade",
          {}
        );
        oper = "c";
        res.render("logradouro/view_cadLogradouro", {
          title: "Cadastro de logradouro",
          data: registro,
          Cidade: Cidade.data.registro,
          oper: oper,
          userName: userName,
        });
      }
    } catch (erro) {
      console.log("[ctlLogradouro.js|insertLogradouro] Try Catch: Erro não identificado", erro);
    }
  })();

//@ Abre o formulário de cadastro de logradouro para futura edição
const viewLogradouro = (req, res) =>
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
          process.env.SERVIDOR + "/getLogradouroByID",
          {
            logradouroid: id,
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
          res.render("logradouro/view_cadLogradouro", {
            title: "Cadastro de logradouro",
            data: registro,
            oper: oper,
            userName: userName,
          });
        }
      } else {
        oper = "vu";
        const logradouroREG = validateForm(req.body);
        const id = parseInt(logradouroREG.id);
        resp = await axios.post(
          process.env.SERVIDOR + "/updateLogradouro",
          {
            logradouroid: id,
            nomelogradouro: logradouroREG.nomelogradouro,
            cidadeidfk: logradouroREG.cidadeidfk,
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
      res.json({ status: "[ctlLogradouro.js|viewLogradouro] Logradouro não pode ser alterado" });
      console.log("[ctlLogradouro.js|viewLogradouro] Try Catch: Erro não identificado", erro);
    }
  })();

//@ Deleta a logradouro
const DeleteLogradouro = (req, res) =>
  (async () => {
    var oper = "";
    userName = req.session.userName;
    token = req.session.token;
    try {
      oper = "v";
      const id = parseInt(req.body.id);
    
      resp = await axios.post(
        process.env.SERVIDOR + "/DeleteLogradouro",
        {
          logradouroid: id,
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
      console.log("[ctlLogradouro.js|DeleteLogradouro] Try Catch: Erro não identificado", erro);
    }
  })();

module.exports = {
  getAllLogradouro,
  viewLogradouro,
  insertLogradouro,
  DeleteLogradouro,
};
