const axios = require("axios");
const moment = require("moment");

//@ Abre o formulário de manutenção de UBS
const getAllUBS = (req, res) =>
  (async () => {
    userName = req.session.userName;
    try {
      resp = await axios.get(process.env.SERVIDOR + "/getAllUBS", {});
      res.render("UBS/view_manutencao", {
        title: "Manutenção da Unidade Básica de Saúde",
        data: resp.data,
        userName: userName,
      });
    } catch (erro) {
      console.log("[ctlUBS.js|getAllUBS] Try Catch: Erro de requisição");
    }
  })();

//@ Abre e faz operações de CRUD no formulário de cadastro de UBS
const insertUBS = (req, res) =>
  (async () => {
    var oper = "";
    var registro = {};
    var Bairro = {};
    userName = req.session.userName;
    token = req.session.token;
    try {
      if (req.method == "GET") {
        oper = "c";
        Bairro = await axios.get(
          process.env.SERVIDOR + "/GetAllBairro",
          {}
        );
        registro = {
          unidBasicaSaudeID: 0,
          nomeUBS: "",
          codigoUBS: "",
          bairroIDFK: "",
          removido: false,
        };
        res.render("UBS/view_cadUBS", {
          title: "Cadastro da Unidade Básica de Saúde",
          data: registro,
          Bairro: Bairro.data.registro,
          oper: oper,
          userName: userName,
        });
      } else {
        oper = "c";
        const UBSREG = validateForm(req.body);
        resp = await axios.post(
          process.env.SERVIDOR + "/insertUBS",
          {
            unidBasicaSaudeID: 0,
            nomeUBS: ubsREG.nomeUBS,
            codigoUBS: ubsREG.codigoUBS,
            bairroIDFK: ubsREG.bairroIDFK,
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
            unidBasicaSaudeID: 0,
            nomeUBS: "",
            codigoUBS:"",
            bairroIDFK: "",
            removido: false,
          };
        } else {
          registro = ubsREG;
        }
        Bairro = await axios.get(
          process.env.SERVIDOR + "/GetAllBairro",
          {}
        );
        oper = "c";
        res.render("UBS/view_cadUBS", {
          title: "Cadastro da Unidade Básica de Saúde",
          data: registro,
          Bairro: Bairro.data.registro,
          oper: oper,
          userName: userName,
        });
      }
    } catch (erro) {
      console.log("[ctlUBS.js|insertUBS] Try Catch: Erro não identificado", erro);
    }
  })();

//@ Abre o formulário de cadastro de UBS para futura edição
const viewUBS = (req, res) =>
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
          process.env.SERVIDOR + "/getUBSByID",
          {
            unidBasicaSaudeID: id,
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
          res.render("UBS/view_cadUBS", {
            title: "Cadastro da Unidade Básica de Saúde",
            data: registro,
            oper: oper,
            userName: userName,
          });
        }
      } else {
        oper = "vu";
        const ubsREG = validateForm(req.body);
        const id = parseInt(ubsREG.id);
        resp = await axios.post(
          process.env.SERVIDOR + "/updateUBS",
          {
            unidBasicaSaudeID: id,
            nomeUBS: ubsREG.nomeUBS,
            codigoUBS:ubsREG.codigoUBS,
            bairroIDFK: ubsREG.bairroIDFK,
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
      res.json({ status: "[ctlUBS.js|viewUBS] UBS não pode ser alterado" });
      console.log("[ctlUBS.js|viewUBS] Try Catch: Erro não identificado", erro);
    }
  })();

//@ Deleta a UBS
const DeleteUBS = (req, res) =>
  (async () => {
    var oper = "";
    userName = req.session.userName;
    token = req.session.token;
    try {
      oper = "v";
      const id = parseInt(req.body.id);
    
      resp = await axios.post(
        process.env.SERVIDOR + "/DeleteUBS",
        {
          unidBasicaSaudeID: id,
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
      console.log("[ctlUBS.js|DeleteUBS] Try Catch: Erro não identificado", erro);
    }
  })();

module.exports = {
  getAllUBS,
  viewUBS,
  insertUBS,
  DeleteUBS,
};
