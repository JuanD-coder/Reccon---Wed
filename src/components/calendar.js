const todayShowTime = document.querySelector('.time-formate');
const todayShowDate = document.querySelector('.date-formate');
const timeFormate = document.querySelector('.time-formate');
const dateFormate = document.querySelector('.date-formate');
const dayTextFormate = document.querySelector('.day-text-formate');

let calendar = document.querySelector('.calendar');
let month_list = calendar.querySelector('.month-list');
let month_picker = document.querySelector('#month-picker');

const month_names = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Deciembre',
];

/* Año Bisiesto */
const isLeapYear = (year) => {
  const divisibleBy4 = year % 4 === 0;
  const divisibleBy100 = year % 100 === 0;
  const divisibleBy400 = year % 400 === 0;

  return (divisibleBy4 && !divisibleBy100) || divisibleBy400;
};

const getFebDays = (year) => {
  return isLeapYear(year) ? 29 : 28;
};

month_picker.onclick = () => {
  month_list.classList.remove('hideonce');
  month_list.classList.remove('hide');
  month_list.classList.add('show');

  dayTextFormate.classList.remove('showtime');
  dayTextFormate.classList.add('hidetime');
  timeFormate.classList.remove('showtime');
  timeFormate.classList.add('hideTime');
  dateFormate.classList.remove('showtime');
  dateFormate.classList.add('hideTime');
};

const generateCalendar = async (month, year) => {
  let calendar_days = document.querySelector('.calendar-days');
  let calendar_header_year = document.querySelector('#year');
  const currentDate = new Date();

  calendar_days.innerHTML = '';
  month_picker.innerHTML = month_names[month];
  calendar_header_year.innerHTML = year;

  const days_of_month = [
    31, getFebDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
  ];

  const first_day = new Date(year, month);
  const calendarHTML = [];

  for (let i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {
    const day = document.createElement('div');
    const dayNumber = i - first_day.getDay() + 1;

    if (i >= first_day.getDay()) {
      day.innerHTML = dayNumber;

      const isCurrentDate = dayNumber === currentDate.getDate() &&
        year === currentDate.getFullYear() &&
        month === currentDate.getMonth();

      if (isCurrentDate) {
        day.classList.add('current-date');
      }
    }
    calendarHTML.push(day.outerHTML);
  }

  calendar_days.innerHTML = calendarHTML.join('')

  calendar_days.addEventListener('click', async (event) => {
    const target = event.target;
    await getDate(target, month, year);
    target.classList.add('current-date-color');
  })

};

async function getDate(today, month, year) {
  const event = new CustomEvent('recolectionClicked', { detail: { today, month, year } });
  document.dispatchEvent(event);
};

/* Obtener dias del mes selecionado */
month_names.forEach((e, index) => {
  let month = document.createElement('div');
  month.innerHTML = `<div>${e}</div>`;

  month_list.append(month);
  month.onclick = () => {
    currentMonth.value = index;
    generateCalendar(currentMonth.value, currentYear.value);
    month_list.classList.replace('show', 'hide');
    dayTextFormate.classList.remove('hideTime');
    dayTextFormate.classList.add('showtime');
    timeFormate.classList.remove('hideTime');
    timeFormate.classList.add('showtime');
    dateFormate.classList.remove('hideTime');
    dateFormate.classList.add('showtime');
  };
});

(function () {
  month_list.classList.add('hideonce');
})();

document.querySelector('#pre-year').onclick = () => {
  --currentYear.value;
  generateCalendar(currentMonth.value, currentYear.value);
};
document.querySelector('#next-year').onclick = () => {
  ++currentYear.value;
  generateCalendar(currentMonth.value, currentYear.value);
};

let currentDate = new Date();
let currentMonth = { value: currentDate.getMonth() };
let currentYear = { value: currentDate.getFullYear() };
generateCalendar(currentMonth.value, currentYear.value);

const currshowDate = new Date();
const showCurrentDateOption = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
};
const currentDateFormate = new Intl.DateTimeFormat(
  'es-MX',
  showCurrentDateOption
).format(currshowDate);

todayShowDate.textContent = currentDateFormate;

/* Formatar para que muestre la hora con los segundos */
setInterval(() => {
  const timer = new Date();
  const option = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };
  const formateTimer = new Intl.DateTimeFormat('en-us', option).format(timer);
  let time = `${`${timer.getHours()}`.padStart(
    2,
    '0'
  )}:${`${timer.getMinutes()}`.padStart(
    2,
    '0'
  )}: ${`${timer.getSeconds()}`.padStart(2, '0')}`;
  todayShowTime.textContent = formateTimer;
}, 1000);