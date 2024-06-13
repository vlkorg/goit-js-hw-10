
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

iziToast.settings({
  progressBar: false,
  timeout: 4000,
  resetOnHover: true,
  icon: 'material-icons',
  transitionIn: 'flipInX',
  transitionOut: 'flipOutX',
  position: 'topRight',
});

const timePicker = document.querySelector('#datetime-picker');
const btnStart = document.querySelector('[data-start]');
const dataDays = document.querySelector('[data-days]');
const dataHours = document.querySelector('[data-hours]');
const dataMinutes = document.querySelector('[data-minutes]');
const dataSeconds = document.querySelector('[data-seconds]');

let userSelectedDate;
let intervalId = 0;
let msFromTimer = 0;
btnStart.disabled = true;

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    validationTargetDate(selectedDates[0]);
  },
};

const validationTargetDate = choseDay => {
  if (intervalId > 0) {
    return;
  }

  if (choseDay > new Date()) {
    userSelectedDate = choseDay;
    btnStart.disabled = false;
    msFromTimer = Math.abs(choseDay - new Date());
    return;
  }

  btnStart.disabled = true;
  iziToast.error({
    iconUrl: './img/text.svg',
    message: 'Please choose a date in the future',
  });
};

const addLeadingZero = value => {
  const arrOfTimes = {};
  const obj = convertMs(value);
  for (const key in obj) {
    arrOfTimes[key] = String(obj[key]).padStart(2, '0');
  }
  return arrOfTimes;
};

const intervalFunk = () => {
  msFromTimer = msFromTimer - 1000;
  if (msFromTimer <= 0) {
    clearInterval(intervalId);
    msFromTimer = 0;
    intervalId = 0;
    timePicker.disabled = false;
  }

  const arrOfDate = addLeadingZero(msFromTimer);

  dataDays.textContent = arrOfDate.days;
  dataHours.textContent = arrOfDate.hours;
  dataMinutes.textContent = arrOfDate.minutes;
  dataSeconds.textContent = arrOfDate.seconds;
};

const startTimer = () => {
  msFromTimer = userSelectedDate - new Date();
  intervalId = setInterval(intervalFunk, 1000);
  btnStart.disabled = true;
  timePicker.disabled = true;
};

btnStart.addEventListener('click', startTimer);

flatpickr('#datetime-picker', options);