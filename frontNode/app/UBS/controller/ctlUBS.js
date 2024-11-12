const axios = require("axios");

//@ Abre o formulário de manutenção de UBS
const getAllUBS = async (req, res) => {
  console.log("[ctlUBS|getAllUBS]");

  const token = req.session.token;
  const userName = req.session.userName;

  try {
    // Obtendo as UBS
    const resp = await axios.get(
      'http://localhost:20100/acl/ubs/v1/GetAllUBSs',     
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );

    // Obtendo os bairros
    let bairro = await axios.get(
      "http://localhost:20100/acl/bairro/v1/GetAllBairros",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );

    // Associando o nome do bairro às UBS
    const ubsComBairro = resp.data.regReturn.map(ubs => {
      // Encontrando o bairro correspondente à UBS
      const bairroEncontrado = bairro.data.regReturn.find(b => b.Bairroid === ubs.BairroIDFK);
      
      // Retornando a UBS com o nome do bairro adicionado
      return {
        ...ubs,
        Nomebairro: bairroEncontrado ? bairroEncontrado.Nomebairro : "Bairro não encontrado",
      };
    });

    // Renderizando a página com os dados
    res.render("UBS/view_manutencao", {
      title: "Manutenção da Unidade Básica de Saúde",
      data: ubsComBairro,
      userName: userName,
    });
   
    console.log("Resposta enviada com sucesso para UBS");
      
  } catch (error) {
    console.error('Erro ao buscar UBS:' );
  
    if (!res.headersSent) {
      res.status(500).json({ error: 'Erro ao buscar UBS' });
      console.log("Resposta de erro enviada");
    } else {
      console.log("Erro ao buscar UBS, mas a resposta já havia sido enviada");
    }
  }
};


//@ Abre e faz operações de CRUD no formulário de cadastro de UBS
const insertUBS = async (req, res) => {

  let oper = "";
  let registro = {};

  console.log("[ctlUBS.js|insertUBS] Iniciando...");

  const userName = req.session.userName;
  const token = req.session.token;

  try {
      console.log("[ctlUBS.js|insertUBS] TRY");

      if (req.method === "GET") {
          oper = "c";

          let bairro = await axios.get(
              "http://localhost:20100/acl/bairro/v1/GetAllBairros",
              {
                  headers: {
                      "Content-Type": "application/json",
                      Authorization: "Bearer " + token,
                  },
              }
          );

          console.log("[ctlCidade|insertCidade] Valor do bairro.data:", bairro.data);

           // Verifique se 'regReturn' está disponível na resposta
          if (bairro.data && bairro.data.regReturn) {
              registro = {
                  UnidBasicaSaudeID: 0,
                  NomeUBS: "",
                  CodigoUBS: "",
                  BairroIDFK: "",
                  Removido: false,
              };

              res.render("UBS/view_cadUBS", {
                  title: "Cadastro da Unidade Básica de Saúde",
                  data: registro,
                  Bairro: bairro.data.regReturn,
                  oper: oper,
                  userName: userName,
              });
          } else {
              throw new Error("O campo 'regReturn' não foi encontrado na resposta da API.");
          }

      } else {
        // Se a requisição for POST

          oper = "c";
          /* const ubsREG = validateForm(req.body); */
          const ubsREG = req.body;

          console.log("[ctlUBS.js|insertUBS] req.body:", ubsREG);
          console.log("[ctlUBS.js|insertUBS] req.body.BairroIDFK:", req.body.BairroIDFK);

          if (!ubsREG.BairroIDFK || isNaN(ubsREG.BairroIDFK)) {
              throw new Error("BairroIDFK inválido: o valor fornecido não é um número.");
          }

          const BairroIDFKInt = parseInt(ubsREG.BairroIDFK, 10);

          // Tenta inserir a cidade
          const resp = await axios.post(
              "http://localhost:20100/acl/ubs/v1/InsertUBS",
              {
                  UnidBasicaSaudeID: 0,
                  NomeUBS: ubsREG.NomeUBS,
                  CodigoUBS: ubsREG.CodigoUBS,
                  BairroIDFK: BairroIDFKInt,
                  Removido: false,
              },
              {
                  headers: {
                      "Content-Type": "application/json",
                      Authorization: "Bearer " + token,
                  },
              }
          );

          console.log("[ctlUBS.js|insertUBS] resp:", resp.data);

          if (resp.data.status == "ok") {
          registro = {
              UnidBasicaSaudeID: 0,
              NomeUBS: "",
              CodigoUBS: "",
              BairroIDFK: "",
              Removido: false,
            };
          } else { 
            ubsREG;
          }

          console.log("[ctlUBS.js|insertUBS] resp.data.status == ok", registro);

          let bairro = await axios.get(
              "http://localhost:20100/acl/bairro/v1/GetAllBairros",
              {
                  headers: {
                      "Content-Type": "application/json",
                      Authorization: "Bearer " + token,
                  },
              }
          );

          console.log("[ctlUBS.js|insertUBS]else v1/GetAllEstados");

          if (bairro.data && bairro.data.regReturn) {
              res.render("UBS/view_cadUBS", {
                  title: "Cadastro da Unidade Básica de Saúde",
                  data: registro,
                  Bairro: bairro.data.regReturn,
                  oper: oper,
                  userName: userName,
              });
          } else {
              throw new Error("O campo 'regReturn' não foi encontrado na resposta da API.");
          }
      }

      console.log("[ctlUBS.js|insertUBS] Finalizado com sucesso");

  } catch (erro) {
      console.error("[ctlUBS.js|insertUBS] Erro não identificado", erro.response ? erro.response.data : erro.message);
      res.status(500).send("Erro ao processar a requisição para inserir o UBS");
  }
};


//@ Abre o formulário de cadastro de UBS para futura edição
const viewUBS = (req, res) =>
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
          process.env.SERVIDOR + "/getUBSByID",
          {
            UnidBasicaSaudeID: id,
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
          res.render("UBS/view_cadUBS", {
            title: "Cadastro da Unidade Básica de Saúde",
            data: registro,
            oper: oper,
            userName: userName,
          });
        }
      } else {
        oper = "vu";
        const ubsREG = validateForm(req.body);
        const id = parseInt(ubsREG.id);
        resp = await axios.post(
          process.env.SERVIDOR + "/updateUBS",
          {
            UnidBasicaSaudeID: id,
            NomeUBS: ubsREG.NomeUBS,
            CodigoUBS:ubsREG.CodigoUBS,
            BairroIDFK: ubsREG.BairroIDFK,
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
      res.json({ status: "[ctlUBS.js|viewUBS] UBS não pode ser alterado" });
      console.log("[ctlUBS.js|viewUBS] Try Catch: Erro não identificado", erro);
    }
  })();

//@ Deleta a UBS
const DeleteUBS = (req, res) =>
  (async () => {
    var oper = "";
    userName = req.session.userName;
    token = req.session.token;
    try {
      oper = "v";
      const id = parseInt(req.body.id);
    
      resp = await axios.post(
        process.env.SERVIDOR + "/DeleteUBS",
        {
          UnidBasicaSaudeID: id,
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
      console.log("[ctlUBS.js|DeleteUBS] Try Catch: Erro não identificado", erro);
    }
  })();

module.exports = {
  getAllUBS,
  viewUBS,
  insertUBS,
  DeleteUBS,
};
