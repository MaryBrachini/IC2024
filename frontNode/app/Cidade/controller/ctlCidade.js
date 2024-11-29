const axios = require("axios");

//@ Abre o formulário de manutenção de cidade
const GetAllCidade = async (req, res) => {

  console.log("[ctlCidade|GetAllCidade]");
  
  const token = req.session.token;
  const userName = req.session.userName;
  /* console.log("[ctlCidade|GetAllCidade] TOKEN:", token); */

  try {
    const resp = await axios.get('http://localhost:20100/acl/cidade/v1/GetAllCidades',     
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );

    let estado = await axios.get(
      "http://localhost:20100/acl/estado/v1/GetAllEstados",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );

     // Associando o nome do estado às cidade
     const cidadeestado = resp.data.regReturn.map(cidade => {
      // Encontrando o estado correspondente à cidade
      const estadoencontrado = estado.data.regReturn.find(b => b.Estadoid === cidade.EstadoIDFK);
      
      // Retornando a cidade com o nome do estado adicionado
      return {
        ...cidade,
        Nomeestado: estadoencontrado ? estadoencontrado.Nomeestado : "Estado não encontrado",
      };
    });

    console.log("[ctlCidade|GetAllCidade] Resposta de Cidades:", resp.data.regReturn);
    console.log("[ctlCidade|GetAllCidade] Resposta de Estados:", estado.data.regReturn);


  
  console.log("[ctlCidade|resp.data]", JSON.stringify(resp.data.regReturn));

    // Renderiza a página com os dados obtidos
    res.render("cidade/view_manutencao", {
      title: "Manutenção da Cidade",
      data: cidadeestado,
      userName: userName,
    });
  } catch (erro) {
    console.error('Erro ao buscar cidade:' );

    if (!res.headersSent) {
      res.status(500).json({ error: 'Erro ao buscar cidade' });
      console.log("Resposta de erro enviada");
    } else {
      console.log("Erro ao buscar cidade, mas a resposta já havia sido enviada");
    }
  }
};

//@ Função para validar campos no formulário
function validateForm(regFormPar) {

  if (regFormPar.datanascimento == "") {
    regFormPar.datanascimento = null;
  }

  return regFormPar;
}

//@ Abre e faz operações de CRUD no formulário de cadastro de cidade
const insertCidade = async (req, res) => {
  let oper = "";
  let registro = {};
  let resp = {}; // Inicializa resp para garantir que esteja definida
  let message = "";
  let messageType = "";

  console.log("[ctlCidade|insertCidade]Iniciando...");

  const userName = req.session.userName;
  const token = req.session.token;

  try {
      console.log("[ctlCidade|insertCidade]TRY");

      if (req.method == "GET") {
          oper = "c";

          console.log("[ctlCidade|insertCidade]IF");

          let estado = await axios.get(
              "http://localhost:20100/acl/estado/v1/GetAllEstados",
              {
                  headers: {
                      "Content-Type": "application/json",
                      Authorization: "Bearer " + token,
                  },
              }
          );

          console.log("[ctlCidade|insertCidade] Valor do estado.data:", estado.data);

          // Verifique se 'regReturn' está disponível na resposta
          if (estado.data && estado.data.regReturn) {
              registro = {
                  CidadeID: 0,
                  NomeCidade: "",
                  EstadoIDFK: "",
                  Removido: false,
              };

              return res.render("cidade/view_cadCidade", {
                  title: "Cadastro de cidade",
                  data: registro,
                  resp: estado.data.regReturn,
                  oper: oper,
                  userName: userName,
                  message: "",
                  messageType: ""
              });
          } else {
              throw new Error("O campo 'regReturn' não foi encontrado na resposta da API.");
          }
      } else {
          // Se a requisição for POST
          oper = "c";
          const cidadeREG = validateForm(req.body);

          console.log("[ctlCidade|insertCidade] req.body:", req.body);
          console.log("[ctlCidade|insertCidade] req.body.EstadoIDFK:", req.body.EstadoIDFK);

          // Validação para garantir que EstadoIDFK é um número válido
          if (!cidadeREG.EstadoIDFK || isNaN(cidadeREG.EstadoIDFK)) {
              throw new Error("EstadoIDFK inválido: o valor fornecido não é um número.");
          }

          const EstadoIDFKInt = parseInt(cidadeREG.EstadoIDFK, 10);

          // Tenta inserir a cidade
          resp = await axios.post(
              "http://localhost:20100/acl/cidade/v1/InsertCidade",
              {
                  CidadeID: 0,
                  NomeCidade: cidadeREG.NomeCidade,
                  EstadoIDFK: EstadoIDFKInt,
                  Removido: false,
              },
              {
                  headers: {
                      "Content-Type": "application/json",
                      Authorization: "Bearer " + token,
                  },
              }
          );

          console.log("[ctlCidade|insertCidade] resp:", resp.data);

          if (resp.data.status == "ok") {
              registro = {
                  CidadeID: 0,
                  NomeCidade: "",
                  EstadoIDFK: "",
                  Removido: false,
              };
              message = "Cidade cadastrada com sucesso!";
              messageType = "success";
          } else {
              message = "Cidade cadastrada com sucesso!";
              messageType = "error";
          }

          console.log("[ctlCidade|insertCidade]resp.data.status == ok", registro);

          let estado = await axios.get(
              "http://localhost:20100/acl/estado/v1/GetAllEstados",
              {
                  headers: {
                      "Content-Type": "application/json",
                      Authorization: "Bearer " + token,
                  },
              }
          );

          console.log("[ctlCidade|insertCidade]else v1/GetAllEstados");

          if (estado.data && estado.data.regReturn) {
              return res.render("cidade/view_cadCidade", {
                  title: "Cadastro de cidade",
                  data: registro,
                  resp: estado.data.regReturn,
                  oper: oper,
                  userName: userName,
                  message: message,
                  messageType: messageType
              });
          } else {
              throw new Error("O campo 'regReturn' não foi encontrado na resposta da API.");
          }
      }

      console.log("[ctlCidade|insertCidade]else fim");

      if (resp.data && resp.data.status === "success") {
          return res.json({ status: "success", mensagem: "Cidade inserida com sucesso!" });
      } else {
          console.log("[ctlCidade.js|insertCidade] Erro ao inserir Cidade:", resp.data);
          return res.json({ status: "erro", mensagem: "Erro ao inserir Cidade!" });
      }

  } catch (erro) {
      console.error("[ctlCidade|insertCidade]Erro não identificado", erro.response ? erro.response.data : erro.message);
      if (!res.headersSent) {
          res.status(500).send("Erro ao processar a requisição para inserir a cidade");
      }
  }
};


//@ Abre o formulário de cadastro de cidade para futura edição
const viewCidade = async (req, res) => {
  console.log("[ctlCidade|viewCidade]");

  let oper = "";
  let registro = {};
  const userName = req.session.userName;
  const token = req.session.token;

  console.log("[ctlCidade|req.session.userName]", req.session.userName);
  console.log("[ctlCidade|req.session.token]", req.session.token);

  try {
    console.log("[ctlCidade|viewCidade]Try");

    if (req.method === "GET") {
      console.log("[ctlCidade|viewCidade]GET");

      const id = parseInt(req.params.id, 10); // Convert to integer
      oper = req.params.oper;

      console.log("[ctlCidade|viewCidade] ID:", id);
      console.log("[ctlCidade|viewCidade] Oper:", oper);

      const resp = await axios.post(
        "http://localhost:20100/acl/cidade/v1/GetCidadeByID",
        { 
          CidadeID: id
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("[ctlCidade|viewCidade]GetCidadeByID:", resp.data);

      if (resp.data.status === "ok") {
        registro = resp.data.registro[0];
        console.log("[ctlCidade|viewCidade] Cidade data retrieved:", registro);
        res.render("cidade/view_cadCidade", {
          title: "Cadastro de cidade",
          data: registro,
          oper: oper,
          userName: userName,
        });
      } else {
        console.error("[ctlCidade|viewCidade] Error: Cidade not found");
        res.status(400).json({ status: "error", message: "Cidade não encontrada" });
      }

    } else {
      console.log("[ctlCidade|viewCidade]Else GET");

      oper = "vu";
      const cidadeREG = validateForm(req.body);
      const id = parseInt(cidadeREG.id, 10); // Converte em integer

      console.log("[ctlCidade|viewCidade] ID:", id);
      console.log("[ctlCidade|viewCidade] Cidade data to update:", cidadeREG);

      const resp = await axios.post(
        "http://localhost:20100/acl/cidade/v1/UpdateCidade",
        {
          CidadeID: id,
          NomeCidade: cidadeREG.NomeCidade,
          EstadoIDFK: cidadeREG.EstadoIDFK,
          Removido: false,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("[ctlCidade|viewCidade] Response from UpdateCidade:", resp.data);

      if (resp.data.status === "ok") {
        console.log("[ctlCidade|viewCidade] City successfully updated");
        res.json({ status: "ok" });
      } else {
        console.error("[ctlCidade|viewCidade] Error: Failed to update city");
        res.status(400).json({ status: "error", message: "Falha ao atualizar a cidade" });
      }
    }
  } catch (erro) {
    console.error("[ctlCidade.js|viewCidade] Error caught in try-catch block:", erro);
  }
};

//@ Deleta a cidade
const DeleteCidade = async (req, res) => {

  let oper = "";
  const userName = req.session.userName;
  const token = req.session.token;

  try {
    oper = "v";
    const id = parseInt(req.body.id);

    const resp = await axios.post(
      "http://localhost:20100/acl/cidade/v1/DeleteCidade",
      {
        CidadeID: id,
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
    console.log("[ctlCidade.js|DeleteCidade] Try Catch: Erro não identificado", erro);
  }
};

module.exports = {
  GetAllCidade,
  viewCidade,
  insertCidade,
  DeleteCidade
};
