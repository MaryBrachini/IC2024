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

    console.log("[ctlEpidemia|resp.data]", JSON.stringify(resp.data.regReturn));

        // Renderiza a página com os dados obtidos
        res.render("epidemia/view_manutencao", {
        title: "Manutenção de Epidemias",
        data: resp.data.regReturn,
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
const openEpidemiaInsert = async(req, res) => {

  console.log("[ctlEpidemia|openEpidemiaInsert]");

    var oper = "";
    userName = req.session.userName;
    token = req.session.token;

    try {
       console.log("[ctlEpidemia|openEpidemiaInsert]try");

      if (req.method == "GET") {
        oper = "c";
        
        res.render("epidemia/view_cadEpidemia", {
          title: "Cadastro de epidemia",
          oper: oper,
          userName: userName,
        });

        console.log("[ctlEpidemia|openEpidemiaInsert] Página renderizada com sucesso.");

      } else {
        console.log("[ctlEpidemia|openEpidemiaInsert] Método HTTP não suportado: " + req.method);
        res.status(405).send("Método não permitido.");
      }
    } catch (erro) {
      console.error("[ctlEpidemia|openEpidemiaInsert] Erro capturado:", erro);
    res.status(500).send({ error: "Erro no servidor: " + erro.message });
    }
  };

//@ Função para validar campos no formulário
function validateForm(regFormPar) {

  console.log("[ctlBairro.js|validateForm]");

  regFormPar.EpidemiaID = regFormPar.EpidemiaID ? parseInt(regFormPar.EpidemiaID) : 0;
  regFormPar.Removido = regFormPar.Removido === "true";
  return regFormPar;
}

//@ Abre formulário de cadastro de epidemia
const openEpidemiaUpdate = async (req, res) => {

    var oper = "";
    userName = req.session.userName;
    token = req.session.token;
    const id = parseInt(req.params.id, 10);

    try {

      console.log("[ctlEpidemia.js|openEpidemiaUpdate]try");

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
      console.log("[ctlEpidemia.js|openEpidemiaUpdate] Erro:", error);
      res.status(500).send("Erro ao obter dados do epidemia para atualização.");
  }
  };


//@ Recupera os dados das epidemia
const getDados  = async (req, res) => {

  const idBusca = parseInt(req.body.idBusca, 10);
  console.log("[ctlEpidemia.js|getDados] valor id :", idBusca);

    try {
      console.log("[ctlEpidemia.js|getDados]Try");

      if (isNaN(idBusca)) {
        return res.status(400).json({ status: "error", message: "ID inválido fornecido." });
    }
      resp = await axios.post(
      "http://localhost:20100/acl/epidemia/v1/GetEpidemiaByID",
        {
          EpidemiaID: idBusca,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + req.session.token,
          },
        }
      );
     
       // Verificando se a resposta foi bem-sucedida
      if (resp.data.status === "success" && resp.data.msg === "ok") {
        console.log("[ctlEpidemia.js|getDados] Dados recebidos com sucesso.");
        res.status(200).json({ status: "ok", registro: resp.data.regReturn });
    } else {
        console.error("[ctlEpidemia.js|getDados] Erro ao obter dados:", resp.data);
        res.status(404).json({ status: "error", message: "Dados da epidemia não encontrados." });
    }

    } catch (error) { 
      console.log("[ctlEpidemia.js|getDados] Catch, Erro não identificado", error.response ? error.response.data : error.message);
      res.status(500).send("Erro ao processar a requisição para obter dados da epidemia");
    }
  };

//@ Realiza inserção de epidemia
const insertEpidemia = async (req, res) => {

    token = req.session.token;
    console.log("[ctlBairro.js|insertEpidemia]");

    try {
    /* console.log("[ctlEpidemia.js|insertEpidemia]try"); */

      if (req.method == "POST") {
         /* console.log("[ctlEpidemia.js|insertEpidemia]IF"); */

        const regPost = validateForm(req.body);
        regPost.EpidemiaID = 0;

        console.log("[ctlBairro.js|InsertBairro] Dados a serem enviados:", regPost);

        const resp = await axios.post(
          "http://localhost:20100/acl/epidemia/v1/InsertEpidemia",
          regPost,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        console.log("[ctlEpidemia.js|insertEpidemia]await axios.post");

        if (resp.data.status == "ok") {
          res.json({ status: "ok", mensagem: "Epidemia inserida com sucesso!" });
        } else {
          res.json({ status: "erro", mensagem: "Erro ao inserir epidemia!" });
        }
      }
    } catch (erro) {
      console.log(
        "[ctlEpidemia.js|insertEpidemia] Try Catch: Erro não identificado"
      );
    }
  };

 
  
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
      regPost.EpidemiaID = parseInt(regPost.EpidemiaID);
      const resp = await axios.post(
        process.env.SERVIDOR + "/DeleteEpidemia",
        {
          EpidemiaID: regPost.EpidemiaID,
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
