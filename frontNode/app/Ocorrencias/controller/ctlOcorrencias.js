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
const insertOcorrencias = async (req, res) => {

  console.log("[ctlOcorrencias|insertOcorrencias] Iniciando...");

  var oper = "";
  let registro = {};

  const userName = req.session.userName;
  const token = req.session.token;

  try {
    console.log("[ctlOcorrencias|insertOcorrencias] try");

    if (req.method === "GET") {
      oper = "c";
      console.log("[ctlOcorrencias|insertOcorrencias] try if");

      // Obtendo todos os dados necessários
      let Bairro = await axios.get("http://localhost:20100/acl/bairro/v1/GetAllBairros", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      let logradouro = await axios.get("http://localhost:20100/acl/logradouro/v1/GetAllLogradouros", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      let epidemia = await axios.get("http://localhost:20100/acl/epidemia/v1/GetAllEpidemias", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      let unidBasicaSaude = await axios.get("http://localhost:20100/acl/ubs/v1/GetAllUBSs", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      console.log("[] Valor do Bairro.data:", Bairro.data);
      console.log("[] Valor do logradouro.data:", logradouro.data);
      console.log("[] Valor do epidemia.data:", epidemia.data);
      console.log("[] Valor do unidBasicaSaude.data:", unidBasicaSaude.data);

      // Verificações das respostas
      if (Bairro.data && Bairro.data.regReturn && 
          logradouro.data && logradouro.data.regReturn &&
          epidemia.data && epidemia.data.regReturn &&
          unidBasicaSaude.data && unidBasicaSaude.data.regReturn) {

        registro = {
          Ocorrenciaid: 0,
          NomeSuspeito: "",
          Datacadastro: "",
          Dataocorrencia: "",
          Numero: "",
          Localtrabalho: "",
          Numerolocaltrabalho: "",
          UnidBasicaSaudeIDFK: "",
          Bairroidfk: "",
          LogradourolocaltrabalhoIDFK: "",
          Logradouroidfk: "",
          EpidemiaIDfk: "",
          Removido: false,
        };

        console.log("[ctlOcorrencias|insertOcorrencias]registro:",registro);

        res.render("Ocorrencias/view_cadOcorrencias", {
          title: "Cadastro da Unidade Básica de Saúde",
          data: registro,
          Bairro: Bairro.data.regReturn,
          logradouro: logradouro.data.regReturn,
          epidemia: epidemia.data.regReturn,
          unidBasicaSaude: unidBasicaSaude.data.regReturn,
          oper: oper,
          userName: userName,
        });
      } else {
        throw new Error("O campo 'regReturn' não foi encontrado na resposta da API.");
      }

    } else {
      // Se a requisição for POST
      oper = "c";

      const OcorrenciasREG = validateForm(req.body);

      // Validações dos campos
      if (!OcorrenciasREG.Bairroidfk || isNaN(OcorrenciasREG.Bairroidfk)) {
        throw new Error("Bairroidfk inválido: o valor fornecido não é um número.");
      }
      if (!OcorrenciasREG.EpidemiaIDfk || isNaN(OcorrenciasREG.EpidemiaIDfk)) {
        throw new Error("EpidemiaIDfk inválido: o valor fornecido não é um número.");
      }
      if (!OcorrenciasREG.Logradouroidfk || isNaN(OcorrenciasREG.Logradouroidfk)) {
        throw new Error("Logradouroidfk inválido: o valor fornecido não é um número.");
      }
      if (!OcorrenciasREG.UnidBasicaSaudeIDFK || isNaN(OcorrenciasREG.UnidBasicaSaudeIDFK)) {
        throw new Error("UnidBasicaSaudeIDFK inválido: o valor fornecido não é um número.");
      }

      // Parseando os IDs
      const BairroidfkInt = parseInt(OcorrenciasREG.Bairroidfk, 10);
      const EpidemiaIDfkInt = parseInt(OcorrenciasREG.EpidemiaIDfk, 10);
      const LogradouroidfkInt = parseInt(OcorrenciasREG.Logradouroidfk, 10);
      const LogradouroidInt = parseInt(OcorrenciasREG.Logradouroidfk, 10);
      const UnidBasicaSaudeIDFKInt = parseInt(OcorrenciasREG.UnidBasicaSaudeIDFK, 10);

      // Inserindo a ocorrência
      const resp = await axios.post("http://localhost:20100/acl/ocorrencia/v1/InsertOcorrencia", {
        Ocorrenciaid: 0,
        NomeSuspeito: OcorrenciasREG.NomeSuspeito,
        Datacadastro: OcorrenciasREG.Datacadastro,
        Dataocorrencia: OcorrenciasREG.Dataocorrencia,
        Numero: OcorrenciasREG.Numero,
        Localtrabalho: OcorrenciasREG.Localtrabalho,
        Numerolocaltrabalho: OcorrenciasREG.Numerolocaltrabalho,
        UnidBasicaSaudeIDFK: UnidBasicaSaudeIDFKInt,
        Bairroidfk: BairroidfkInt,
        LogradourolocaltrabalhoIDFK: LogradouroidfkInt,
        Logradouroidfk: LogradouroidInt,
        EpidemiaIDfk: EpidemiaIDfkInt,
        Removido: false,
      }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      if (resp.data.status === "ok") {
        registro = {
          Ocorrenciaid: 0,
          NomeSuspeito: "",
          Datacadastro: "",
          Dataocorrencia: "",
          Numero: "",
          Localtrabalho: "",
          Numerolocaltrabalho: "",
          UnidBasicaSaudeIDFK: "",
          Bairroidfk: "",
          LogradourolocaltrabalhoIDFK: "",
          Logradouroidfk: "",
          EpidemiaIDfk: "",
          Removido: false,
        };
      } else {
        registro = OcorrenciasREG;
      }

      // Obtendo novamente os dados para renderizar a página
      Bairro = await axios.get("http://localhost:20100/acl/bairro/v1/GetAllBairros", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      logradouro = await axios.get("http://localhost:20100/acl/logradouro/v1/GetAllLogradouros", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      epidemia = await axios.get("http://localhost:20100/acl/epidemia/v1/GetAllEpidemias", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      unidBasicaSaude = await axios.get("http://localhost:20100/acl/ubs/v1/GetAllUBSs", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      res.render("Ocorrencias/view_cadOcorrencias", {
        title: "Cadastro da Unidade Básica de Saúde",
        data: registro,
        Bairro: Bairro.data.regReturn,
        logradouro: logradouro.data.regReturn,
        epidemia: epidemia.data.regReturn,
        unidBasicaSaude: unidBasicaSaude.data.regReturn,
        oper: oper,
        userName: userName,
      });
    }
  } catch (erro) {
    console.log("[ctlOcorrencias.js|insertOcorrencias] Erro não identificado", erro.response ? erro.response.data : erro.message, erro.config);
    res.status(500).send("Erro ao processar a requisição para inserir a ocorrência");
  }
};

//@ Função para validar campos no formulário
function validateForm(regFormPar) {

  return regFormPar;
}

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
            Localtrabalho: ubsREG.Localtrabalho,
            Numerolocaltrabalho: ubsREG.Numerolocaltrabalho,
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
