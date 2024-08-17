const axios = require("axios");

//@ Abre o formulário de manutenção de estado
const getAllEstado = async (req, res) => {
  const userName = req.session.userName;
  try {
    const resp = await axios.get(`${process.env.SERVIDOR}/GetAllEstado`);
    res.render("estado/view_manutencao", {
      title: "Manutenção de estado",
      data: resp.data,
      userName: userName,
    });
  } catch (error) {
    console.log("[ctlEstado.js|getAllEstado] Erro de requisição:", error);
  }
};

//@ Abre formulário de cadastro de estado
const openEstadoInsert = async (req, res) => {
  const userName = req.session.userName;
  const token = req.session.token;
  try {
    if (req.method === "GET") {
      const oper = "c";
      res.render("estado/view_cadEstado", {
        title: "Cadastro de estado",
        oper: oper,
        userName: userName,
      });
    }
  } catch (error) {
    console.log("[ctlEstado.js|openEstadoInsert] Erro não identificado:", error);
  }
};

//@ Função para validar campos no formulário
function validateForm(regFormPar) {
  regFormPar.estadoid = regFormPar.estadoid === "" ? 0 : parseInt(regFormPar.estadoid, 10);
  regFormPar.removido = regFormPar.removido === "true"; // Converte para true ou false um checkbox

  return regFormPar;
}

//@ Abre formulário de cadastro de estado para edição
const openEstadoUpdate = async (req, res) => {
  const userName = req.session.userName;
  const token = req.session.token;
  try {
    if (req.method === "GET") {
      const oper = "u";
      const id = parseInt(req.params.id, 10);
      res.render("estado/view_cadEstado", {
        title: "Cadastro de estado",
        oper: oper,
        idBusca: id,
        userName: userName,
      });
    }
  } catch (error) {
    console.log("[ctlEstado.js|openEstadoUpdate] Erro não identificado:", error);
  }
};

//@ Recupera os dados dos estados
const getDados = async (req, res) => {
  const idBusca = parseInt(req.body.idBusca, 10);
  const token = req.session.token;
  try {
    const resp = await axios.post(
      `${process.env.SERVIDOR}/GetEstadoByID`,
      { estadoid: idBusca },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (resp.data.status === "ok") {
      res.json({ status: "ok", registro: resp.data.registro[0] });
    }
  } catch (error) {
    console.log("[ctlEstado.js|getDados] Erro não identificado:", error);
  }
};

//@ Realiza inserção de estado
const insertEstado = async (req, res) => {
  const token = req.session.token;
  try {
    if (req.method === "POST") {
      const regPost = validateForm(req.body);
      regPost.estadoid = 0;
      const resp = await axios.post(
        `${process.env.SERVIDOR}/InsertEstado`,
        regPost,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (resp.data.status === "ok") {
        res.json({ status: "ok", mensagem: "Estado inserido com sucesso!" });
      } else {
        res.json({ status: "erro", mensagem: "Erro ao inserir estado!" });
      }
    }
  } catch (error) {
    console.log("[ctlEstado.js|insertEstado] Erro não identificado:", error);
  }
};

//@ Realiza atualização de estado
const updateEstado = async (req, res) => {
  const token = req.session.token;
  try {
    if (req.method === "POST") {
      const regPost = validateForm(req.body);
      const resp = await axios.post(
        `${process.env.SERVIDOR}/UpdateEstado`,
        regPost,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (resp.data.status === "ok") {
        res.json({ status: "ok", mensagem: "Estado atualizado com sucesso!" });
      } else {
        res.json({ status: "erro", mensagem: "Erro ao atualizar estado!" });
      }
    }
  } catch (error) {
    console.log("[ctlEstado.js|updateEstado] Erro não identificado:", error);
  }
};

//@ Realiza remoção soft de estado
const deleteEstado = async (req, res) => {
  const token = req.session.token;
  try {
    if (req.method === "POST") {
      const regPost = validateForm(req.body);
      regPost.estadoid = parseInt(regPost.estadoid, 10);
      const resp = await axios.post(
        `${process.env.SERVIDOR}/DeleteEstado`,
        { estadoid: regPost.estadoid },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (resp.data.status === "ok") {
        res.json({ status: "ok", mensagem: "Estado removido com sucesso!" });
      } else {
        res.json({ status: "erro", mensagem: "Erro ao remover estado!" });
      }
    }
  } catch (error) {
    console.log("[ctlEstado.js|deleteEstado] Erro não identificado:", error);
  }
};

module.exports = {
  getAllEstado,
  openEstadoInsert,
  openEstadoUpdate,
  getDados,
  insertEstado,
  updateEstado,
  deleteEstado,
};
