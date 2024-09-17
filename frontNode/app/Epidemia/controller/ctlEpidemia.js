const axios = require("axios");

//@ Abre o formulário de manutenção de epidemia
const getAllEpidemia = async (req, res) => {

  console.log("getAllEpidemia");
  token = req.session.token
  console.log("[ctlEpidemia|getAllEpidemia] TOKEN:", token);

    userName = req.session.userName;

    try {
    const resp = await axios.get('http://localhost:20100/acl/epidemia/v1/GetAllEpidemias',     
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );

    console.log("[ctlEpidemia|resp.data]", JSON.stringify(resp.data));

        // Renderiza a página com os dados obtidos
        res.render("epidemia/view_manutencao", {
        title: "Manutenção de Epidemias",
        data: resp.data,
        userName: userName,
      });

      console.log("Resposta enviada com sucesso para epidemia");

    } catch (error) {
      console.error('Erro ao buscar epidemia:' );  //, error);
  
      if (!res.headersSent) {
        res.status(500).json({ error: 'Erro ao buscar epidemia' });
        console.log("Resposta de erro enviada");
      } else {
        console.log("Erro ao buscar epidemia, mas a resposta já havia sido enviada");
      }
    }
  };

//@ Abre formulário de cadastro de epidemia
const openEpidemiaInsert = (req, res) =>
  (async () => {
    var oper = "";
    userName = req.session.userName;
    token = req.session.token;
    try {
      if (req.method == "GET") {
        oper = "c";
        res.render("epidemia/view_cadEpidemia", {
          title: "Cadastro de epidemia",
          oper: oper,
          userName: userName,
        });
      }
    } catch (erro) {
      console.log(
        "[ctlEpidemia.js|insertEpidemia] Try Catch: Erro não identificado",
        erro
      );
    }
  })();

//@ Função para validar campos no formulário
function validateForm(regFormPar) {
  if (regFormPar.epidemiaid == "") {
    regFormPar.epidemiaid = 0;
  } else {
    regFormPar.epidemiaid = parseInt(regFormPar.epidemiaid);
  }

  regFormPar.removido = regFormPar.removido === "true"; //converte para true ou false um check componet

  return regFormPar;
}

//@ Abre formulário de cadastro de epidemia
const openEpidemiaUpdate = (req, res) =>
  (async () => {
    var oper = "";
    userName = req.session.userName;
    token = req.session.token;
    try {
      if (req.method == "GET") {
        oper = "u";
        const id = req.params.id;
        parseInt(id);
        res.render("epidemia/view_cadEpidemia", {
          title: "Cadastro de epidemia",
          oper: oper,
          idBusca: id,
          userName: userName,
        });
      }
    } catch (erro) {
      console.log(
        "[ctlEpidemia.js|insertEpidemia] Try Catch: Erro não identificado",
        erro
      );
    }
  })();


//@ Recupera os dados das epidemia
const getDados = (req, res) =>
  (async () => {
    const idBusca = req.body.idBusca;    
    parseInt(idBusca);
    console.log("[ctlEpidemia.js|getDados] valor id :", idBusca);
    try {
      resp = await axios.post(
        process.env.SERVIDOR + "/GetEpidemiaByID",
        {
          epidemiaid: idBusca,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      if (epidemia.status == "ok") {
        res.json({ status: "ok", registro: epidemia.registro[0] });
      }
    } catch (error) { 
      console.log(
        "[ctlEpidemia.js|getDados] Try Catch: Erro não identificado",
        erro
      );
    }
    
  })();

//@ Realiza inserção de epidemia
const insertEpidemia = (req, res) =>
  (async () => {
    token = req.session.token;
    try {
      if (req.method == "POST") {
        const regPost = validateForm(req.body);
        regPost.epidemiaid = 0;
        const resp = await axios.post(
          process.env.SERVIDOR + "/InsertEpidemia",
          regPost,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (resp.data.status == "ok") {
          res.json({ status: "ok", mensagem: "Epidemia inserida com sucesso!" });
        } else {
          res.json({ status: "erro", mensagem: "Erro ao inserir epidemia!" });
        }
      }
    } catch (erro) {
      console.log(
        "[ctlEpidemia.js|insertEpidemia] Try Catch: Erro não identificado",
        erro
      );
    }
  })();

 
  
//@ Realiza atualização de epidemia
///@ console.log("[ctlEpidemia.js|updateEpidemia] Valor regPost: ", regPost);
const updateEpidemia = (req, res) =>
  (async () => {
    token = req.session.token;
    try {
      if (req.method == "POST") {
        const regPost = validateForm(req.body);
        const resp = await axios.post(
          process.env.SERVIDOR + "/UpdateEpidemia",
          regPost,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (resp.data.status == "ok") {
          res.json({ status: "ok", mensagem: "Epidemia atualizada com sucesso!" });
        } else {
          res.json({ status: "erro", mensagem: "Erro ao atualizar epidemia!" });
        }
      }
    } catch (erro) {
      console.log(
        "[ctlEpidemia.js|updateEpidemia] Try Catch: Erro não identificado.",
        erro
      );
    }
  })();

//@ Realiza remoção soft de epidemia
//@ "[ctlEpidemia.js|deleteEpidemia] Try Catch: Erro não identificado", erro);
const deleteEpidemia = (req, res) =>
(async () => {
  token = req.session.token;
  try {
    if (req.method == "POST") {
      const regPost = validateForm(req.body);
      regPost.epidemiaid = parseInt(regPost.epidemiaid);
      const resp = await axios.post(
        process.env.SERVIDOR + "/DeleteEpidemia",
        {
          epidemiaid: regPost.epidemiaid,
        },        
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      if (resp.data.status == "ok") {
        res.json({ status: "ok", mensagem: "Epidemia removida com sucesso!" });
      } else {
        res.json({ status: "erro", mensagem: "Erro ao remover epidemia!" });
      }
    }
  } catch (erro) {
    console.log(
      "[ctlEpidemia.js|deleteEpidemia] Try Catch: Erro não identificado", erro);
  }
})();
module.exports = {
  getAllEpidemia,
  openEpidemiaInsert,
  openEpidemiaUpdate,
  getDados,
  insertEpidemia,
  updateEpidemia,
  deleteEpidemia,
};
