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
        console.log("[ctlRelatorio|ocorrencias]recebidas:", ocorrencias);

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
        const totalOcorrencias = {
            last15Days: quinzenal,
            lastMonth: mensal,
            last6Months: semestral,
            lastYear: anual,
        };

        console.log("[ctlRelatorio] totalOcorrencias:", totalOcorrencias);

        // Contagem adicional por categorias
        const contagemPorEpidemia = {};
        const contagemPorUBS = {};
        const contagemPorLogradouro = {};
        const contagemPorBairro = {};
        const contagemPorData = {};

        // Preencher as contagens
        ocorrencias.forEach(ocorrencia => {
            const epidemia = ocorrencia.Epidemiaidfk;
            const ubs = ocorrencia.UnidBasicaSaudeIDFK;
            const logradouro = ocorrencia.Logradouroidfk;
            const bairro = ocorrencia.Bairroidfk;
            const dataOcorrencia = new Date(ocorrencia.Dataocorrencia).toLocaleDateString();

            contagemPorEpidemia[epidemia] = (contagemPorEpidemia[epidemia] || 0) + 1;
            contagemPorUBS[ubs] = (contagemPorUBS[ubs] || 0) + 1;
            contagemPorLogradouro[logradouro] = (contagemPorLogradouro[logradouro] || 0) + 1;
            contagemPorBairro[bairro] = (contagemPorBairro[bairro] || 0) + 1;
            contagemPorData[dataOcorrencia] = (contagemPorData[dataOcorrencia] || 0) + 1;
        });

        console.log("[ctlRelatorio] contagemPorEpidemia[epidemia]:", contagemPorEpidemia);
        console.log("[ctlRelatorio] contagemPorUBS[ubs]:", contagemPorUBS);
        console.log("[ctlRelatorio] contagemPorLogradouro[logradouro]:", contagemPorLogradouro);
        console.log("[ctlRelatorio] contagemPorBairro[bairro]:", contagemPorBairro);
        console.log("[ctlRelatorio] contagemPorData[dataOcorrencia]:", contagemPorData);

        // Para transformar o objeto em um array que você pode iterar
        const contagemEpidemiaArray = Object.entries(contagemPorEpidemia).map(([epidemia, epidemiacount]) => {
            return { epidemia, epidemiacount };
        });
        const contagemPorUBSArray = Object.entries(contagemPorUBS).map(([ubs, ubscount]) => {
            return { ubs, ubscount };
        });
        const contagemPorLogradouroArray = Object.entries(contagemPorLogradouro).map(([logradouro, logradourocount]) => {
            return { logradouro, logradourocount };
        });
        const contagemPorBairroArray = Object.entries(contagemPorBairro).map(([bairro, bairrocount]) => {
            return { bairro, bairrocount };
        });
        const contagemPorDataArray = Object.entries(contagemPorData).map(([dataOcorrencia, dataOcorrenciacount]) => {
            return { dataOcorrencia, dataOcorrenciacount };
        });

        console.log("[ctlRelatorio] contagemEpidemiaArray:", contagemEpidemiaArray);

        // Renderiza a página com todos os dados
        res.render("relatorio/view_relatorio", {
            title: "Relatório de Ocorrências",
            totalOcorrencias: totalOcorrencias,
            contagemEpidemiaArray: contagemEpidemiaArray,
            contagemPorUBSArray: contagemPorUBSArray,
            contagemPorLogradouroArray: contagemPorLogradouroArray,
            contagemPorBairroArray: contagemPorBairroArray,
            contagemPorDataArray: contagemPorDataArray,
            userName: userName,
        });

        console.log("[ctlRelatorio|getRelatorioOcorrencias] Resposta enviada com sucesso para o relatório de ocorrências");
    } catch (erro) {
        console.error("[ctlRelatorio|getRelatorioOcorrencias]Erro não identificado", erro.response ? erro.response.data : erro.message);
        res.status(500).json({ error: '[ctlRelatorio|getRelatorioOcorrencias] Erro ao buscar dados do relatório' });
    }
};

module.exports = {
    getRelatorioOcorrencias,
};
