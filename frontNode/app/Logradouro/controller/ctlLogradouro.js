const axios = require("axios");

//@ Abre o formulário de manutenção de logradouro
const getAllLogradouro = async (req, res) => {

  console.log("getAllLogradouro");

  const token = req.session.token;
  const userName = req.session.userName;
  /* console.log("[ctlLogradouro|getAllLogradouro] TOKEN:", token); */
  
  try {
    console.log("[ctlLogradouro|getAllLogradouro]TRY");

    const resp = await axios.get(
      'http://localhost:20100/acl/logradouro/v1/GetAllLogradouros',     
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );

    const cidade = await axios.get(
      "http://localhost:20100/acl/cidade/v1/GetAllCidades",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );

     // Associando o nome do estadcidadeo às logradouro
     const logradourocidade = resp.data.regReturn.map(logradouro => {
      // Encontrando o cidade correspondente à logradouro
      const cidadeencontrado = cidade.data.regReturn.find(b => b.CidadeID === logradouro.CidadeIDFK);
      
      // Retornando a logradouro com o nome do cidade adicionado
      return {
        ...logradouro,
        NomeCidade: cidadeencontrado ? cidadeencontrado.NomeCidade : "Estado não encontrado",
      };
    });

    console.log("[ctlCidade|GetAllCidade] Resposta de Cidades:", resp.data.regReturn);
    console.log("[ctlCidade|GetAllCidade] Resposta de Estados:", cidade.data.regReturn);

    console.log("[ctlLogradouro|resp.data]", JSON.stringify(resp.data));

    // Renderiza a página com os dados obtidos
    res.render("logradouro/view_manutencao", {
        title: "Manutenção do Logradouro",
        data: logradourocidade,
        userName: userName,
      });
   
      console.log("Resposta enviada com sucesso para logradouro");
      
    } catch (error) {
      console.error('Erro ao buscar logradouro:');
  
      if (!res.headersSent) {
        res.status(500).json({ error: 'Erro ao buscar logradouro' });
        console.log("Resposta de erro enviada");
      } else {
        console.log("Erro ao buscar logradouro, mas a resposta já havia sido enviada");
      }
    }
  };

//@ Função para validar campos no formulário
function validateForm(regFormPar) {  

  console.log("[ctlLogradouro.js|validateForm]");

  regFormPar.Logradouroid = regFormPar.Logradouroid ? parseInt(regFormPar.Logradouroid) : 0;
  regFormPar.Removido = regFormPar.Removido === "true";
  return regFormPar;
}

//@ Abre e faz operações de CRUD no formulário de cadastro de logradouro
const insertLogradouro = async (req, res) => {

  var oper = "";
  var registro = {};

  console.log("[ctlLogradouro|insertLogradouro] Iniciando...");

  const userName = req.session.userName;
  const token = req.session.token;

/* console.log("ctlLogradouro|insertLogradouro] TOKEN:", token); */

  try {

    console.log("ctlLogradouro|insertLogradouro] TRY"); 

    if (req.method == "GET") {
      oper = "c";

      console.log("ctlLogradouro|insertLogradouro]TRY IF");

      const cidade = await axios.get(
        "http://localhost:20100/acl/cidade/v1/GetAllCidades",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      console.log("[ctlLogradouro|insertLogradouro] cidade.data:", cidade.data);

      if (cidade.data && cidade.data.regReturn) {
        registro = {
          Logradouroid: 0,
          Nomelogradouro: "",
          CidadeIDFK: "",
          Removido: false,
        };

        res.render("logradouro/view_cadLogradouro", {
          title: "Cadastro de logradouro",
          data: registro,
          resp: cidade.data.regReturn,
          oper: oper,
          userName: userName,
        });
      } else {
        throw new Error("O campo 'regReturn' não foi encontrado na resposta da API.");
      }

    } else {
      // Se a requisição for POST
      oper = "c";
      const logradouroREG = validateForm(req.body);

      console.log("[ctlLogradouro|insertLogradouro] req.body:", req.body);
      console.log("[ctlLogradouro|insertLogradouro] req.body.CidadeIDFK:", req.body.CidadeIDFK);

      // Validação para garantir que CidadeIDFK é um número válido
      if (!logradouroREG.CidadeIDFK || isNaN(logradouroREG.CidadeIDFK)) {
        throw new Error("CidadeIDFK inválido: o valor fornecido não é um número.");
      }

      const cidadeIDFKInt = parseInt(logradouroREG.CidadeIDFK, 10);

      // Tenta inserir o logradouro
      resp = await axios.post(
        "http://localhost:20100/acl/logradouro/v1/InsertLogradouro",
        {
          Logradouroid: 0,
          Nomelogradouro: logradouroREG.Nomelogradouro,
          CidadeIDFK: cidadeIDFKInt,
          Removido: false,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      console.log("[ctlLogradouro|insertLogradouro] resp:", resp.data);

      if (resp.data.status === "ok") {
        console.log("Logradouro cadastrado com sucesso.");
        registro = {
          Logradouroid: 0,
          Nomelogradouro: "",
          CidadeIDFK: "",
          Removido: false,
        };
      } else {
        registro = logradouroREG;
      }

      const cidade = await axios.get(
        "http://localhost:20100/acl/cidade/v1/GetAllCidades",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      console.log("[ctlCidade|insertCidade]else v1/GetAllCidades");


      if (cidade.data && cidade.data.regReturn) {
        res.render("logradouro/view_cadLogradouro", {
          title: "Cadastro de logradouro",
          data: registro,
          resp: cidade.data.regReturn,
          oper: oper,
          userName: userName,
          message: "Logradouro cadastrado com sucesso!",
          messageType: "success",
        });
      } else {
        throw new Error("O campo 'regReturn' não foi encontrado na resposta da API.");
      }
    }
  } catch (erro) {
    console.log("[ctlLogradouro|insertLogradouro] Erro não identificado", erro.response ? erro.response.data : erro.message);
    res.status(500).send("Erro ao processar a requisição para inserir o logradouro");
  }
};

//@ Abre o formulário de cadastro de logradouro para futura edição
const viewLogradouro = (req, res) =>
  (async () => {
    var oper = "";
    var registro = {};
    userName = req.session.userName;
    token = req.session.token;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        oper = req.params.oper;
        parseInt(id);
        resp = await axios.post(
          process.env.SERVIDOR + "/getLogradouroByID",
          {
            Logradouroid: id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (resp.data.status == "ok") {
          registro = resp.data.registro[0];
          res.render("logradouro/view_cadLogradouro", {
            title: "Cadastro de logradouro",
            data: registro,
            oper: oper,
            userName: userName,
          });
        }
      } else {
        oper = "vu";
        const logradouroREG = validateForm(req.body);
        const id = parseInt(logradouroREG.id);
        resp = await axios.post(
          process.env.SERVIDOR + "/updateLogradouro",
          {
            Logradouroid: id,
            Nomelogradouro: logradouroREG.Nomelogradouro,
            CidadeIDFK: logradouroREG.CidadeIDFK,
            Removido: false,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (resp.data.status == "ok") {
          res.json({ status: "ok" });
        } else {
          res.json({ status: "erro" });
        }
      }
    } catch (erro) {
      res.json({ status: "[ctlLogradouro.js|viewLogradouro] Logradouro não pode ser alterado" });
      console.log("[ctlLogradouro.js|viewLogradouro] Try Catch: Erro não identificado", erro);
    }
  })();

//@ Deleta a logradouro
const DeleteLogradouro = (req, res) =>
  (async () => {
    var oper = "";
    userName = req.session.userName;
    token = req.session.token;
    try {
      oper = "v";
      const id = parseInt(req.body.id);
    
      resp = await axios.post(
        process.env.SERVIDOR + "/DeleteLogradouro",
        {
          Logradouroid: id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      if (resp.data.status == "ok") {
        res.json({ status: "ok" });
      } else {
        res.json({ status: "erro" });
      }
    } catch (erro) {
      console.log("[ctlLogradouro.js|DeleteLogradouro] Try Catch: Erro não identificado", erro);
    }
  })();

module.exports = {
  getAllLogradouro,
  viewLogradouro,
  insertLogradouro,
  DeleteLogradouro,
};
