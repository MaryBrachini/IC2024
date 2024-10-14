const axios = require("axios");

const getRelatorioOcorrencias = async (req, res) => {
    console.log("[ctlRelatorio|getRelatorioOcorrencias]");

    const userName = req.session.userName;
    const currentDate = new Date();

    try {
        // Fazer a requisição para obter todas as ocorrências
        const response = await axios.get(
            'http://localhost:20100/acl/ocorrencia/v1/GetAllOcorrencias',
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const ocorrencias = response.data.regReturn;
        console.log("[ctlRelatorio|ocorrencias recebidas]", ocorrencias);

        // Filtrar as ocorrências por data
        const quinzenal = ocorrencias.filter(ocorrencia => {
            const dataOcorrencia = new Date(ocorrencia.Dataocorrencia);
            return dataOcorrencia >= new Date(currentDate.setDate(currentDate.getDate() - 15));
        });

        const mensal = ocorrencias.filter(ocorrencia => {
            const dataOcorrencia = new Date(ocorrencia.Dataocorrencia);
            return dataOcorrencia >= new Date(currentDate.setMonth(currentDate.getMonth() - 1));
        });

        const semestral = ocorrencias.filter(ocorrencia => {
            const dataOcorrencia = new Date(ocorrencia.Dataocorrencia);
            return dataOcorrencia >= new Date(currentDate.setMonth(currentDate.getMonth() - 6));
        });

        const anual = ocorrencias.filter(ocorrencia => {
            const dataOcorrencia = new Date(ocorrencia.Dataocorrencia);
            return dataOcorrencia >= new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
        });

        // Organizando os dados
        const totalOcorrencias = {
            last15Days: quinzenal.length,
            lastMonth: mensal.length,
            last6Months: semestral.length,
            lastYear: anual.length
        };

        console.log("[ctlRelatorio|totalOcorrencias]", totalOcorrencias);

        // Renderiza a página com os dados calculados
        res.render("relatorio/view_relatorio", {
            title: "Relatório de Ocorrências",
            totalOcorrencias: totalOcorrencias,
            userName: userName,
        });

        console.log("[ctlRelatorio|getRelatorioOcorrencias] Resposta enviada com sucesso para o relatório de ocorrências");
    } catch (error) {
        console.error('[ctlRelatorio|getRelatorioOcorrencias] Erro:', error.message);
        res.status(500).json({ error: '[ctlRelatorio|getRelatorioOcorrencias] Erro ao buscar dados do relatório' });
    }
};

module.exports = {
    getRelatorioOcorrencias,
};
