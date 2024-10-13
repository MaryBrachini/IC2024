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
  
  console.log("[ctlCidade|resp.data]", JSON.stringify(resp.data.regReturn));

    // Renderiza a página com os dados obtidos
    res.render("cidade/view_manutencao", {
      title: "Manutenção da Cidade",
      data: resp.data.regReturn,
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

  const userName = req.session.userName;
  const token = req.session.token;

  try {

    console.log("[ctlCidade|insertCidade]TRY");

    if (req.method == "GET") {

    console.log("[ctlCidade|insertCidade]IF");

      oper = "c";
      const resp = await axios.get(
        "http://localhost:20100/acl/cidade/v1/InsertCidade",
        {}
      );

      registro = {
        CidadeID: 0,
        NomeCidade: "",
        EstadoIDFK: "",
        removido: false,
      };
      res.render("cidade/view_cadCidade", {
        title: "Cadastro de cidade",
        data: registro,
        resp: resp.data.registro,
        oper: oper,
        userName: userName,
      });
      console.log("[ctlCidade|insertCidade] Dados a serem enviados:", resp.data.registro);

    } else {

      oper = "c";
      const cidadeREG = validateForm(req.body);

      const resp = await axios.post(
       "http://localhost:20100/acl/cidade/v1/InsertCidade",
        {
          CidadeID: 0,
          NomeCidade: cidadeREG.NomeCidade,
          EstadoIDFK: cidadeREG.EstadoIDFK,
          removido: false,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      if (resp.data.status == "ok") {
        registro = {
          CidadeID: 0,
          NomeCidade: "",
          EstadoIDFK: "",
          removido: false,
        };
      } else {
        registro = cidadeREG;
      }

      resp = await axios.get(
        "http://localhost:20100/acl/cidade/v1/GetAllCidades",
        {}
      );

      oper = "c";
      res.render("cidade/view_cadCidade", {
        title: "Cadastro de cidade",
        data: registro,
        resp: resp.data.registro,
        oper: oper,
        userName: userName,
      });
    }
  } catch (erro) {
    console.log("[ctlCidade|insertCidade]Erro não identificado", error.response ? error.response.data : error.message);
    res.status(500).send("Erro ao processar a requisição para inserir o cidade");
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
          removido: false,
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
    res.status(500).json({ status: "error", message: "Cidade não pode ser alterada" });
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
