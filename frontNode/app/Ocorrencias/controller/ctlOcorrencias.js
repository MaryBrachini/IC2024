const axios = require("axios");

//@ Abre o formulário de manutenção de Ocorrencias
const getAllOcorrencias = async (req, res) => {
  console.log("[getAllOcorrencias]");

  const token = req.session.token;
  const userName = req.session.userName;

  try {
      // Obtendo todas as ocorrências
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

      // Obtendo os dados relacionados
      const bairro = await axios.get(
          "http://localhost:20100/acl/bairro/v1/GetAllBairros",
          {
              headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + token,
              },
          }
      );

      const logradouro = await axios.get(
          "http://localhost:20100/acl/logradouro/v1/GetAllLogradouros",
          {
              headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + token,
              },
          }
      );

      const epidemia = await axios.get(
          "http://localhost:20100/acl/epidemia/v1/GetAllEpidemias",
          {
              headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + token,
              },
          }
      );

      const unidBasicaSaude = await axios.get(
          "http://localhost:20100/acl/ubs/v1/GetAllUBSs",
          {
              headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + token,
              },
          }
      );

      console.log("[ctlOcorrencias|bairro.data]", JSON.stringify(bairro.data.regReturn));
      console.log("[ctlOcorrencias|logradouro.data]", JSON.stringify(logradouro.data.regReturn));
      console.log("[ctlOcorrencias|epidemia.data]", JSON.stringify(epidemia.data.regReturn));
      console.log("[ctlOcorrencias|unidBasicaSaude.data]", JSON.stringify(unidBasicaSaude.data.regReturn));

      // Associando os nomes aos IDs nas ocorrências
      const ocorrenciasComNomes = resp.data.regReturn.map(ocorrencia => {
          const bairroEncontrado = bairro.data.regReturn.find(b => b.Bairroid === ocorrencia.Bairroidfk);
          const logradouroEncontrado = logradouro.data.regReturn.find(l => l.Logradouroid === ocorrencia.Logradouroidfk);
          const epidemiaEncontrada = epidemia.data.regReturn.find(e => e.Epidemiaid === ocorrencia.Epidemiaidfk);
          const ubsEncontrada = unidBasicaSaude.data.regReturn.find(u => u.UnidBasicaSaudeID === ocorrencia.UnidBasicaSaudeIDFK);

          console.log(`OcorrenciaID: ${ocorrencia.Ocorrenciaid}, BairroID: ${ocorrencia.Bairroidfk}, Bairro: ${bairroEncontrado ? bairroEncontrado.Nomebairro : "Bairro não encontrado"}`);
          console.log(`OcorrenciaID: ${ocorrencia.Ocorrenciaid}, LogradouroID: ${ocorrencia.Logradouroidfk}, Logradouro: ${logradouroEncontrado ? logradouroEncontrado.Nomelogradouro : "Logradouro não encontrado"}`);
          console.log(`OcorrenciaID: ${ocorrencia.Ocorrenciaid}, EpidemiaID: ${ocorrencia.Epidemiaidfk}, Epidemia: ${epidemiaEncontrada ? epidemiaEncontrada.Nomeepidemia : "Epidemia não encontrada"}`);
          console.log(`OcorrenciaID: ${ocorrencia.Ocorrenciaid}, UBSID: ${ocorrencia.UnidBasicaSaudeIDFK}, UBS: ${ubsEncontrada ? ubsEncontrada.NomeUBS : "UBS não encontrada"}`);

          return {
              ...ocorrencia,
              NomeBairro: bairroEncontrado ? bairroEncontrado.Nomebairro : "Bairro não encontrado",
              NomeLogradouro: logradouroEncontrado ? logradouroEncontrado.Nomelogradouro : "Logradouro não encontrado",
              NomeEpidemia: epidemiaEncontrada ? epidemiaEncontrada.Nomeepidemia : "Epidemia não encontrada",
              NomeUBS: ubsEncontrada ? ubsEncontrada.NomeUBS : "UBS não encontrada",
          };
      });

      // Renderiza a página com os dados obtidos
      res.render("Ocorrencias/view_manutencao", {
          title: "Manutenção das Ocorrências",
          data: ocorrenciasComNomes,
          userName: userName,
      });

      console.log("Resposta enviada com sucesso para ocorrencias");

  } catch (error) {
      console.error('Erro ao buscar ocorrencias:', error);

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

  let oper = "";
  let registro = {};
  let message = "";
  let messageType = "";

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

         /*  console.log("[] Valor do Bairro.data:", Bairro.data);
          console.log("[] Valor do logradouro.data:", logradouro.data);
          console.log("[] Valor do epidemia.data:", epidemia.data);
          console.log("[] Valor do unidBasicaSaude.data:", unidBasicaSaude.data); */

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
                  Epidemiaidfk: "",
                  Removido: false,
              };

              console.log("[ctlOcorrencias|insertOcorrencias]registro:", registro);

              return res.render("Ocorrencias/view_cadOcorrencias", {
                  title: "Cadastro da Unidade Básica de Saúde",
                  data: registro,
                  Bairro: Bairro.data.regReturn,
                  logradouro: logradouro.data.regReturn,
                  epidemia: epidemia.data.regReturn,
                  unidBasicaSaude: unidBasicaSaude.data.regReturn,
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

          const OcorrenciasREG = validateForm(req.body);

          console.log("[ctlOcorrencias|insertOcorrencias] req.body:", req.body);

          // Validações dos campos
          if (!OcorrenciasREG.Bairroidfk || isNaN(OcorrenciasREG.Bairroidfk)) {
              throw new Error("Bairroidfk inválido: o valor fornecido não é um número.");
          }
          if (!OcorrenciasREG.Epidemiaidfk || isNaN(OcorrenciasREG.Epidemiaidfk)) {
              throw new Error("Epidemiaidfk inválido: o valor fornecido não é um número.");
          }
          if (!OcorrenciasREG.logradouroidfk || isNaN(OcorrenciasREG.logradouroidfk)) {
              throw new Error("Logradouroidfk inválido: o valor fornecido não é um número.");
          }
          if (!OcorrenciasREG.UnidBasicaSaudeIDFK || isNaN(OcorrenciasREG.UnidBasicaSaudeIDFK)) {
              throw new Error("UnidBasicaSaudeIDFK inválido: o valor fornecido não é um número.");
          }

          // Parseando os IDs
          const BairroidfkInt = parseInt(OcorrenciasREG.Bairroidfk, 10);
          const EpidemiaidfkInt = parseInt(OcorrenciasREG.Epidemiaidfk, 10);
          const LogradouroidfkInt = parseInt(OcorrenciasREG.logradouroidfk, 10);
          const LogradourolocaltrabalhoIDFKInt = parseInt(OcorrenciasREG.LogradourolocaltrabalhoIDFK, 10);
          const UnidBasicaSaudeIDFKInt = parseInt(OcorrenciasREG.UnidBasicaSaudeIDFK, 10);
          const NumeroInt = parseInt(OcorrenciasREG.Numero, 10);
          const NumerolocaltrabalhoInt = parseInt(OcorrenciasREG.Numerolocaltrabalho, 10);

          // Inserindo a ocorrência
          const resp = await axios.post("http://localhost:20100/acl/ocorrencia/v1/InsertOcorrencia", {
              Ocorrenciaid: 0,
              NomeSuspeito: OcorrenciasREG.NomeSuspeito,
              Datacadastro: OcorrenciasREG.Datacadastro,
              Dataocorrencia: OcorrenciasREG.Dataocorrencia,
              Numero: NumeroInt,
              Localtrabalho: OcorrenciasREG.Localtrabalho,
              Numerolocaltrabalho: NumerolocaltrabalhoInt,
              UnidBasicaSaudeIDFK: UnidBasicaSaudeIDFKInt,
              Bairroidfk: BairroidfkInt,
              LogradourolocaltrabalhoIDFK: LogradourolocaltrabalhoIDFKInt,
              Logradouroidfk: LogradouroidfkInt,
              Epidemiaidfk: EpidemiaidfkInt,
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
                  Epidemiaidfk: "",
                  Removido: false,
              };
              message = "Ocorrência cadastrada com sucesso!";
              messageType = "success";
          } else {
              message = "Ocorrência cadastrada com sucesso!";
              messageType = "error";
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

          return res.render("Ocorrencias/view_cadOcorrencias", {
              title: "Cadastro da Unidade Básica de Saúde",
              data: registro,
              Bairro: Bairro.data.regReturn,
              logradouro: logradouro.data.regReturn,
              epidemia: epidemia.data.regReturn,
              unidBasicaSaude: unidBasicaSaude.data.regReturn,
              oper: oper,
              userName: userName,
              message: message,
              messageType: messageType
          });
      }
  } catch (erro) {
      console.error("[ctlOcorrencias.js|insertOcorrencias] Erro não identificado", erro.response ? erro.response.data : erro.message, erro.config);
      if (!res.headersSent) {
          res.status(500).send("Erro ao processar a requisição para inserir a ocorrência");
      }
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
            Epidemiaidfk: ubsREG.Epidemiaidfk,
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
