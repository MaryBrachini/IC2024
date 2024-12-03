const axios = require("axios");

//@ Abre o formulário de manutenção de logradouro
const getAllLogradouro = async (req, res) => {

  console.log("[ctlLogradouro|getAllLogradouro] iniciando...");

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

     // Associando o nome do cidade a logradouro
     const logradourocidade = resp.data.regReturn.map(logradouro => {
      // Encontrando o cidade correspondente à logradouro
      const cidadeencontrado = cidade.data.regReturn.find(
        (b) => Number(b.CidadeID) === Number(logradouro.CidadeIDFK)
    );
      
      // Retornando a logradouro com o nome do cidade adicionado
      return {
        ...logradouro,
        NomeCidade: cidadeencontrado ? cidadeencontrado.NomeCidade : "Estado não encontrado",
      };
    });
    
    console.log("[ctlCidade|getAllLogradouro] Resposta do resp.data:", resp.data);
    console.log("[ctlCidade|getAllLogradouro] Resposta do resp.data.regReturn:", resp.data.regReturn);
    /* console.log("[ctlCidade|getAllLogradouro] Resposta de Cidades:", cidade.data.regReturn); */

    /* console.log("[ctlLogradourogetAllLogradouro] resp.data:", JSON.stringify(resp.data)); */

    console.log("[ctlLogradouro|getAllLogradouro] logradourocidade",logradourocidade);

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
  var cidade; // Declare a variável `cidade` aqui para usá-la em todo o bloco

  console.log("[ctlLogradouro|insertLogradouro] Iniciando...");

  const userName = req.session.userName;
  const token = req.session.token;

  try {
    console.log("[ctlLogradouro|insertLogradouro] TRY"); 

    if (req.method == "GET") {
      oper = "c";

      console.log("[ctlLogradouro|insertLogradouro] TRY IF");

      // Solicita os dados de cidade
      cidade = await axios.get(
        "http://localhost:20100/acl/cidade/v1/GetAllCidades",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      console.log("[ctlLogradouro|insertLogradouro] cidade.data:", cidade.data);

      if (cidade.data && cidade.data.regReturn && Array.isArray(cidade.data.regReturn)) {
        registro = {
          Logradouroid: 0,
          Nomelogradouro: "",
          CidadeIDFK: "",
          Removido: false,
        };

        // Renderiza a página com os dados da cidade
        return res.render("logradouro/view_cadLogradouro", {
          title: "Cadastro de logradouro",
          data: registro,
          resp: cidade.data.regReturn,
          oper: oper,
          userName: userName,
        });
      } else {
        // Caso não tenha cidades disponíveis
        return res.render("logradouro/view_cadLogradouro", {
          title: "Cadastro de logradouro",
          data: registro,
          resp: [],
          oper: oper,
          userName: userName,
          message: "Nenhuma cidade disponível",
          messageType: "error",
        });
      }

    } else {
      // Se a requisição for POST
      oper = "c";
      const logradouroREG = validateForm(req.body);

      console.log("[ctlLogradouro|insertLogradouro] req.body:", req.body);
      console.log("[ctlLogradouro|insertLogradouro] logradouroREG:", logradouroREG);
      console.log("[ctlLogradouro|insertLogradouro] req.body.CidadeIDFK:", req.body.CidadeIDFK);

      // Validação para garantir que CidadeIDFK é um número válido
      if (!logradouroREG.CidadeIDFK || isNaN(logradouroREG.CidadeIDFK)) {
        throw new Error("CidadeIDFK inválido: o valor fornecido não é um número.");
      }

      const cidadeIDFKInt = parseInt(logradouroREG.CidadeIDFK, 10);

      // Tenta inserir o logradouro
      const resp = await axios.post(
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

      // Requisição novamente para a cidade após o POST
      cidade = await axios.get(
        "http://localhost:20100/acl/cidade/v1/GetAllCidades",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      if (cidade.data && cidade.data.regReturn && Array.isArray(cidade.data.regReturn)) {
        return res.render("logradouro/view_cadLogradouro", {
          title: "Cadastro de logradouro",
          data: registro,
          resp: cidade.data.regReturn,
          oper: oper,
          userName: userName,
          message: "Logradouro cadastrado com sucesso!",
          messageType: "success",
        });
      } else {
        return res.render("logradouro/view_cadLogradouro", {
          title: "Cadastro de logradouro",
          data: registro,
          resp: [],
          oper: oper,
          userName: userName,
          message: "Nenhuma cidade disponível",
          messageType: "error",
        });
      }
    }

  } catch (erro) {
    console.log("[ctlLogradouro|insertLogradouro] Erro não identificado", erro.response ? erro.response.data : erro.message);

    // Certifique-se de que uma única resposta está sendo enviada
    if (!res.headersSent) {
      res.status(500).send("Erro ao processar a requisição para inserir o logradouro");
    }
  }
};




//@ Abre o formulário de cadastro de logradouro para futura edição
const viewLogradouro = async (req, res) => {
  console.log("[ctlLogradouro|viewLogradouro]");

  let oper = "";
  let registro = {};
  const  userName = req.session.userName;
  const  token = req.session.token;

    try {
      console.log("[ctlLogradouro|viewLogradouro] Try");

      if (req.method == "GET") {
        console.log("[ctlLogradouro|viewLogradouro] GET");

        const id = parseInt(req.params.id, 10);
        oper = req.params.oper;

        const resp = await axios.post(
          "http://localhost:20100/acl/logradouro/v1/GetLogradouroByID",
          {
            Logradouroid: id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("[ctlLogradouro|viewLogradouro] GetLogradouroByID:", resp.data);

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
        console.log("[ctlLogradouro|viewLogradouro] Else GET");

        oper = "vu";
        const logradouroREG = validateForm(req.body);
        const id = parseInt(cidadeREG.id, 10);

        console.log("[ctlLogradouro|viewLogradouro] ID:", id);
        console.log("[ctlLogradouro|viewLogradouro] logradouro data to update:", logradouroREG);

        const resp = await axios.post(
          "http://localhost:20100/acl/logradouro/v1/UpdateLogradouro",
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
  };

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
