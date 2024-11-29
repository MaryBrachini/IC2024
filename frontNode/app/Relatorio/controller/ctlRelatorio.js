const axios = require("axios");

const getRelatorioOcorrencias = async (req, res) => {
    console.log("[ctlRelatorio|getRelatorioOcorrencias] Iniciando...");

    const userName = req.session.userName;
    const currentDate = new Date();
    const token = req.session.token;

    try {
        // Faz a requisição para obter todas as ocorrências
        const resp = await axios.get(
            'http://localhost:20100/acl/ocorrencia/v1/GetAllOcorrencias',
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            }
        );

        const ocorrencias = resp.data.regReturn;
        console.log("[ctlRelatorio|getRelatorioOcorrencias] ocorrencias:", ocorrencias);

        // Calcula a contagem das ocorrências por períodos
        const quinzenal = ocorrencias.filter(ocorrencia => {
            const dataOcorrencia = new Date(ocorrencia.Dataocorrencia);
            return dataOcorrencia >= new Date(currentDate.getTime() - (15 * 24 * 60 * 60 * 1000));
        }).length;

        const mensal = ocorrencias.filter(ocorrencia => {
            const dataOcorrencia = new Date(ocorrencia.Dataocorrencia);
            return dataOcorrencia >= new Date(currentDate.setMonth(currentDate.getMonth() - 1));
        }).length;

        const semestral = ocorrencias.filter(ocorrencia => {
            const dataOcorrencia = new Date(ocorrencia.Dataocorrencia);
            return dataOcorrencia >= new Date(currentDate.setMonth(currentDate.getMonth() - 6));
        }).length;

        const anual = ocorrencias.filter(ocorrencia => {
            const dataOcorrencia = new Date(ocorrencia.Dataocorrencia);
            return dataOcorrencia >= new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
        }).length;

        // Organiza os dados de contagem para o template
        const Ocorrenciasperiodo = {
            quinzenal: quinzenal,
            mensal: mensal,
            semestral: semestral,
            anual: anual,
        };

        console.log("[ctlRelatorio|getRelatorioOcorrencias] Ocorrenciasperiodo:", Ocorrenciasperiodo);

        // Obtém os dados relacionados
        const ubs = await axios.get("http://localhost:20100/acl/ubs/v1/GetAllUBSs", {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });

        const epidemia = await axios.get("http://localhost:20100/acl/epidemia/v1/GetAllEpidemias", {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });

        const logradouro = await axios.get("http://localhost:20100/acl/logradouro/v1/GetAllLogradouros", {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });

        const bairro = await axios.get("http://localhost:20100/acl/bairro/v1/GetAllBairros", {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });

        const epidemiaData = epidemia.data.regReturn;
        const ubsData = ubs.data.regReturn;
        const logradourosData = logradouro.data.regReturn;
        const bairrosData = bairro.data.regReturn;

        // Adiciona os nomes dos idfk dentro da ocorrencia
        function mapOcorrenciasComDados(ocorrencias, epidemiaData, ubsData, logradourosData, bairrosData) {
            return ocorrencias.map(ocorrencia => {
                const epidemiaEncontrado = epidemiaData.find(e => e.Epidemiaid === ocorrencia.Epidemiaidfk);
                const ubsEncontrado = ubsData.find(u => u.UnidBasicaSaudeID === ocorrencia.UnidBasicaSaudeIDFK);
                const logEncontrado = logradourosData.find(l => l.Logradouroid === ocorrencia.Logradouroidfk);
                const bairroEncontrado = bairrosData.find(b => b.Bairroid === ocorrencia.Bairroidfk);

                return {
                    ...ocorrencia,
                    Nomeepidemia: epidemiaEncontrado ? epidemiaEncontrado.Nomeepidemia : "Epidemia não encontrada",
                    NomeUBS: ubsEncontrado ? ubsEncontrado.NomeUBS : "UBS não encontrada",
                    Nomelogradouro: logEncontrado ? logEncontrado.Nomelogradouro : "Logradouro não encontrado",
                    Nomebairro: bairroEncontrado ? bairroEncontrado.Nomebairro : "Bairro não encontrado",
                };
            });
        }

        // Uso da função
        const todasOcorrencias = mapOcorrenciasComDados(
            ocorrencias, epidemiaData, ubsData, logradourosData, bairrosData
        );

        console.log("[ctlRelatorio|GetData] Todas as ocorrências:", todasOcorrencias);

        // Definindo as variáveis de contagem
        const contagemPorEpidemia = {};
        const contagemPorUBS = {};
        const contagemPorLogradouro = {};
        const contagemPorBairro = {};
        const contagemPorData = {};

        // Preencher as contagens com base nas ocorrências
        todasOcorrencias.forEach(ocorrencia => {
            const epidemia = ocorrencia.Nomeepidemia;
            const ubs = ocorrencia.NomeUBS;
            const logradouro = ocorrencia.Nomelogradouro;
            const bairro = ocorrencia.Nomebairro;
            const dataOcorrencia = new Date(ocorrencia.Dataocorrencia).toLocaleDateString();

            // Contagem por Epidemia
            if (!contagemPorEpidemia[epidemia]) {
                contagemPorEpidemia[epidemia] = 0;
            }
            contagemPorEpidemia[epidemia]++;

            // Contagem por UBS
            if (!contagemPorUBS[ubs]) {
                contagemPorUBS[ubs] = 0;
            }
            contagemPorUBS[ubs]++;

            // Contagem por Logradouro
            if (!contagemPorLogradouro[logradouro]) {
                contagemPorLogradouro[logradouro] = 0;
            }
            contagemPorLogradouro[logradouro]++;

            // Contagem por Bairro
            if (!contagemPorBairro[bairro]) {
                contagemPorBairro[bairro] = 0;
            }
            contagemPorBairro[bairro]++;

            // Contagem por Data
            if (!contagemPorData[dataOcorrencia]) {
                contagemPorData[dataOcorrencia] = 0;
            }
            contagemPorData[dataOcorrencia]++;
        });

        // Transformar o objeto de contagem em arrays
        const contagemEpidemiaArray = Object.entries(contagemPorEpidemia).map(([Nomeepidemia, epidemiacount]) => {
            return { Nomeepidemia, epidemiacount };
        });

        const contagemPorUBSArray = Object.entries(contagemPorUBS).map(([NomeUBS, ubscount]) => {
            return { NomeUBS, ubscount };
        });

        const contagemPorLogradouroArray = Object.entries(contagemPorLogradouro).map(([Nomelogradouro, logradourocount]) => {
            return { Nomelogradouro, logradourocount };
        });

        const contagemPorBairroArray = Object.entries(contagemPorBairro).map(([Nomebairro, bairrocount]) => {
            return { Nomebairro, bairrocount };
        });

        const contagemPorDataArray = Object.entries(contagemPorData).map(([dataOcorrencia, dataOcorrenciacount]) => {
            return { dataOcorrencia, dataOcorrenciacount };
        });

        // Logs após a criação dos arrays
        console.log("[ctlRelatorio] contagemPorEpidemia:", contagemEpidemiaArray);
        console.log("[ctlRelatorio] contagemPorUBS:", contagemPorUBSArray);
        console.log("[ctlRelatorio] contagemPorLogradouro:", contagemPorLogradouroArray);
        console.log("[ctlRelatorio] contagemPorBairro:", contagemPorBairroArray);
        console.log("[ctlRelatorio] contagemPorData:", contagemPorDataArray);

        // Renderiza a página com todos os dados
        res.render("relatorio/view_relatorio", {
            title: "Relatório de Ocorrências",
            Ocorrenciasperiodo: Ocorrenciasperiodo,
            contagemEpidemiaArray,
            contagemPorUBSArray,
            contagemPorLogradouroArray,
            contagemPorBairroArray,
            contagemPorDataArray,
            userName: userName,
        });

        console.log("[ctlRelatorio|getRelatorioOcorrencias] Resposta enviada com sucesso para o relatório de ocorrências");

    } catch (erro) {
        console.error("[ctlRelatorio|getRelatorioOcorrencias] Erro não identificado", erro.response ? erro.response.data : erro.message);
        res.status(500).json({ error: '[ctlRelatorio|getRelatorioOcorrencias] Erro ao buscar dados do relatório' });
    }
};


const GetData = async (req, res) => {
    console.log("[ctlRelatorio|GetData] Iniciando GetData...");

    const token = req.session.token;

    try {
        // Faz a requisição para obter todas as ocorrências
        const resp = await axios.get(
            'http://localhost:20100/acl/ocorrencia/v1/GetAllOcorrencias',
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            }
        );

        const ocorrencias = resp.data.regReturn;
        console.log("[ctlRelatorio|GetData] ocorrencias:", ocorrencias);

        // Obtém os dados relacionados
        const ubs = await axios.get("http://localhost:20100/acl/ubs/v1/GetAllUBSs", {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });

        const epidemia = await axios.get("http://localhost:20100/acl/epidemia/v1/GetAllEpidemias", {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });

        const logradouro = await axios.get("http://localhost:20100/acl/logradouro/v1/GetAllLogradouros", {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });

        const bairro = await axios.get("http://localhost:20100/acl/bairro/v1/GetAllBairros", {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });

        const epidemiaData = epidemia.data.regReturn;
        const ubsData = ubs.data.regReturn;
        const logradourosData = logradouro.data.regReturn;
        const bairrosData = bairro.data.regReturn;

        // Adiciona os nomes dos idfk dentro da ocorrência
        function mapOcorrenciasComDados(ocorrencias, epidemiaData, ubsData, logradourosData, bairrosData) {
            return ocorrencias.map(ocorrencia => {
                const epidemiaEncontrado = epidemiaData.find(e => e.Epidemiaid === ocorrencia.Epidemiaidfk);
                const ubsEncontrado = ubsData.find(u => u.UnidBasicaSaudeID === ocorrencia.UnidBasicaSaudeIDFK);
                const logEncontrado = logradourosData.find(l => l.Logradouroid === ocorrencia.Logradouroidfk);
                const bairroEncontrado = bairrosData.find(b => b.Bairroid === ocorrencia.Bairroidfk);

                return {
                    ...ocorrencia,
                    Nomeepidemia: epidemiaEncontrado ? epidemiaEncontrado.Nomeepidemia : "Epidemia não encontrada",
                    NomeUBS: ubsEncontrado ? ubsEncontrado.NomeUBS : "UBS não encontrada",
                    Nomelogradouro: logEncontrado ? logEncontrado.Nomelogradouro : "Logradouro não encontrado",
                    Nomebairro: bairroEncontrado ? bairroEncontrado.Nomebairro : "Bairro não encontrado",
                };
            });
        }

        // Uso da função
        const todasOcorrencias = mapOcorrenciasComDados(
            ocorrencias, epidemiaData, ubsData, logradourosData, bairrosData
        );

        console.log("[ctlRelatorio|GetData] Todas as ocorrências:", todasOcorrencias);

        // Definindo as variáveis de contagem
        const contagemPorEpidemia = {};
        const contagemPorUBS = {};
        const contagemPorLogradouro = {};
        const contagemPorBairro = {};
        const contagemPorData = {};

        // Preencher as contagens com base nas ocorrências
        todasOcorrencias.forEach(ocorrencia => {
            const epidemia = ocorrencia.Nomeepidemia;
            const ubs = ocorrencia.NomeUBS;
            const logradouro = ocorrencia.Nomelogradouro;
            const bairro = ocorrencia.Nomebairro;
            const dataOcorrencia = new Date(ocorrencia.Dataocorrencia).toLocaleDateString();

            // Contagem por Epidemia
            if (!contagemPorEpidemia[epidemia]) {
                contagemPorEpidemia[epidemia] = 0;
            }
            contagemPorEpidemia[epidemia]++;

            // Contagem por UBS
            if (!contagemPorUBS[ubs]) {
                contagemPorUBS[ubs] = 0;
            }
            contagemPorUBS[ubs]++;

            // Contagem por Logradouro
            if (!contagemPorLogradouro[logradouro]) {
                contagemPorLogradouro[logradouro] = 0;
            }
            contagemPorLogradouro[logradouro]++;

            // Contagem por Bairro
            if (!contagemPorBairro[bairro]) {
                contagemPorBairro[bairro] = 0;
            }
            contagemPorBairro[bairro]++;

            // Contagem por Data
            if (!contagemPorData[dataOcorrencia]) {
                contagemPorData[dataOcorrencia] = 0;
            }
            contagemPorData[dataOcorrencia]++;
        });

        // Transformar o objeto de contagem em arrays
        const contagemEpidemiaArray2 = Object.entries(contagemPorEpidemia).map(([Nomeepidemia, epidemiacount]) => {
            return { Nomeepidemia, epidemiacount };
        });

        const contagemPorUBSArray2 = Object.entries(contagemPorUBS).map(([NomeUBS, ubscount]) => {
            return { NomeUBS, ubscount };
        });

        const contagemPorLogradouroArray2 = Object.entries(contagemPorLogradouro).map(([Nomelogradouro, logradourocount]) => {
            return { Nomelogradouro, logradourocount };
        });

        const contagemPorBairroArray2 = Object.entries(contagemPorBairro).map(([Nomebairro, bairrocount]) => {
            return { Nomebairro, bairrocount };
        });

        const contagemPorDataArray2 = Object.entries(contagemPorData).map(([dataOcorrencia, dataOcorrenciacount]) => {
            return { dataOcorrencia, dataOcorrenciacount };
        });

        // Logs após a criação dos arrays
        console.log("[ctlRelatorio] contagemPorEpidemia:", contagemEpidemiaArray2);
        console.log("[ctlRelatorio] contagemPorUBS:", contagemPorUBSArray2);
        console.log("[ctlRelatorio] contagemPorLogradouro:", contagemPorLogradouroArray2);
        console.log("[ctlRelatorio] contagemPorBairro:", contagemPorBairroArray2);
        console.log("[ctlRelatorio] contagemPorData:", contagemPorDataArray2);

        // Retorna os dados em formato JSON
        res.setHeader('Content-Type', 'application/json');
        res.json({
            regReturn: true,
            contagemEpidemiaArray2,
            contagemPorUBSArray2,
            contagemPorLogradouroArray2,
            contagemPorBairroArray2,
            contagemPorDataArray2
        });

        console.log("[ctlRelatorio|GetData] Resposta enviada com sucesso para o relatório de ocorrências");

    } catch (erro) {
        console.error("[ctlRelatorio|GetData] Erro não identificado", erro.response ? erro.response.data : erro.message);
        res.status(500).json({ error: '[ctlRelatorio|GetData] Erro ao buscar dados do relatório' });
    }
};

module.exports = {
    getRelatorioOcorrencias,
    GetData
};
