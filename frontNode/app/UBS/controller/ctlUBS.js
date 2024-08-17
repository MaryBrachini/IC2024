const axios = require("axios");

//@ Abre o formulário de manutenção de UBS
const getAllUBS = async (req, res) => {
  const userName = req.session.userName;
  try {
    const response = await axios.get(`${process.env.SERVIDOR}/getAllUBS`);
    res.render("UBS/view_manutencao", {
      title: "Manutenção da Unidade Básica de Saúde",
      data: response.data,
      userName: userName,
    });
  } catch (error) {
    console.error("[ctlUBS.js|getAllUBS] Erro de requisição:", error);
  }
};

//@ Abre e faz operações de CRUD no formulário de cadastro de UBS
const insertUBS = async (req, res) => {
  const userName = req.session.userName;
  const token = req.session.token;

  try {
    if (req.method === "GET") {
      const [bairroResponse] = await Promise.all([
        axios.get(`${process.env.SERVIDOR}/GetAllBairro`)
      ]);

      const registro = {
        unidBasicaSaudeID: 0,
        nomeUBS: "",
        codigoUBS: "",
        bairroIDFK: "",
        removido: false,
      };

      res.render("UBS/view_cadUBS", {
        title: "Cadastro da Unidade Básica de Saúde",
        data: registro,
        Bairro: bairroResponse.data.registro,
        oper: "c",
        userName: userName,
      });
    } else if (req.method === "POST") {
      const ubsREG = validateForm(req.body);
      const response = await axios.post(
        `${process.env.SERVIDOR}/insertUBS`,
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
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const status = response.data.status === "ok" ? "ok" : "erro";
      const mensagem = status === "ok" ? "UBS inserida com sucesso!" : "Erro ao inserir UBS!";

      const [bairroResponse] = await Promise.all([
        axios.get(`${process.env.SERVIDOR}/GetAllBairro`)
      ]);

      res.render("UBS/view_cadUBS", {
        title: "Cadastro da Unidade Básica de Saúde",
        data: status === "ok" ? { unidBasicaSaudeID: 0, nomeUBS: "", codigoUBS: "", bairroIDFK: "", removido: false } : ubsREG,
        Bairro: bairroResponse.data.registro,
        oper: "c",
        userName: userName,
        mensagem: mensagem,
      });
    }
  } catch (error) {
    console.error("[ctlUBS.js|insertUBS] Erro não identificado:", error);
  }
};

//@ Abre o formulário de cadastro de UBS para futura edição
const viewUBS = async (req, res) => {
  const userName = req.session.userName;
  const token = req.session.token;

  try {
    if (req.method === "GET") {
      const id = parseInt(req.params.id, 10);
      const oper = req.params.oper;

      const response = await axios.post(
        `${process.env.SERVIDOR}/getUBSByID`,
        { unidBasicaSaudeID: id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "ok") {
        const registro = response.data.registro[0];
        res.render("UBS/view_cadUBS", {
          title: "Cadastro da Unidade Básica de Saúde",
          data: registro,
          oper: oper,
          userName: userName,
        });
      }
    } else if (req.method === "POST") {
      const ubsREG = validateForm(req.body);
      const id = parseInt(ubsREG.unidBasicaSaudeID, 10);

      const response = await axios.post(
        `${process.env.SERVIDOR}/updateUBS`,
        {
          unidBasicaSaudeID: id,
          nomeUBS: ubsREG.nomeUBS,
          codigoUBS: ubsREG.codigoUBS,
          bairroIDFK: ubsREG.bairroIDFK,
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
    res.json({ status: "erro", mensagem: "UBS não pode ser alterado" });
    console.error("[ctlUBS.js|viewUBS] Erro não identificado:", error);
  }
};

//@ Deleta a UBS
const deleteUBS = async (req, res) => {
  const userName = req.session.userName;
  const token = req.session.token;

  try {
    const id = parseInt(req.body.id, 10);

    const response = await axios.post(
      `${process.env.SERVIDOR}/DeleteUBS`,
      { unidBasicaSaudeID: id },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json({ status: response.data.status === "ok" ? "ok" : "erro" });
  } catch (error) {
    console.error("[ctlUBS.js|deleteUBS] Erro não identificado:", error);
  }
};

module.exports = {
  getAllUBS,
  viewUB
