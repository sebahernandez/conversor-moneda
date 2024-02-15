const input = document.querySelector("input");
const button = document.querySelector("button");
const select = document.getElementById("moneda");
const resultado = document.getElementById("resultado");
const ctx = document.getElementById("historialConversiones").getContext("2d");

const apiUrl = "https://mindicador.cl/api";

const getIndicador = async () => {
  try {
    const response = await fetch(`${apiUrl}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

const getDolar = async () => {
  const dolar = await getIndicador();
  let valorDolar = dolar.dolar.valor;
  return valorDolar;
};

const getEuro = async () => {
  const euro = await getIndicador();
  let valorEuro = euro.euro.valor;
  return valorEuro;
};

const mostrarValor = async (valor) => {
  resultado.innerHTML = valor;
};

let historial = [];
let etiquetasHistorial = [];

let myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: etiquetasHistorial,
    datasets: [
      {
        label: "Historial de conversiones",
        data: historial,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

const convertir = async () => {
  button.addEventListener("click", async (e) => {
    e.preventDefault();
    const clpIngresado = input.value.replace(/\./g, "").replace(/,/g, "");
    const montoClp = parseFloat(clpIngresado);

    if (isNaN(montoClp)) {
      console.log("Por favor ingresa una valor numero valido");
      return;
    }
    let valorConversion;
    const fechaActual = new Date().toLocaleString();

    if (select.value === "usd") {
      const dolarEnClp = await getDolar();
      const montoEnUSD = montoClp / dolarEnClp;
      valorConversion = montoEnUSD.toFixed(2);
      mostrarValor(`$${valorConversion} USD`);
    } else if (select.value === "eur") {
      const euroEnClp = await getEuro();
      const montoEnEUR = montoClp / euroEnClp;
      valorConversion = montoEnEUR.toFixed(2);
      mostrarValor(`$${valorConversion} EUR`);
    }

    historial.push(valorConversion);
    etiquetasHistorial.push(fechaActual);
    myChart.data.labels.push(fechaActual);
    myChart.data.datasets.forEach((dataset) => {
      dataset.data.push(valorConversion);
    });
    myChart.update();
  });
};

convertir();
