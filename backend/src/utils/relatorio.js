const { createCanvas } = require("canvas");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const PDFDocument = require("pdfkit");
const Exercicio = require("../models/Exercicio");
const sequelize = require("../database/database");
const logger = require("./logger");

async function gerarRelatorio(req, res) {
  let data;
  try {
    if (req.usuario) {
      data = await Exercicio.findAll({
        where: { usuario_id: req.usuario.id },
        attributes: [
          "dificuldade",
          [sequelize.fn("COUNT", sequelize.col("id")), "quantidade"],
        ],
        group: ["dificuldade"],
      });
    } else {
      data = await Exercicio.findAll({
        where: { usuario_id: null },
        attributes: [
          "dificuldade",
          [sequelize.fn("COUNT", sequelize.col("id")), "quantidade"],
        ],
        group: ["dificuldade"],
      });
    }

    const labels = data.map((item) => item.dificuldade);
    const values = data.map((item) => item.get("quantidade"));

    const configuration = {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Quantidade",
            data: values,
            backgroundColor: "#007bff",
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            precision: 0,
          },
        },
      },
    };

    const canvasRenderService = new ChartJSNodeCanvas({
      width: 500,
      height: 250,
    });

    const chartImage = await canvasRenderService.renderToBuffer(configuration);

    const doc = new PDFDocument();
    doc.image(chartImage, { fit: [500, 250] });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=relatorio.pdf");

    logger.info("Relatório gerado com sucesso");
    doc.pipe(res);
    doc.end();
  } catch (error) {
    logger.error("Erro ao gerar o relatório:", error);
    res.status(500).json({ error: "Ocorreu um erro ao gerar o relatório." });
  }
}

module.exports = gerarRelatorio;
