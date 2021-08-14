import './index.scss';
import ClientGame from './client/ClientGame';

window.addEventListener('load', () => {
  const greeting = document.querySelector('.start-game');
  const submitForm = document.getElementById('nameForm');
  const warning = submitForm.querySelector('.warning');

  const onSubmit = (event) => {
    event.preventDefault();
    const name = submitForm.name.value;

    if (name.length > 12) {
      warning.style.opacity = '1';
      return;
    }

    greeting.parentNode.removeChild(greeting);
    ClientGame.init({ tagID: 'world', playerName: name });
  };

  submitForm.addEventListener('submit', onSubmit);
});
