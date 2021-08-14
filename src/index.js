import { io } from 'socket.io-client';
import './index.scss';
import ClientGame from './client/ClientGame';
import { getTime } from './common/util';

window.addEventListener('load', () => {
  const socket = io('https://jsprochat.herokuapp.com/');
  const startGame = document.querySelector('.start-game');
  const nameForm = document.getElementById('nameForm');
  const warning = nameForm.querySelector('.warning');

  const chatWrap = document.querySelector('.chat-wrap');
  const chatForm = document.getElementById('form');
  const messageBox = chatWrap.querySelector('.message');

  let isFirstConnection = true;
  let currentUserId = '';

  const submitName = (event) => {
    event.preventDefault();
    const name = nameForm.name.value;

    if (name.length > 12) {
      warning.style.opacity = '1';
      return;
    }

    if (name.length) {
      ClientGame.init({
        tagID: 'world',
        playerName: name,
      });

      socket.emit('start', name);

      chatWrap.style.display = 'block';
      nameForm.removeEventListener('submit', submitName);
      startGame.remove();
    }
  };

  const submitMessage = (event) => {
    event.preventDefault();
    const input = chatForm.message;

    if (input.value) {
      socket.emit('chat message', input.value);
      input.value = '';
    }
  };

  nameForm.addEventListener('submit', submitName);
  chatForm.addEventListener('submit', submitMessage);

  socket.on('chat online', ({ online }) => {
    messageBox.dataset.online = online;
  });

  socket.on('chat connection', ({ time, msg, id }) => {
    if (isFirstConnection) {
      currentUserId = id;
      isFirstConnection = false;
    }

    messageBox.insertAdjacentHTML('beforeend', `<p><strong>${getTime(time)}</strong> ${msg}</p>`);
  });

  socket.on('chat disconnect', ({ time, msg }) => {
    messageBox.insertAdjacentHTML('beforeend', `<p><strong>${getTime(time)}</strong> ${msg}</p>`);
  });

  socket.on('chat message', ({ time, msg, id }) => {
    const isCurrentUser = currentUserId === id;

    messageBox.insertAdjacentHTML(
      'beforeend',
      `<p ${isCurrentUser && "style='color: red'"}><strong>${getTime(time)}</strong> - ${msg}</p>`,
    );
  });
});
