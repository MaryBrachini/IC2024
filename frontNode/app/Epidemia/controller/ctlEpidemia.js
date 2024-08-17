const axios = require("axios");

//@ Abre o formulário de manutenção de epidemia
const getAllEpidemia = async (req, res) => {
  const userName = req.session.userName;
  try {
    const resp = await axios.get(`${process.env.SERVIDOR}/GetAllEpidemia`);
    res.render("epidemia/view_manutencao", {
      title: "Manutenção de Epidemias",
      data: resp.data,
      userName: userName,
    });
  } catch (error) {
    console.log("[ctlEpidemia.js|getAllEpidemia] Erro de requisição", error);
  }
};

//@ Abre formulário de cadastro de epidemia
const openEpidemiaInsert = async (req, res) => {
  const userName = req.session.userName;
  const token = req.session.token;
  try {
    if (req.method === "GET") {
      const oper = "c";
      res.render("epidemia/view_cadEpidemia", {
        title: "Cadastro de epidemia",
        oper: oper,
        userName: userName,
      });
    }
  } catch (error) {
    console.log("[ctlEpidemia.js|openEpidemiaInsert] Erro não identificado", error);
  }
};

//@ Função para validar campos no formulário
function validateForm(regFormPar) {
  regFormPar.epidemiaid = regFormPar.epidemiaid === "" ? 0 : parseInt(regFormPar.epidemiaid, 10);
  regFormPar.removido = regFormPar.removido === "true"; // Converte para true ou false um checkbox

  return regFormPar;
}

//@ Abre formulário de cadastro de epidemia para edição
const openEpidemiaUpdate = async (req, res) => {
  const userName = req.session.userName;
  const token = req.session.token;
  try {
    if (req.method === "GET") {
      const oper = "u";
      const id = parseInt(req.params.id, 10);
      res.render("epidemia/view_cadEpidemia", {
        title: "Cadastro de epidemia",
        oper: oper,
        idBusca: id,
        userName: userName,
      });
    }
  } catch (error) {
    console.log("[ctlEpidemia.js|openEpidemiaUpdate] Erro não identificado", error);
  }
};

//@ Recupera os dados da epidemia
const getDados = async (req, res) => {
  const idBusca = parseInt(req.body.idBusca, 10);
  console.log("[ctlEpidemia.js|getDados] valor id:", idBusca);
  const token = req.session.token;
  try {
    const resp = await axios.post(
      `${process.env.SERVIDOR}/GetEpidemiaByID`,
      { epidemiaid: idBusca },
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
    console.log("[ctlEpidemia.js|getDados] Erro não identificado", error);
  }
};

//@ Realiza inserção de epidemia
const insertEpidemia = async (req, res) => {
  const token = req.session.token;
  try {
    if (req.method === "POST") {
      const regPost = validateForm(req.body);
      regPost.epidemiaid = 0;
      const resp = await axios.post(
        `${process.env.SERVIDOR}/InsertEpidemia`,
        regPost,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (resp.data.status === "ok") {
        res.json({ status: "ok", mensagem: "Epidemia inserida com sucesso!" });
      } else {
        res.json({ status: "erro", mensagem: "Erro ao inserir epidemia!" });
      }
    }
  } catch (error) {
    console.log("[ctlEpidemia.js|insertEpidemia] Erro não identificado", error);
  }
};

//@ Realiza atualização de epidemia
const updateEpidemia = async (req, res) => {
  const token = req.session.token;
  try {
    if (req.method === "POST") {
      const regPost = validateForm(req.body);
      const resp = await axios.post(
        `${process.env.SERVIDOR}/UpdateEpidemia`,
        regPost,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (resp.data.status === "ok") {
        res.json({ status: "ok", mensagem: "Epidemia atualizada com sucesso!" });
      } else {
        res.json({ status: "erro", mensagem: "Erro ao atualizar epidemia!" });
      }
    }
  } catch (error) {
    console.log("[ctlEpidemia.js|updateEpidemia] Erro não identificado", error);
  }
};

//@ Realiza remoção soft de epidemia
const deleteEpidemia = async (req, res) => {
  const token = req.session.token;
  try {
    if (req.method === "POST") {
      const regPost = validateForm(req.body);
      regPost.epidemiaid = parseInt(regPost.epidemiaid, 10);
      const resp = await axios.post(
        `${process.env.SERVIDOR}/De
