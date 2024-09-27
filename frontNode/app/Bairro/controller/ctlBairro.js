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
const openBairroInsert = async (req, res) => {

  const userName = req.session.userName;
  console.log("[ctlBairro.js|openBairroInsert]");

  try {
    if (req.method === "GET") {
      res.render("bairro/view_cadBairro", {
        title: "Cadastro de bairro",
        oper: "c",
        userName: userName,
      });
      console.log("[ctlBairro.js|try]");
    }
  } catch (error) { 
    console.log("[ctlBairro.js|openBairroInsert] Erro não identificado", error);
  }
};

// Função para validar campos no formulário
const validateForm = (regFormPar) => {

  console.log("[ctlBairro.js|validateForm]");

  regFormPar.bairroid = regFormPar.bairroid ? parseInt(regFormPar.bairroid) : 0;
  regFormPar.removido = regFormPar.removido === "true";
  return regFormPar;
  };

// Função para abrir o formulário de atualização de bairro
const openBairroUpdate = async (req, res) => {

  const userName = req.session.userName;
  const id = parseInt(req.params.id, 10);

  console.log("[ctlBairro.js|openBairroUpdate] ID:", id);

  try {
      const bairro = await axios.post(process.env.SERVIDOR + "/acl/bairro/v1/GetBairrosByID",
         { 
          bairroid: id 
         },
          {
          headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + req.session.token,
          }
      });

      res.render("bairro/view_cadBairro", {
          title: "Atualizar Bairro",
          oper: "u",
          bairro: bairro.data,
          userName: userName
      });

  } catch (error) {
      console.log("[ctlBairro.js|openBairroUpdate] Erro:", error);
      res.status(500).send("Erro ao obter dados do bairro para atualização.");
  }
};


// Função para recuperar os dados do bairro e mostrar
const getDados = async (req, res) => {

  const idBusca = parseInt(req.body.idBusca, 10);
  console.log("[ctlBairro.js|getDados] valor id :", idBusca);

  try {
    console.log("[ctlBairro.js|getDados]Try");

    const resp = await axios.post(
      process.env.SERVIDOR + "/acl/bairro/v1/GetBairrosByID",
      { bairroid: idBusca },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + req.session.token,
        },
      }
    );

    res.json({
      status: resp.data.status,
      registro: resp.data.status === "ok" ? resp.data.registro[0] || {} : undefined,
      mensagem: resp.data.status !== "ok" ? "Erro ao obter dados do bairro." : undefined,
    });
  } catch (error) {
    console.log("[ctlBairro.js|getDados]Catch, Erro não identificado", error);
    res.status(500).send("Erro ao processar a requisição para obter dados do bairro");
  }
};

// Função para realizar a cadastrar um bairro
const insertBairro = async (req, res) => {

  const token = req.session.token;
  console.log("[ctlBairro.js|insertBairro]");

  try {
    if (req.method === "POST") {
      const regPost = validateForm(req.body);
      regPost.bairroid = 0;
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

      res.json({
        status: bairros.status,
        mensagem: bairros.status === "ok" ? "Bairro inserido com sucesso!" : "Erro ao inserir bairro!",
      });
    }
  } catch (error) {
    console.log("[ctlBairro.js|insertBairro] Erro não identificado", error);
    res.status(500).send("Erro ao processar a requisição para inserir o bairro");
  }
};

// Função para realizar a atualização de um bairro
const updateBairro = async (req, res) => {

  const token = req.session.token;
  console.log("[ctlBairro.js|updateBairro]");
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

      res.json({
        status: bairros.status,
        mensagem: bairros.status === "ok" ? "Bairro atualizado com sucesso!" : "Erro ao atualizar bairro!",
      });
    }
  } catch (error) {
    console.log("[ctlBairro.js|updateBairro] Erro não identificado.", error);
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
      regPost.bairroid = parseInt(regPost.bairroid);
      const resp = await axios.post(
        process.env.SERVIDOR + "/DeleteBairro",
        { bairroid: regPost.bairroid },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      res.json({
        status: bairros.status,
        mensagem: bairros.status === "ok" ? "Bairro removido com sucesso!" : "Erro ao remover bairro!",
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
  insertBairro,
  updateBairro,
  deleteBairro,
};
