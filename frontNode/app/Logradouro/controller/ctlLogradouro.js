const axios = require("axios");
const moment = require("moment");

//@ Abre o formulário de manutenção de logradouro
const getAllLogradouro = async (req, res) => {
  const userName = req.session.userName;
  try {
    const response = await axios.get(`${process.env.SERVIDOR}/getAllLogradouro`);
    res.render("logradouro/view_manutencao", {
      title: "Manutenção do Logradouro",
      data: response.data,
      userName: userName,
    });
  } catch (error) {
    console.error("[ctlLogradouro.js|getAllLogradouro] Erro de requisição:", error);
  }
};

//@ Abre e faz operações de CRUD no formulário de cadastro de logradouro
const insertLogradouro = async (req, res) => {
  const userName = req.session.userName;
  const token = req.session.token;

  try {
    if (req.method === "GET") {
      const [CidadeResponse] = await Promise.all([
        axios.get(`${process.env.SERVIDOR}/GetAllCidade`),
      ]);

      const registro = {
        logradouroid: 0,
        nomelogradouro: "",
        cidadeidfk: "",
        removido: false,
      };

      res.render("logradouro/view_cadLogradouro", {
        title: "Cadastro de Logradouro",
        data: registro,
        Cidade: CidadeResponse.data.registro,
        oper: "c",
        userName: userName,
      });
    } else if (req.method === "POST") {
      const logradouroREG = validateForm(req.body);
      const response = await axios.post(
        `${process.env.SERVIDOR}/insertLogradouro`,
        {
          logradouroid: 0,
          nomelogradouro: logradouroREG.nomelogradouro,
          cidadeidfk: logradouroREG.cidadeidfk,
          removido: false,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const status = response.data.status === "ok" ? "ok" : "erro";
      const mensagem = status === "ok" ? "Logradouro inserido com sucesso!" : "Erro ao inserir logradouro!";

      const [CidadeResponse] = await Promise.all([
        axios.get(`${process.env.SERVIDOR}/GetAllCidade`),
      ]);

      res.render("logradouro/view_cadLogradouro", {
        title: "Cadastro de Logradouro",
        data: status === "ok" ? { logradouroid: 0, nomelogradouro: "", cidadeidfk: "", removido: false } : logradouroREG,
        Cidade: CidadeResponse.data.registro,
        oper: "c",
        userName: userName,
        mensagem: mensagem,
      });
    }
  } catch (error) {
    console.error("[ctlLogradouro.js|insertLogradouro] Erro não identificado:", error);
  }
};

//@ Abre o formulário de cadastro de logradouro para futura edição
const viewLogradouro = async (req, res) => {
  const userName = req.session.userName;
  const token = req.session.token;

  try {
    if (req.method === "GET") {
      const id = parseInt(req.params.id, 10);
      const oper = req.params.oper;

      const response = await axios.post(
        `${process.env.SERVIDOR}/getLogradouroByID`,
        { logradouroid: id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "ok") {
        const registro = response.data.registro[0];
        res.render("logradouro/view_cadLogradouro", {
          title: "Cadastro de Logradouro",
          data: registro,
          oper: oper,
          userName: userName,
        });
      }
    } else if (req.method === "POST") {
      const logradouroREG = validateForm(req.body);
      const id = parseInt(logradouroREG.logradouroid, 10);

      const response = await axios.post(
        `${process.env.SERVIDOR}/updateLogradouro`,
        {
          logradouroid: id,
          nomelogradouro: logradouroREG.nomelogradouro,
          cidadeidfk: logradouroREG.cidadeidfk,
          removido: false,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      res.json({ status: response.data.status === "ok" ? "ok" : "erro" });
    }
  } catch (error) {
    res.json({ status: "erro", mensagem: "Logradouro não pode ser alterado" });
    console.error("[ctlLogradouro.js|viewLogradouro] Erro não identificado:", error);
  }
};

//@ Deleta o logradouro
const deleteLogradouro = async (req, res) => {
  const userName = req.session.userName;
  const token = req.session.token;

  try {
    const id = parseInt(req.body.id, 10);

    const response = await axios.post(
      `${process.env.SERVIDOR}/DeleteLogradouro`,
      { logradouroid: id },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json({ status: response.data.status === "ok" ? "ok" : "erro" });
  } catch (error) {
    console.error("[ctlLogradouro.js|deleteLogradouro] Erro não identificado:", error);
  }
};

module.exports = {
  getAllLogradouro,
  viewLogradouro,
  insertLogradouro,
  deleteLogradouro,
};
