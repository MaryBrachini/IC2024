const axios = require("axios");
const moment = require("moment");

//@ Abre o formulário de manutenção de cidade
const getAllCidade = async (req, res) => {
  const userName = req.session.userName;
  try {
    const resp = await axios.get(process.env.SERVIDOR + "/getAllCidade");
    res.render("cidade/view_manutencao", {
      title: "Manutenção da Cidade",
      data: resp.data,
      userName: userName,
    });
  } catch (error) {
    console.log("[ctlCidade.js|getAllCidade] Erro de requisição", error);
  }
};

//@ Abre e faz operações de CRUD no formulário de cadastro de cidade
const insertCidade = async (req, res) => {
  const userName = req.session.userName;
  const token = req.session.token;
  try {
    if (req.method === "GET") {
      const estadoResponse = await axios.get(process.env.SERVIDOR + "/GetAllEstado");
      const registro = {
        cidadeID: 0,
        nomeCidade: "",
        estadoid: "",
        removido: false,
      };
      res.render("cidade/view_cadCidade", {
        title: "Cadastro de cidade",
        data: registro,
        Estado: estadoResponse.data.registro,
        oper: "c",
        userName: userName,
      });
    } else if (req.method === "POST") {
      const cidadeREG = validateForm(req.body);
      const resp = await axios.post(
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

      const registro = resp.data.status === "ok"
        ? {
            cidadeID: 0,
            nomeCidade: "",
            estadoid: "",
            removido: false,
          }
        : cidadeREG;

      const estadoResponse = await axios.get(process.env.SERVIDOR + "/GetAllEstado");
      res.render("cidade/view_cadCidade", {
        title: "Cadastro de cidade",
        data: registro,
        Estado: estadoResponse.data.registro,
        oper: "c",
        userName: userName,
      });
    }
  } catch (error) {
    console.log("[ctlCidade.js|insertCidade] Erro não identificado", error);
  }
};

//@ Abre o formulário de cadastro de cidade para futura edição
const viewCidade = async (req, res) => {
  const userName = req.session.userName;
  const token = req.session.token;
  try {
    if (req.method === "GET") {
      const id = parseInt(req.params.id, 10);
      const oper = req.params.oper;
      const resp = await axios.post(
        process.env.SERVIDOR + "/getCidadeByID",
        { cidadeID: id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      if (resp.data.status === "ok") {
        const registro = resp.data.registro[0];
        res.render("cidade/view_cadCidade", {
          title: "Cadastro de cidade",
          data: registro,
          oper: oper,
          userName: userName,
        });
      }
    } else if (req.method === "POST") {
      const cidadeREG = validateForm(req.body);
      const id = parseInt(cidadeREG.cidadeID, 10);
      const resp = await axios.post(
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

      if (resp.data.status === "ok") {
        res.json({ status: "ok" });
      } else {
        res.json({ status: "erro" });
      }
    }
  } catch (error) {
    res.json({ status: "erro", mensagem: "Cidade não pode ser alterada" });
    console.log("[ctlCidade.js|viewCidade] Erro não identificado", error);
  }
};

//@ Deleta a cidade
const deleteCidade = async (req, res) => {
  const userName = req.session.userName;
  const token = req.session.token;
  try {
    const id = parseInt(req.body.id, 10);
    const resp = await axios.post(
      process.env.SERVIDOR + "/DeleteCidade",
      { cidadeID: id },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );

    if (resp.data.status === "ok") {
      res.json({ status: "ok" });
    } else {
      res.json({ status: "erro" });
    }
  } catch (error) {
    console.log("[ctlCidade.js|deleteCidade] Erro não identificado", error);
  }
};

// Exporta os módulos
module.exports = {
  getAllCidade,
  viewCidade,
  insertCidade,
  deleteCidade,
};
