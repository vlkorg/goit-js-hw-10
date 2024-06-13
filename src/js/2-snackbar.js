
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const numOfDel = document.querySelector('[name="delay"]');
const radios = document.querySelectorAll('[name="state"]');

iziToast.settings({
  progressBar: false,
  timeout: 4000,
  resetOnHover: true,
  icon: 'material-icons',
  transitionIn: 'flipInX',
  transitionOut: 'flipOutX',
  position: 'topRight',
});

const createPromise = ({ value, delay, shouldResolve }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve(`✅ ${value} promise in ${delay}ms`);
      } else {
        reject(`❌ ${value} promise in ${delay}ms`);
      }
    }, delay);
  });
};

const firstUpperCase = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const formSubmit = e => {
  e.preventDefault();

  const valueRadio = radios[0].checked ? radios[0].value : radios[1].value;

  const objForPromise = {
    value: firstUpperCase(valueRadio),
    delay: Number(numOfDel.value),
    shouldResolve: radios[0].checked,
  };

  form.reset();

  const resultPromise = createPromise(objForPromise);

  resultPromise
    .then(value => {
      iziToast.success({
        message: value,
      });
    })
    .catch(value => {
      iziToast.warning({
        message: value,
      });
    });
};

form.addEventListener('submit', formSubmit);