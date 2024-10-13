const axios = require("axios");

//@ Abre o formulário de manutenção de logradouro
const getAllLogradouro = async (req, res) => {

  console.log("getAllLogradouro");

  const token = req.session.token
  /* console.log("[ctlLogradouro|getAllLogradouro] TOKEN:", token); */
  const userName = req.session.userName;

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

    console.log("[ctlLogradouro|resp.data]", JSON.stringify(resp.data.regReturn));

    // Renderiza a página com os dados obtidos
    res.render("logradouro/view_manutencao", {
        title: "Manutenção do Logradouro",
        data: resp.data.regReturn,
        userName: userName,
      });
   
      console.log("Resposta enviada com sucesso para logradouro");
      
    } catch (error) {
      console.error('Erro ao buscar logradouro:' );  //, error);
  
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
  regFormPar.removido = regFormPar.removido === "true";
  return regFormPar;
}

//@ Abre e faz operações de CRUD no formulário de cadastro de logradouro
const insertLogradouro = (req, res) =>
  (async () => {
    var oper = "";
    var registro = {};
    var Cidade = {};
    userName = req.session.userName;
    token = req.session.token;
    try {
      if (req.method == "GET") {
        oper = "c";
        Cidade = await axios.get(
          process.env.SERVIDOR + "/GetAllCidade",
          {}
        );
        registro = {
          Logradouroid: 0,
          Nomelogradouro: "",
          CidadeIDFK: "",
          removido: false,
        };
        res.render("logradouro/view_cadLogradouro", {
          title: "Cadastro de logradouro",
          data: registro,
          Cidade: Cidade.data.registro,
          oper: oper,
          userName: userName,
        });
      } else {
        oper = "c";
        const logradouroREG = validateForm(req.body);
        resp = await axios.post(
          process.env.SERVIDOR + "/insertLogradouro",
          {
            Logradouroid: 0,
            Nomelogradouro: logradouroREG.Nomelogradouro,
            CidadeIDFK: logradouroREG.CidadeIDFK,
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
            Logradouroid: 0,
            Nomelogradouro: "",
            CidadeIDFK: "",
            removido: false,
          };
        } else {
          registro = logradouroREG;
        }
        Cidade = await axios.get(
          process.env.SERVIDOR + "/GetAllCidade",
          {}
        );
        oper = "c";
        res.render("logradouro/view_cadLogradouro", {
          title: "Cadastro de logradouro",
          data: registro,
          Cidade: Cidade.data.registro,
          oper: oper,
          userName: userName,
        });
      }
    } catch (erro) {
      console.log("[ctlLogradouro.js|insertLogradouro] Try Catch: Erro não identificado", erro);
    }
  })();

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
