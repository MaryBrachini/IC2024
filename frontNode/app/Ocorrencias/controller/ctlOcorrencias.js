const axios = require("axios");
const moment = require("moment");

//@ Abre o formulário de manutenção de Ocorrencias
const getAllOcorrencias = (req, res) =>
  (async () => {
    userName = req.session.userName;
    try {
      resp = await axios.get(process.env.SERVIDOR + "/getAllOcorrencias", {});
      res.render("Ocorrencias/view_manutencao", {
        title: "Manutenção das Ocorrencias",
        data: resp.data,
        userName: userName,
      });
    } catch (erro) {
      console.log("[ctlOcorrencias.js|getAllOcorrencias] Try Catch: Erro de requisição");
    }
  })();

//@ Abre e faz operações de CRUD no formulário de cadastro de Ocorrencias
const insertOcorrencias = (req, res) =>
  (async () => {
    var oper = "";
    var registro = {};
    var Bairro = {};
    var logradouroLocalTrabalho = {};
    var logradouro = {};
    var epidemia = {};
    var unidBasicaSaude = {};
    userName = req.session.userName;
    token = req.session.token;
    try {
      if (req.method == "GET") {
        oper = "c";
        Bairro = await axios.get(
          process.env.SERVIDOR + "/GetAllBairro",{}
        );
        logradouroLocalTrabalho = await axios.get(
          process.env.SERVIDOR + "/GetAllLogradouroLocalTrabalho",{}
        );
        logradouro = await axios.get(
          process.env.SERVIDOR + "/GetAllLogradouro",{}
        );
        epidemia = await axios.get(
          process.env.SERVIDOR + "/GetAllEpidemia",{}
        );
        unidBasicaSaude = await axios.get(
          process.env.SERVIDOR + "/GetAllUnidBasicaSaude",{}
        );
        registro = {
          ocorrenciaid: 0,
          nomeSuspeito: "",
          datacadastro: "",
          dataocorrencia: "",
          numero: "",
          latitude: "",
          longitude: "",
          localTrabalho: "",
          numeroLocalTrabalho: "",
          latitudeLocalTrabalho: "",
          longitudeLocalTrabalho: "",
          unidBasicaSaudeIDFK: "",
          bairroidfk: "",
          logradouroLocalTrabalhoIDFK: "",
          logradouroidfk: "",
          epidemiaidfk: "",
          removido: false,
        };
        res.render("Ocorrencias/view_cadOcorrencias", {
          title: "Cadastro da Unidade Básica de Saúde",
          data: registro,
          Bairro: Bairro.data.registro,
          logradouroLocalTrabalho: logradouroLocalTrabalho.data.registro,
          logradouro: logradouro.data.registro,
          epidemia: epidemia.data.registro,
          unidBasicaSaude: unidBasicaSaude.data.registro,
          oper: oper,
          userName: userName,
        });
      } else {
        oper = "c";
        const OcorrenciasREG = validateForm(req.body);
        resp = await axios.post(
          process.env.SERVIDOR + "/insertOcorrencias",
          {
            ocorrenciaid: 0,
            nomeSuspeito: ubsREG.nomeSuspeito,
            datacadastro: ubsREG.datacadastro,
            dataocorrencia: ubsREG.dataocorrencia,
            numero: ubsREG.numero,
            latitude: ubsREG.latitude,
            longitude: ubsREG.longitude,
            localTrabalho: ubsREG.localTrabalho,
            numeroLocalTrabalho: ubsREG.numeroLocalTrabalho,
            latitudeLocalTrabalho: ubsREG.latitudeLocalTrabalho,
            longitudeLocalTrabalho: ubsREG.longitudeLocalTrabalho,
            unidBasicaSaudeIDFK: ubsREG.unidBasicaSaudeIDFK,
            bairroidfk: ubsREG.bairroidfk,
            logradouroLocalTrabalhoIDFK: ubsREG.logradouroLocalTrabalhoIDFK,
            logradouroidfk: ubsREG.logradouroidfk,
            epidemiaidfk: ubsREG.epidemiaidfk,
            unidBasicaSaudeIDFK: ubsREG.unidBasicaSaudeIDFK,
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
            ocorrenciaid: 0,
            nomeSuspeito: "",
            datacadastro: "",
            dataocorrencia: "",
            numero: "",
            latitude: "",
            longitude: "",
            localTrabalho: "",
            numeroLocalTrabalho: "",
            latitudeLocalTrabalho: "",
            longitudeLocalTrabalho: "",
            unidBasicaSaudeIDFK: "",
            bairroidfk: "",
            logradouroLocalTrabalhoIDFK: "",
            logradouroidfk: "",
            epidemiaidfk: "",
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
        res.render("Ocorrencias/view_cadOcorrencias", {
          title: "Cadastro da Unidade Básica de Saúde",
          data: registro,
          Bairro: Bairro.data.registro,
          logradouroLocalTrabalho: logradouroLocalTrabalho.data.registro,
          logradouro: logradouro.data.registro,
          epidemia: epidemia.data.registro,
          unidBasicaSaude: unidBasicaSaude.data.registro,
          oper: oper,
          userName: userName,
        });
      }
    } catch (erro) {
      console.log("[ctlOcorrencias.js|insertOcorrencias] Try Catch: Erro não identificado", erro);
    }
  })();

//@ Abre o formulário de cadastro de Ocorrencias para futura edição
const viewOcorrencias = (req, res) =>
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
          process.env.SERVIDOR + "/getOcorrenciasByID",
          {
            ocorrenciaid: id,
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
          res.render("Ocorrencias/view_cadOcorrencias", {
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
          process.env.SERVIDOR + "/updateOcorrencias",
          {
            ocorrenciaid: id,
            nomeSuspeito: ubsREG.nomeSuspeito,
            datacadastro: ubsREG.datacadastro,
            dataocorrencia: ubsREG.dataocorrencia,
            numero: ubsREG.numero,
            latitude: ubsREG.latitude,
            longitude: ubsREG.longitude,
            localTrabalho: ubsREG.localTrabalho,
            numeroLocalTrabalho: ubsREG.numeroLocalTrabalho,
            latitudeLocalTrabalho: ubsREG.latitudeLocalTrabalho,
            longitudeLocalTrabalho: ubsREG.longitudeLocalTrabalho,
            unidBasicaSaudeIDFK: ubsREG.unidBasicaSaudeIDFK,
            bairroidfk: ubsREG.bairroidfk,
            logradouroLocalTrabalhoIDFK: ubsREG.logradouroLocalTrabalhoIDFK,
            logradouroidfk: ubsREG.logradouroidfk,
            epidemiaidfk: ubsREG.epidemiaidfk,
            unidBasicaSaudeIDFK: ubsREG.unidBasicaSaudeIDFK,
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
      res.json({ status: "[ctlOcorrencias.js|viewOcorrencias] Ocorrencias não pode ser alterado" });
      console.log("[ctlOcorrencias.js|viewOcorrencias] Try Catch: Erro não identificado", erro);
    }
  })();

//@ Deleta a Ocorrencias
const DeleteOcorrencias = (req, res) =>
  (async () => {
    var oper = "";
    userName = req.session.userName;
    token = req.session.token;
    try {
      oper = "v";
      const id = parseInt(req.body.id);
    
      resp = await axios.post(
        process.env.SERVIDOR + "/DeleteOcorrencias",
        {
          ocorrenciaid: id,
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
      console.log("[ctlOcorrencias.js|DeleteOcorrencias] Try Catch: Erro não identificado", erro);
    }
  })();

module.exports = {
  getAllOcorrencias,
  viewOcorrencias,
  insertOcorrencias,
  DeleteOcorrencias,
};
