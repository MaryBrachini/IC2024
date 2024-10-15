const axios = require("axios");

//@ Abre o formulário de manutenção de estado
const getAllEstado = async (req, res) => {

  console.log("getAllEstado");

  token = req.session.token
  console.log("[ctlEstado|getAllEstado] TOKEN:", token);

  userName = req.session.userName;

    try {
      const resp = await axios.get('http://localhost:20100/acl/estado/v1/GetAllEstados',     
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
  
      console.log("[ctlEstado|resp.data]", JSON.stringify(resp.data.regReturn));
  
      // Renderiza a página com os dados obtidos
      res.render("estado/view_manutencao", {
        title: "Manutenção de estado",
        data: resp.data.regReturn,
        userName: userName,
      });
      console.log("Resposta enviada com sucesso para estado");
    
    } catch (error) {
      console.error('Erro ao buscar estado:' );
  
      if (!res.headersSent) {
        res.status(500).json({ error: 'Erro ao buscar estado' });
        console.log("Resposta de erro enviada");
      } else {
        console.log("Erro ao buscar estado, mas a resposta já havia sido enviada");
      }
    }
  };

//@ Abre formulário de cadastro de estado
const openEstadoInsert = async(req, res) => {

    var oper = "";
    userName = req.session.userName;
    token = req.session.token;

    try {
      if (req.method == "GET") {
        oper = "c";

        res.render("estado/view_cadEstado", {
          title: "Cadastro de estado",
          oper: oper,
          userName: userName,
        });
      }
    } catch (erro) {
      console.log(
        "[ctlEstado.js|insertEstado] Try Catch: Erro não identificado", erro );
    }
  };

//@ Função para validar campos no formulário
function validateForm(regFormPar) {

  console.log("[ctlEstado.js|validateForm]");

  regFormPar.estadoid = regFormPar.estadoid ? parseInt(regFormPar.estadoid) : 0;
  regFormPar.Removido = regFormPar.Removido === "true";

  return regFormPar;
}

//@ Abre formulário de cadastro de estado
const openEstadoUpdate = async (req, res) => {

    var oper = "";
    userName = req.session.userName;
    token = req.session.token;
    const id = parseInt(req.params.id, 10);

    console.log("[ctlEstado.js|openEstadoUpdate] ID:", id);

    try {
      if (req.method == "GET") {
        oper = "u";
        const id = req.params.id;
        parseInt(id);
        res.render("estado/view_cadEstado", {
          title: "Cadastro de estado",
          oper: oper,
          idBusca: id,
          userName: userName,
        });
      }
    } catch (erro) {
      console.log(
        "[ctlEstado.js|updateEstado] Try Catch: Erro não identificado",
        erro
      );
    }
  };


//@ Recupera os dados dos estado
const getDados  = async (req, res) => {

    const idBusca = parseInt(req.body.idBusca, 10);
    console.log("[ctlEstado.js|getDados] valor id :", idBusca);

    try {
      resp = await axios.post(
        "http://localhost:20100/acl/estado/v1/GetEstadoByID",
        {
          estadoid: idBusca,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + req.session.token,
          },
        }
      );

       /* console.log("[ctlEstado.js|getDados]"); */

      if (resp.data.status === "success" && resp.data.msg === "ok") {
          console.log("[ctlEstado.js|getDados] Dados recebidos com sucesso.");
          res.status(200).json({ status: "ok", registro: resp.data.regReturn });
      } else {
          console.error("[ctlEstado.js|getDados] Erro ao obter dados:", resp.data);
          res.status(404).json({ status: "error", message: "Dados do estado não encontrados." });
      }

    } catch (error) { 
      console.log("[ctlEstado.js|getDados] Catch, Erro não identificado", error.response ? error.response.data : error.message);
      res.status(500).send("Erro ao processar a requisição para obter dados do estado");
    }
    
  };

//@ Realiza inserção de estado
const insertEstado = async (req, res) => {

    token = req.session.token;
    console.log("[ctlEstado.js|insertEstado]");

    try {
      if (req.method == "POST") {

        const regPost = validateForm(req.body);
        regPost.estadoid = 0;

        console.log("[ctlEstado.js|insertEstado] Dados a serem enviados:", regPost);

        const resp = await axios.post(
          "http://localhost:20100/acl/estado/v1/InsertEstado",
          regPost,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (resp.data.status === "success") {
          res.json({ status: "success", mensagem: "estado inserido com sucesso!" });
        } else {
          console.log("[ctlEstado.js|insertEstado] Erro ao inserir estado:", resp.data);
          res.json({ status: "erro", mensagem: "Erro ao inserir estado!" });
        } 
      }  
    } catch (erro) {
      console.log("[ctlEstado.js|insertEstado] Erro não identificado", error.response ? error.response.data : error.message);
      res.status(500).send("Erro ao processar a requisição para inserir o estado");
    }
  };

 
//@ Realiza atualização de estado
const updateEstado = async (req, res) => {

    token = req.session.token;

    try {
      if (req.method == "POST") {
        const regPost = validateForm(req.body);

        const resp = await axios.post(
          "http://localhost:20100/acl/estado/v1/UpdateEstado",
          regPost,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (resp.data.status == "ok") {
          res.json({ status: "ok", mensagem: "Estado atualizado com sucesso!" });
        } else {
          res.json({ status: "erro", mensagem: "Erro ao atualizar estado!" });
        }
      }
    } catch (erro) {
      console.log("[ctlEstado.js|updateEstado] Try Catch: Erro não identificado.", erro);
    }
  };

//@ Realiza remoção soft de estado
const deleteEstado  = async (req, res) => {

  token = req.session.token;

  try {
    if (req.method == "POST") {

      const regPost = validateForm(req.body);
      regPost.estadoid = parseInt(regPost.estadoid);

      const resp = await axios.post(
        "http://localhost:20100/acl/estado/v1/DeleteEstado",
        {
          estadoid: regPost.estadoid,
        },        
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      if (resp.data.status == "ok") {
        res.json({ status: "ok", mensagem: "Estado Removido com sucesso!" });
      } else {
        res.json({ status: "erro", mensagem: "Erro ao remover estado!" });
      }
    }
  } catch (erro) {
    console.log(
      "[ctlEstado.js|deleteEstado] Try Catch: Erro não identificado", erro);
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
