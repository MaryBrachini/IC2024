const axios = require("axios");

//@ Abre o formulário de manutenção de UBS
const getAllUBS = async (req, res) => {

  console.log("[ctlUBS|getAllUBS]");

  const token = req.session.token;
  const userName = req.session.userName;
  /* console.log("[ctlUBS|getAllUBS] TOKEN:", token); */

  try {
    const resp = await axios.get(
      'http://localhost:20100/acl/ubs/v1/GetAllUBSs',     
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );

    console.log("[ctlUBS|resp.data]", JSON.stringify(resp.data.regReturn));

    // Renderiza a página com os dados obtidos
    res.render("UBS/view_manutencao", {
        title: "Manutenção da Unidade Básica de Saúde",
        data: resp.data.regReturn,
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

    var oper = "";
    var registro = {};
    var Bairro = {};
    userName = req.session.userName;
    token = req.session.token;

    if (!token) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    try {
      if (req.method == "GET") {
        oper = "c";
        Bairro = await axios.get(
          "http://localhost:20100/acl/ubs/v1/GetAllUBSs",
          {}
        );
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
          Bairro: Bairro.data.registro,
          oper: oper,
          userName: userName,
        });
      } else {
        oper = "c";
        const ubsREG = validateForm(req.body);
        resp = await axios.post(
          process.env.SERVIDOR + "/insertUBS",
          {
            UnidBasicaSaudeID: 0,
            NomeUBS: ubsREG.NomeUBS,
            CodigoUBS: ubsREG.CodigoUBS,
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
          registro = {
            UnidBasicaSaudeID: 0,
            NomeUBS: "",
            CodigoUBS:"",
            BairroIDFK: "",
            Removido: false,
          };
        } else {
          registro = ubsREG;
        }
        Bairro = await axios.get(
          process.env.SERVIDOR + "/GetAllBairros",
          {}
        );
        oper = "c";
        res.render("UBS/view_cadUBS", {
          title: "Cadastro da Unidade Básica de Saúde",
          data: registro,
          Bairro: Bairro.data.registro,
          oper: oper,
          userName: userName,
        });
      }
    } catch (erro) {
      console.log("[ctlUBS.js|insertUBS] Try Catch: Erro não identificado", erro);
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
