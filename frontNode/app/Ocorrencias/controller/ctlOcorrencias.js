const axios = require("axios");

//@ Abre o formulário de manutenção de Ocorrencias
const getAllOcorrencias = async (req, res) => {

  console.log("[getAllOcorrencias]");

  token = req.session.token
  userName = req.session.userName;
  /* console.log("[ctlOcorrencias|getAllOcorrencias] TOKEN:", token); */

  try {
    const resp = await axios.get(
      'http://localhost:20100/acl/ocorrencia/v1/GetAllOcorrencias',     
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );

    console.log("[ctlOcorrencias|resp.data]", JSON.stringify(resp.data.regReturn));

    // Renderiza a página com os dados obtidos
    res.render("Ocorrencias/view_manutencao", {
        title: "Manutenção das Ocorrências",
        data: resp.data.regReturn,
        userName: userName,
      });
   
      console.log("Resposta enviada com sucesso para ocorrencias");
      
    } catch (error) {
      console.error('Erro ao buscar ocorrencias:' );
  
      if (!res.headersSent) {
        res.status(500).json({ error: 'Erro ao buscar ocorrencias' });
        console.log("Resposta de erro enviada");
      } else {
        console.log("Erro ao buscar ocorrencias, mas a resposta já havia sido enviada");
      }
    }
  };

//@ Abre e faz operações de CRUD no formulário de cadastro de Ocorrencias
const insertOcorrencias = (req, res) =>
  (async () => {
    var oper = "";
    var registro = {};
    var Bairro = {};
    var logradouroLocalTrabalho = {};
    var logradouro = {};
    var epidemia = {};
    var unidBasicaSaude = {};
    userName = req.session.userName;
    token = req.session.token;
    try {
      if (req.method == "GET") {
        oper = "c";
        Bairro = await axios.get(
          process.env.SERVIDOR + "/GetAllBairros",{}
        );
        logradouroLocalTrabalho = await axios.get(
          process.env.SERVIDOR + "/GetAllLogradouroLocalTrabalho",{}
        );
        logradouro = await axios.get(
          process.env.SERVIDOR + "/GetAllLogradouro",{}
        );
        epidemia = await axios.get(
          process.env.SERVIDOR + "/GetAllEpidemia",{}
        );
        unidBasicaSaude = await axios.get(
          process.env.SERVIDOR + "/GetAllUnidBasicaSaude",{}
        );
        registro = {
          Ocorrenciaid: 0,
          NomeSuspeito: "",
          Datacadastro: "",
          Dataocorrencia: "",
          Numero: "",
          Latitude: "",
          Longitude: "",
          Localtrabalho: "",
          Numerolocaltrabalho: "",
          Latitudelocaltrabalho: "",
          Longitudelocaltrabalho: "",
          UnidBasicaSaudeIDFK: "",
          Bairroidfk: "",
          LogradourolocaltrabalhoIDFK: "",
          Logradouroidfk: "",
          EpidemiaIDfk: "",
          Removido: false,
        };
        res.render("Ocorrencias/view_cadOcorrencias", {
          title: "Cadastro da Unidade Básica de Saúde",
          data: registro,
          Bairro: Bairro.data.registro,
          logradouroLocalTrabalho: logradouroLocalTrabalho.data.registro,
          logradouro: logradouro.data.registro,
          epidemia: epidemia.data.registro,
          unidBasicaSaude: unidBasicaSaude.data.registro,
          oper: oper,
          userName: userName,
        });
      } else {
        oper = "c";
        const OcorrenciasREG = validateForm(req.body);
        resp = await axios.post(
          process.env.SERVIDOR + "/insertOcorrencias",
          {
            Ocorrenciaid: 0,
            NomeSuspeito: ubsREG.NomeSuspeito,
            Datacadastro: ubsREG.Datacadastro,
            Dataocorrencia: ubsREG.Dataocorrencia,
            Numero: ubsREG.Numero,
            Latitude: ubsREG.Latitude,
            Longitude: ubsREG.Longitude,
            Localtrabalho: ubsREG.Localtrabalho,
            Numerolocaltrabalho: ubsREG.Numerolocaltrabalho,
            Latitudelocaltrabalho: ubsREG.Latitudelocaltrabalho,
            Longitudelocaltrabalho: ubsREG.Longitudelocaltrabalho,
            UnidBasicaSaudeIDFK: ubsREG.UnidBasicaSaudeIDFK,
            Bairroidfk: ubsREG.Bairroidfk,
            LogradourolocaltrabalhoIDFK: ubsREG.LogradourolocaltrabalhoIDFK,
            Logradouroidfk: ubsREG.Logradouroidfk,
            EpidemiaIDfk: ubsREG.EpidemiaIDfk,
            UnidBasicaSaudeIDFK: ubsREG.UnidBasicaSaudeIDFK,
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
            Ocorrenciaid: 0,
            NomeSuspeito: "",
            Datacadastro: "",
            Dataocorrencia: "",
            Numero: "",
            Latitude: "",
            Longitude: "",
            Localtrabalho: "",
            Numerolocaltrabalho: "",
            Latitudelocaltrabalho: "",
            Longitudelocaltrabalho: "",
            UnidBasicaSaudeIDFK: "",
            Bairroidfk: "",
            LogradourolocaltrabalhoIDFK: "",
            Logradouroidfk: "",
            EpidemiaIDfk: "",
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
        res.render("Ocorrencias/view_cadOcorrencias", {
          title: "Cadastro da Unidade Básica de Saúde",
          data: registro,
          Bairro: Bairro.data.registro,
          logradouroLocalTrabalho: logradouroLocalTrabalho.data.registro,
          logradouro: logradouro.data.registro,
          epidemia: epidemia.data.registro,
          unidBasicaSaude: unidBasicaSaude.data.registro,
          oper: oper,
          userName: userName,
        });
      }
    } catch (erro) {
      console.log("[ctlOcorrencias.js|insertOcorrencias] Try Catch: Erro não identificado", erro);
    }
  })();

//@ Abre o formulário de cadastro de Ocorrencias para futura edição
const viewOcorrencias = (req, res) =>
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
          process.env.SERVIDOR + "/getOcorrenciasByID",
          {
            Ocorrenciaid: id,
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
          res.render("Ocorrencias/view_cadOcorrencias", {
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
          process.env.SERVIDOR + "/updateOcorrencias",
          {
            Ocorrenciaid: id,
            NomeSuspeito: ubsREG.NomeSuspeito,
            Datacadastro: ubsREG.Datacadastro,
            Dataocorrencia: ubsREG.Dataocorrencia,
            Numero: ubsREG.Numero,
            Latitude: ubsREG.Latitude,
            Longitude: ubsREG.Longitude,
            Localtrabalho: ubsREG.Localtrabalho,
            Numerolocaltrabalho: ubsREG.Numerolocaltrabalho,
            Latitudelocaltrabalho: ubsREG.Latitudelocaltrabalho,
            Longitudelocaltrabalho: ubsREG.Longitudelocaltrabalho,
            UnidBasicaSaudeIDFK: ubsREG.UnidBasicaSaudeIDFK,
            Bairroidfk: ubsREG.Bairroidfk,
            LogradourolocaltrabalhoIDFK: ubsREG.LogradourolocaltrabalhoIDFK,
            Logradouroidfk: ubsREG.Logradouroidfk,
            EpidemiaIDfk: ubsREG.EpidemiaIDfk,
            UnidBasicaSaudeIDFK: ubsREG.UnidBasicaSaudeIDFK,
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
      res.json({ status: "[ctlOcorrencias.js|viewOcorrencias] Ocorrencias não pode ser alterado" });
      console.log("[ctlOcorrencias.js|viewOcorrencias] Try Catch: Erro não identificado", erro);
    }
  })();

//@ Deleta a Ocorrencias
const DeleteOcorrencias = (req, res) =>
  (async () => {
    var oper = "";
    userName = req.session.userName;
    token = req.session.token;
    try {
      oper = "v";
      const id = parseInt(req.body.id);
    
      resp = await axios.post(
        process.env.SERVIDOR + "/DeleteOcorrencias",
        {
          Ocorrenciaid: id,
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
      console.log("[ctlOcorrencias.js|DeleteOcorrencias] Try Catch: Erro não identificado", erro);
    }
  })();

module.exports = {
  getAllOcorrencias,
  viewOcorrencias,
  insertOcorrencias,
  DeleteOcorrencias,
};
