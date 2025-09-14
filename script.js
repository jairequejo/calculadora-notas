// DOM Elements
const form = document.getElementById('grade-form');
const nota1Input = document.getElementById('nota1');
const nota2Input = document.getElementById('nota2');
const nota3Input = document.getElementById('nota3');
const resultArea = document.getElementById('result-area');
const resultStatus = document.getElementById('result-status');
const resultMessage = document.getElementById('result-message');

const victorySound = document.getElementById('victory-sound');
const defeatSound = document.getElementById('defeat-sound');

// Constantes
const PESO1 = 0.33;
const PESO2 = 0.33;
const PESO3 = 0.34;
const NOTA_MINIMA = 10.5;
const NOTA_MAXIMA = 20;

// Mostrar resultado
const showResult = (status, message, sound) => {
  resultArea.classList.remove('hidden', 'bg-green-900', 'bg-red-900', 'bg-blue-900');
  resultStatus.textContent = status;
  resultMessage.textContent = message;

  if (status.includes('Aprobado')) {
    resultArea.classList.add('bg-green-900');
    victorySound.play();
  } else if (status.includes('Desaprobado')) {
    resultArea.classList.add('bg-red-900');
    defeatSound.play();
  } else {
    resultArea.classList.add('bg-blue-900');
  }
};

// Placeholder dinámico
const handlePlaceholderLogic = () => {
  const n1 = parseFloat(nota1Input.value);
  const n2 = parseFloat(nota2Input.value);

  // Caso: solo nota1
  if (!isNaN(n1) && nota2Input.value === '' && nota3Input.value === '') {
    const acumulado = n1 * PESO1;
    const restante = NOTA_MINIMA - acumulado;
    let necesario = restante / (PESO2 + PESO3);
    if (necesario < 0) necesario = 0;
    nota2Input.placeholder = `Necesitas ≥ ${necesario.toFixed(2)}`;
    nota3Input.placeholder = `Necesitas ≥ ${necesario.toFixed(2)}`;
    return;
  }

  // Caso: nota1 y nota2 ingresadas
  if (!isNaN(n1) && !isNaN(n2) && nota3Input.value === '') {
    const acumulado = (n1 * PESO1) + (n2 * PESO2);
    const restante = NOTA_MINIMA - acumulado;
    let necesario = restante / PESO3;
    if (necesario < 0) necesario = 0;
    nota3Input.placeholder = `Necesitas ≥ ${necesario.toFixed(2)}`;
  }
};

// Calcular promedio
const calculateGrade = (e) => {
  e.preventDefault();

  const n1 = parseFloat(nota1Input.value);
  const n2 = parseFloat(nota2Input.value);
  const n3Str = nota3Input.value;

  if (isNaN(n1) || isNaN(n2)) {
    showResult('Error', 'Debes ingresar al menos las dos primeras notas.', null);
    return;
  }

  if (n3Str === "") {
    // Calcular cuánto necesita en la última
    const acumulado = (n1 * PESO1) + (n2 * PESO2);
    const restante = NOTA_MINIMA - acumulado;
    const necesario = restante / PESO3;

    if (necesario > NOTA_MAXIMA) {
      showResult('Imposible Aprobar', `Necesitas ${necesario.toFixed(2)}, lo cual es imposible.`, defeatSound);
    } else if (necesario <= 0) {
      showResult('¡Ya Aprobaste!', 'No necesitas nota en el último examen. 🎉', victorySound);
    } else {
      showResult('Cálculo Intermedio', `Necesitas al menos ${necesario.toFixed(2)} en el último examen.`, null);
    }
  } else {
    const n3 = parseFloat(n3Str);
    const promedio = (n1 * PESO1) + (n2 * PESO2) + (n3 * PESO3);

    if (promedio >= NOTA_MINIMA) {
      showResult('✅ Aprobado', `Promedio final: ${promedio.toFixed(2)}`, victorySound);
    } else {
      showResult('❌ Desaprobado', `Promedio final: ${promedio.toFixed(2)}`, defeatSound);
    }
  }
};

// Listeners
form.addEventListener('submit', calculateGrade);
nota1Input.addEventListener('input', handlePlaceholderLogic);
nota2Input.addEventListener('input', handlePlaceholderLogic);
