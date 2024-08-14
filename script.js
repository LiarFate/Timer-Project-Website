// Get the timer element
const timerElement = document.getElementById('timer');

// Set the initial timer state
let timerState = {
  startTime: new Date().getTime(),
  interval: 1000, // 1 second
  currentTime: 0
};

// Update the timer display
function updateTimer() {
  const currentTime = new Date().getTime();
  timerState.currentTime = currentTime - timerState.startTime;
  timerElement.textContent = formatTime(timerState.currentTime);
  setTimeout(updateTimer, timerState.interval);
}

// Format the time for display
function formatTime(time) {
  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Initialize the timer
updateTimer();

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://<I Wanna Be Doggy>:<VYMr-5N-a5A!Ac9>@<IWannaBeDoggy>.mongodb.net/<database-name>?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Timer = mongoose.model('Timer', {
  startTime: Date,
  interval: Number,
  currentTime: Number
});
