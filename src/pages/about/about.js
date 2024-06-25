function closeTutorial() {
  document.getElementById('tutorial').style.visibility = "hidden";
}

/* document.getElementById('customize-dashboard').addEventListener('click', () => {
  alert('Función de personalización aún no implementada');
}) */;

// Instalacion de FullCalendar js
document.addEventListener('DOMContentLoaded', function () {
  var calendarEl = document.getElementById('calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    events: [
      { title: 'Recolección', start: '2024-06-01' },
      { title: 'Informe Semanal', start: '2024-06-07' },
      { title: 'Revisión de Equipos', start: '2024-06-10' }
    ]
  });
  calendar.render();
});

function openQuickActionMenu() {
  var menu = document.getElementById('quick-action-menu');
  if (menu.classList.contains('hidden')) {
    menu.classList.remove('hidden');
  } else {
    menu.classList.add('hidden');
  }
}



/* // Mostrar el tutorial solo la primera vez que el usuario visita la página
window.onload = function () {
  if (!localStorage.getItem('tutorialShown')) {
    document.getElementById('tutorial').classList.remove('hidden');
    localStorage.setItem('tutorialShown', 'true');
  }
};

// Requiere Chart.js u otra biblioteca de gráficos
const ctx = document.getElementById('productionChart').getContext('2d');
const productionChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
    datasets: [{
      label: 'Producción de Café (kg)',
      data: [120, 150, 180, 220, 200],
      backgroundColor: 'rgba(230, 57, 51, 0.5)',
      borderColor: '#e63933',
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

function openQuickActionMenu() {
  var menu = document.getElementById('quick-action-menu');
  if (menu.classList.contains('hidden')) {
    menu.classList.remove('hidden');
  } else {
    menu.classList.add('hidden');
  }
} */


