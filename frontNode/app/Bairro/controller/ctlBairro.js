const axios = require("axios");

// Função para lidar com a obtenção de todos os bairros
const GetAllBairros = async (req, res) => {

  console.log("GetAllBairros");

  token = req.session.token
  console.log("[ctlBairros|GetAllBairros] TOKEN:", token);

  userName = req.session.userName;

  try {
    const resp = await axios.get('http://localhost:20100/acl/bairro/v1/GetAllBairros',     
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );

    console.log("[ctlBairro|resp.data]", JSON.stringify(resp.data.regReturn));

    // Renderiza a página com os dados obtidos
    res.render("bairro/view_manutencao", {
      title: "Manutenção de Bairros",
      data: resp.data.regReturn,
      userName: userName
    });
   
    console.log("Resposta enviada com sucesso para bairros");
    
  } catch (error) {
    console.error('Erro ao buscar bairros:' );  //, error);

    if (!res.headersSent) {
      res.status(500).json({ error: 'Erro ao buscar bairros' });
      console.log("Resposta de erro enviada");
    } else {
      console.log("Erro ao buscar bairros, mas a resposta já havia sido enviada");
    }
  }
};

// Função para abrir o formulário de cadastro de bairro
const openBairroInsert = async(req, res) => {

    /* console.log("[ctlBairro.js|openBairroInsert]"); */

    var oper = "";
    userName = req.session.userName;
    token = req.session.token;

    try {
      /* console.log("[ctlBairro.jsopenBairroInsert]try"); */
      if (req.method == "GET") {
        oper = "c";

        res.render("bairro/view_cadBairro", {
          title: "Cadastro de bairro",
          oper: oper,
          userName: userName,
        });
      }
    } catch (erro) {
      console.log("[ctlBairro.js|openBairroInsert] Erro não identificado", error);
    }
  };

// Função para validar campos no formulário
const validateForm = (regFormPar) => {

  console.log("[ctlBairro.js|validateForm]");

  regFormPar.Bairroid = regFormPar.Bairroid ? parseInt(regFormPar.Bairroid) : 0;
  regFormPar.removido = regFormPar.removido === "true";
  return regFormPar;
  };

// Função para abrir o formulário de atualização de bairro
const openBairroUpdate = async (req, res) => {

  var oper = "";
  userName = req.session.userName;
  token = req.session.token;
  const id = parseInt(req.params.id, 10);

  console.log("[ctlBairro.js|openBairroUpdate] ID:", id);

  try {

    /* console.log("[ctlBairro.js|openBairroUpdate]try");*/

    if (req.method == "GET") {
      oper = "u";
      const id = req.params.id;
      parseInt(id);
      res.render("bairro/view_cadBairro", {
        title: "Atualizar Bairro",
        oper: oper,
        idBusca: id,
        userName: userName,
      });
    }

  } catch (erro) {
      console.log("[ctlBairro.js|openBairroUpdate] Erro:", error);
      res.status(500).send("Erro ao obter dados do bairro para atualização.");
  }
};

// Função para recuperar os dados do bairro e mostrar
const getDados = async (req, res) => {

  const idBusca = parseInt(req.body.idBusca, 10);
  console.log("[ctlBairro.js|getDados] valor id :", idBusca);

  try {
    /* console.log("[ctlBairro.js|getDados]Try"); */

    // Validar se o ID é um número válido
    if (isNaN(idBusca)) {
      return res.status(400).json({ status: "error", message: "ID inválido fornecido." });
  }

    const resp = await axios.post(
      "http://localhost:20100/acl/bairro/v1/GetBairrosByID",
      { Bairroid: idBusca },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + req.session.token,
        },
      }
    );

    // Verificando se a resposta foi bem-sucedida
    if (resp.data.status === "success" && resp.data.msg === "ok") {
      console.log("[ctlBairro.js|getDados] Dados recebidos com sucesso.");
      res.status(200).json({ status: "ok", registro: resp.data.regReturn });
  } else {
      console.error("[ctlBairro.js|getDados] Erro ao obter dados:", resp.data);
      res.status(404).json({ status: "error", message: "Dados do bairro não encontrados." });
  }
} catch (error) {
  console.log("[ctlBairro.js|getDados] Catch, Erro não identificado", error.response ? error.response.data : error.message);
  res.status(500).send("Erro ao processar a requisição para obter dados do bairro");
}
};

// Função para realizar a cadastrar um bairro
const InsertBairro = async (req, res) => {

  const token = req.session.token;
  console.log("[ctlBairro.js|InsertBairro]");

  try {
      if (req.method === "POST") {

      /* console.log("[ctlBairro.js|InsertBairro]IF"); */

      const regPost = validateForm(req.body);
      regPost.Bairroid = 0;

      console.log("[ctlBairro.js|InsertBairro] Dados a serem enviados:", regPost); // Log dos dados

      const resp = await axios.post(
        "http://localhost:20100/acl/bairro/v1/InsertBairro",
        regPost,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      if (resp.data.status === "success") {
        res.json({ status: "success", mensagem: "Bairro inserido com sucesso!" });
      } else {
        console.log("[ctlBairro.js|InsertBairro] Erro ao inserir bairro:", resp.data);
        res.json({ status: "erro", mensagem: "Erro ao inserir bairro!" });
      }
      
    }    
  }  catch (error) {
    console.log("[ctlBairro.js|InsertBairro] Erro não identificado", error.response ? error.response.data : error.message);
    res.status(500).send("Erro ao processar a requisição para inserir o bairro");
  }
};

// Função para realizar a atualização de um bairro
const UpdateBairro = async (req, res) => {

  token = req.session.token;
  console.log("[ctlBairro.js|UpdateBairro]");

  try {
    console.log("[ctlBairro.js|UpdateBairro]try");

    if (req.method === "POST") {

      console.log("[ctlBairro.js|UpdateBairro]if");

      const regPost = validateForm(req.body);
      const resp = await axios.post(
        "http://localhost:20100/acl/bairro/v1/UpdateBairro",
        regPost,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      res.json({
        status: resp.data.status,
        mensagem: resp.data.status === "ok" ? "Bairro atualizado com sucesso!" : "Erro ao atualizar bairro!",
      });
    }
  } catch (error) {
    console.log("[ctlBairro.js|UpdateBairro] Erro não identificado.");
    res.status(500).send("Erro ao processar a requisição para atualizar o bairro");
  }
};

// Função para realizar a remoção soft de um bairro
const deleteBairro = async (req, res) => {

  const token = req.session.token;
  console.log("[ctlBairro.js|deleteBairro]");
  try {
    if (req.method === "POST") {
      const regPost = validateForm(req.body);
      regPost.Bairroid = parseInt(regPost.Bairroid);
      const resp = await axios.post(
        process.env.SERVIDOR + "/DeleteBairro",
        { Bairroid: regPost.Bairroid },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      res.json({
        status: resp.data.status,
        mensagem: resp.data.status === "ok" ? "Bairro removido com sucesso!" : "Erro ao remover bairro!",
      });
    }
  } catch (error) {
    console.log("[ctlBairro.js|deleteBairro] Erro não identificado", error);
    res.status(500).send("Erro ao processar a requisição para remover o bairro");
  }
};

module.exports = {
  GetAllBairros,
  openBairroInsert,
  openBairroUpdate,
  getDados,
  InsertBairro,
  UpdateBairro,
  deleteBairro,
};
