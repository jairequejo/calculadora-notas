// Elementos del DOM
const form = document.getElementById("grade-form");
const nota1Input = document.getElementById("nota1");
const nota2Input = document.getElementById("nota2");
const nota3Input = document.getElementById("nota3");
const resultArea = document.getElementById("result-area");
const resultStatus = document.getElementById("result-status");
const resultMessage = document.getElementById("result-message");
const resultGif = document.getElementById("result-gif");

const victoriaSound = document.getElementById("victoria-sound");
const derrotaSound = document.getElementById("derrota-sound");

// Constantes
const PESO1 = 0.33;
const PESO2 = 0.33;
const PESO3 = 0.34;
const NOTA_MINIMA = 10.5;
const NOTA_MAXIMA = 20;

// Arrays de gifs
const gifsVictoria = [
  "gifs/victoria01.gif",
  "gifs/victoria02.gif",
  "gifs/victoria03.gif"
];
const gifsDerrota = [
  "gifs/derrota01.gif",
  "gifs/derrota02.gif",
  "gifs/derrota03.gif"
];

// Función para elegir gif aleatorio
const randomGif = (array) => array[Math.floor(Math.random() * array.length)];

// Mostrar resultados
const showResult = (status, message, gif, sound, color) => {
  resultArea.classList.remove("hidden", "bg-green-900", "bg-red-900", "bg-blue-900");
  resultArea.classList.add(color);

  resultStatus.textContent = status;
  resultMessage.textContent = message;

  if (gif) {
    resultGif.src = gif;
    resultGif.classList.remove("hidden");
  } else {
    resultGif.classList.add("hidden");
  }

  if (sound) {
    sound.currentTime = 0;
    sound.play();
  }
};

// Placeholder dinámico
const handlePlaceholderLogic = () => {
  const n1 = parseFloat(nota1Input.value);
  const n2 = parseFloat(nota2Input.value);

  // Solo nota1
  if (!isNaN(n1) && nota2Input.value === "" && nota3Input.value === "") {
    const acumulado = n1 * PESO1;
    const restante = NOTA_MINIMA - acumulado;
    let necesario = restante / (PESO2 + PESO3);
    if (necesario < 0) necesario = 0;

    nota2Input.placeholder = `≥ ${necesario.toFixed(2)}`;
    nota3Input.placeholder = `≥ ${necesario.toFixed(2)}`;
    return;
  }

  // nota1 + nota2
  if (!isNaN(n1) && !isNaN(n2) && nota3Input.value === "") {
    const acumulado = (n1 * PESO1) + (n2 * PESO2);
    const restante = NOTA_MINIMA - acumulado;
    let necesario = restante / PESO3;
    if (necesario < 0) necesario = 0;

    nota3Input.placeholder = `≥ ${necesario.toFixed(2)}`;
  }
};

nota1Input.addEventListener("input", handlePlaceholderLogic);
nota2Input.addEventListener("input", handlePlaceholderLogic);

// Calcular promedio
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Detener sonidos previos
  victoriaSound.pause();
  derrotaSound.pause();

  // Validar entradas

  const n1 = parseFloat(nota1Input.value) || 0;
  const n2 = parseFloat(nota2Input.value) || 0;
  const n3Str = nota3Input.value;

  // Si falta la tercera nota
  if (n3Str === "") {
    const acumulado = (n1 * PESO1) + (n2 * PESO2);
    const restante = NOTA_MINIMA - acumulado;
    const necesario = restante / PESO3;

    if (necesario > NOTA_MAXIMA) {
      showResult("Imposible Aprobar",
        `Necesitas ${necesario.toFixed(2)}, lo cual es imposible.`,
        randomGif(gifsDerrota), derrotaSound, "bg-red-900");
    } else if (necesario <= 0) {
      showResult("¡Ya Aprobaste!",
        "No necesitas nota en el último examen 🎉",
        randomGif(gifsVictoria), victoriaSound, "bg-green-900");
    } else {
      showResult("Cálculo Intermedio",
        `Necesitas al menos ${necesario.toFixed(2)} en el último examen.`,
        "", null, "bg-blue-900");
    }
  } else {
    const n3 = parseFloat(n3Str);
    const promedio = (n1 * PESO1) + (n2 * PESO2) + (n3 * PESO3);

    if (promedio >= NOTA_MINIMA) {
      showResult("✅ Aprobado",
        `Promedio final: ${promedio.toFixed(2)}`,
        randomGif(gifsVictoria), victoriaSound, "bg-green-900");
    } else {
      showResult("❌ Desaprobado",
        `Promedio final: ${promedio.toFixed(2)}`,
        randomGif(gifsDerrota), derrotaSound, "bg-red-900");
    }
  }
});
