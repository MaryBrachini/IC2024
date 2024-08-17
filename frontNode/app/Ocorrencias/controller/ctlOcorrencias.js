const axios = require("axios");
const moment = require("moment");

//@ Abre o formulário de manutenção de Ocorrências
const getAllOcorrencias = async (req, res) => {
  const userName = req.session.userName;
  try {
    const resp = await axios.get(`${process.env.SERVIDOR}/getAllOcorrencias`);
    res.render("Ocorrencias/view_manutencao", {
      title: "Manutenção das Ocorrências",
      data: resp.data,
      userName: userName,
    });
  } catch (error) {
    console.log("[ctlOcorrencias.js|getAllOcorrencias] Erro de requisição:", error);
  }
};

//@ Abre e faz operações de CRUD no formulário de cadastro de Ocorrências
const insertOcorrencias = async (req, res) => {
  const userName = req.session.userName;
  const token = req.session.token;
  try {
    if (req.method === "GET") {
      const [Bairro, logradouroLocalTrabalho, logradouro, epidemia, unidBasicaSaude] = await Promise.all([
        axios.get(`${process.env.SERVIDOR}/GetAllBairro`),
        axios.get(`${process.env.SERVIDOR}/GetAllLogradouroLocalTrabalho`),
        axios.get(`${process.env.SERVIDOR}/GetAllLogradouro`),
        axios.get(`${process.env.SERVIDOR}/GetAllEpidemia`),
        axios.get(`${process.env.SERVIDOR}/GetAllUnidBasicaSaude`),
      ]);

      const registro = {
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
        title: "Cadastro da Ocorrência",
        data: registro,
        Bairro: Bairro.data.registro,
        logradouroLocalTrabalho: logradouroLocalTrabalho.data.registro,
        logradouro: logradouro.data.registro,
        epidemia: epidemia.data.registro,
        unidBasicaSaude: unidBasicaSaude.data.registro,
        oper: "c",
        userName: userName,
      });
    } else if (req.method === "POST") {
      const regPost = validateForm(req.body);
      regPost.ocorrenciaid = 0;

      const resp = await axios.post(
        `${process.env.SERVIDOR}/insertOcorrencias`,
        regPost,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const status = resp.data.status === "ok" ? "ok" : "erro";
      const mensagem = status === "ok" ? "Ocorrência inserida com sucesso!" : "Erro ao inserir ocorrência!";

      const [Bairro, logradouroLocalTrabalho, logradouro, epidemia, unidBasicaSaude] = await Promise.all([
        axios.get(`${process.env.SERVIDOR}/GetAllBairro`),
        axios.get(`${process.env.SERVIDOR}/GetAllLogradouroLocalTrabalho`),
        axios.get(`${process.env.SERVIDOR}/GetAllLogradouro`),
        axios.get(`${process.env.SERVIDOR}/GetAllEpidemia`),
        axios.get(`${process.env.SERVIDOR}/GetAllUnidBasicaSaude`),
      ]);

      res.render("Ocorrencias/view_cadOcorrencias", {
        title: "Cadastro da Ocorrência",
        data: regPost,
        Bairro: Bairro.data.registro,
        logradouroLocalTrabalho: logradouroLocalTrabalho.data.registro,
        logradouro: logradouro.data.registro,
        epidemia: epidemia.data.registro,
        unidBasicaSaude: unidBasicaSaude.data.registro,
        oper: "c",
        userName: userName,
        mensagem: mensagem,
      });
    }
  } catch (error) {
    console.log("[ctlOcorrencias.js|insertOcorrencias] Erro não identificado:", error);
  }
};

//@ Abre o formulário de cadastro de Ocorrências para futura edição
const viewOcorrencias = async (req, res) => {
  const userName = req.session.userName;
  const token = req.session.token;
  try {
    if (req.method === "GET") {
      const id = parseInt(req.params.id, 10);
      const oper = req.params.oper;

      const resp = await axios.post(
        `${process.env.SERVIDOR}/getOcorrenciasByID`,
        { ocorrenciaid: id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (resp.data.status === "ok") {
        const registro = resp.data.registro[0];
        res.render("Ocorrencias/view_cadOcorrencias", {
          title: "Cadastro da Ocorrência",
          data: registro,
          oper: oper,
          userName: userName,
        });
      }
    } else if (req.method === "POST") {
      const regPost = validateForm(req.body);
      const id = parseInt(regPost.ocorrenciaid, 10);

      const resp = await axios.post(
        `${process.env.SERVIDOR}/updateOcorrencias`,
        regPost,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      res.json({ status: resp.data.status === "ok" ? "ok" : "erro" });
    }
  } catch (error) {
    res.json({ status: "erro", mensagem: "Ocorrência não pode ser alterada" });
    console.log("[ctlOcorrencias.js|viewOcorrencias] Erro não identificado:", error);
  }
};

//@ Deleta a Ocorrência
const deleteOcorrencias = async (req, res) => {
  const userName = req.session.userName;
  const token = req.session.token;
  try {
    const id = parseInt(req.body.id, 10);

    const resp = await axios.post(
      `${process.env.SERVIDOR}/DeleteOcorrencias`,
      { ocorrenciaid: id },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json({ status: resp.data.status === "ok" ? "ok" : "erro" });
  } catch (error) {
    console.log("[ctlOcorrencias.js|deleteOcorrencias] Erro não identificado:", error);
  }
};

module.exports = {
  getAllOcorrencias,
  viewOcorrencias,
  insertOcorrencias,
  deleteOcorrencias,
};
