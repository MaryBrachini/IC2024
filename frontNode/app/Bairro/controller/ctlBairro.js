const axios = require("axios");

//@ Abre o formulário de manutenção de bairro
const getAllBairro = async (req, res) => {
  const userName = req.session.userName;
  try {
    const resp = await axios.get(process.env.SERVIDOR + "/GetAllBairro");
    res.render("bairro/view_manutencao", {
      title: "Manutenção de bairro",
      data: resp.data,
      userName: userName,
    });
  } catch (error) {
    console.log("[ctlBairro.js|getAllBairro] Try Catch: Erro de requisição", error);
  }
};

//@ Abre formulário de cadastro de bairro
const openBairroInsert = async (req, res) => {
  const userName = req.session.userName;
  if (req.method === "GET") {
    try {
      res.render("bairro/view_cadBairro", {
        title: "Cadastro de bairro",
        oper: "c",
        userName: userName,
      });
    } catch (error) {
      console.log("[ctlBairro.js|openBairroInsert] Try Catch: Erro não identificado", error);
    }
  }
};

//@ Função para validar campos no formulário
function validateForm(regFormPar) {
  regFormPar.bairroId = regFormPar.bairroId === "" ? 0 : parseInt(regFormPar.bairroId);
  regFormPar.removido = regFormPar.removido === "true"; 
  return regFormPar;
}

//@ Abre formulário de atualização de bairro
const openBairroUpdate = async (req, res) => {
  const userName = req.session.userName;
  const token = req.session.token;
  if (req.method === "GET") {
    try {
      const id = parseInt(req.params.id);
      res.render("bairro/view_cadBairro", {
        title: "Cadastro de bairro",
        oper: "u",
        idBusca: id,
        userName: userName,
      });
    } catch (error) {
      console.log("[ctlBairro.js|openBairroUpdate] Try Catch: Erro não identificado", error);
    }
  }
};

//@ Recupera os dados dos bairro
const getDados = async (req, res) => {
  const token = req.session.token;
  const idBusca = parseInt(req.body.idBusca);
  console.log("[ctlBairro.js|getDados] valor id :", idBusca);
  if (!token) {
    return res.status(401).json({ status: 'erro', mensagem: 'Token não encontrado' });
  }
  try {
    const resp = await axios.post(
      process.env.SERVIDOR + "/GetBairroByID",
      { bairroId: idBusca },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    if (resp.data.status === "ok") {
      res.json({ status: "ok", registro: resp.data.registro[0] });
    }
  } catch (error) { 
    console.log("[ctlBairro.js|getDados] Try Catch: Erro não identificado", error);
  }
};

//@ Realiza inserção de bairro
const insertBairro = async (req, res) => {
  const token = req.session.token;
  if (!token) {
    return res.status(401).json({ status: 'erro', mensagem: 'Token não encontrado' });
  }
  try {
    if (req.method === "POST") {
      const regPost = validateForm(req.body);
      regPost.bairroId = 0;
      const resp = await axios.post(
        process.env.SERVIDOR + "/InsertBairro",
        regPost,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      if (resp.data.status === "ok") {
        res.json({ status: "ok", mensagem: "Bairro inserido com sucesso!" });
      } else {
        res.json({ status: "erro", mensagem: "Erro ao inserir bairro!" });
      }
    }
  } catch (error) {
    console.log("[ctlBairro.js|insertBairro] Try Catch: Erro não identificado", error);
  }
};

//@ Realiza atualização de bairro
const updateBairro = async (req, res) => {
  const token = req.session.token;
  if (!token) {
    return res.status(401).json({ status: 'erro', mensagem: 'Token não encontrado' });
  }
  try {
    if (req.method === "POST") {
      const regPost = validateForm(req.body);
      const resp = await axios.post(
        process.env.SERVIDOR + "/UpdateBairro",
        regPost,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      if (resp.data.status === "ok") {
        res.json({ status: "ok", mensagem: "Bairro atualizado com sucesso!" });
      } else {
        res.json({ status: "erro", mensagem: "Erro ao atualizar bairro!" });
      }
    }
  } catch (error) {
    console.log("[ctlBairro.js|updateBairro] Try Catch: Erro não identificado", error);
  }
};

//@ Realiza remoção soft de bairro
const deleteBairro = async (req, res) => {
  const token = req.session.token;
  if (!token) {
    return res.status(401).json({ status: 'erro', mensagem: 'Token não encontrado' });
  }
  try {
    if (req.method === "POST") {
      const regPost = validateForm(req.body);
      regPost.bairroId = parseInt(regPost.bairroId);
      const resp = await axios.post(
        process.env.SERVIDOR + "/DeleteBairro",
        { bairroId: regPost.bairroId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      if (resp.data.status === "ok") {
        res.json({ status: "ok", mensagem: "Bairro removido com sucesso!" });
      } else {
        res.json({ status: "erro", mensagem: "Erro ao remover bairro!" });
      }
    }
  } catch (error) {
    console.log("[ctlBairro.js|deleteBairro] Try Catch: Erro não identificado", error);
  }
};

module.exports = {
  getAllBairro,
  openBairroInsert,
  openBairroUpdate,
  getDados,
  insertBairro,
  updateBairro,
  deleteBairro,
};
