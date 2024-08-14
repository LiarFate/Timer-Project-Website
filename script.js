const mongoose = require('mongoose');
interface Timer {
  startCountdown(): void;
  formatTime(seconds: number): string;
  destroy(): void;
}

class TimerModel implements Timer {
  private secondsElapsed: number;
  private intervalId: number;

  constructor() {
    this.secondsElapsed = 0;
    this.intervalId = 0;
  }

  startCountdown(): void {
    this.intervalId = this.startInterval(() => {
      this.secondsElapsed++;
    }, 1000);
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  destroy(): void {
    clearInterval(this.intervalId);
  }

  getSecondsElapsed(): number {
    return this.secondsElapsed;
  }

  private startInterval(callback: () => void, interval: number): number {
    return setInterval(callback, interval);
  }
}

class TimerPresenter {
  private timerModel: TimerModel;
  private timerRenderer: TimerRenderer;

  constructor(timerModel: TimerModel, timerRenderer: TimerRenderer) {
    this.timerModel = timerModel;
    this.timerRenderer = timerRenderer;
  }

  startCountdown(): void {
    this.timerModel.startCountdown();
    this.timerRenderer.startRendering();
  }

  destroy(): void {
    this.timerModel.destroy();
    this.timerRenderer.stopRendering();
  }
}

class TimerRenderer {
  private timerElement: HTMLElement;
  private intervalId: number;

  constructor(timerElement: HTMLElement) {
    this.timerElement = timerElement;
    this.intervalId = 0;
  }

  startRendering(): void {
    this.intervalId = setInterval(() => {
      this.timerElement.innerHTML = this.formatTime();
    }, 1000);
  }

  stopRendering(): void {
    clearInterval(this.intervalId);
  }

  private formatTime(): string {
    // implement formatting logic here
  }
}

class TimerController {
  private timerPresenter: TimerPresenter;

  constructor(timerElement: HTMLElement) {
    const timerModel = new TimerModel();
    const timerRenderer = new TimerRenderer(timerElement);
    this.timerPresenter = new TimerPresenter(timerModel, timerRenderer);
  }

  startCountdown(): void {
    this.timerPresenter.startCountdown();
  }

  destroy(): void {
    this.timerPresenter.destroy();
  }
}

const timerElement: HTMLElement | null = document.getElementById("timer");

if (!timerElement) {
  console.error("Timer element not found");
} else {
  const timerController: TimerController = new TimerController(timerElement);
  timerController.startCountdown();
}

mongoose.connect('mongodb+srv://IWannaBeDoggy:VYMr-5N-a5A!Ac9@IWannaBeDoggy.mongodb.net/time-db?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Timer = mongoose.model('Timer', {
  startTime: Date,
  interval: Number,
  currentTime: Number
});
