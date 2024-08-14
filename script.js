// timer.model.ts
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

// timer.presenter.ts
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

// timer.renderer.ts
class TimerRenderer {
  private timerElement: HTMLElement;
  private intervalId: number;

  constructor(timerElement: HTMLElement) {
    this.timerElement = timerElement;
    this.intervalId = 0;
  }

  startRendering(): void {
    this.intervalId = setInterval(() => {
      this.timerElement.innerHTML = this.formatTime(this.timerModel.getSecondsElapsed());
    }, 1000);
  }

  stopRendering(): void {
    clearInterval(this.intervalId);
  }

  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }
}

// timer.controller.ts
class TimerController {
  private timerPresenter: TimerPresenter;

  constructor(timerPresenter: TimerPresenter) {
    this.timerPresenter = timerPresenter;
  }

  startCountdown(): void {
    this.timerPresenter.startCountdown();
  }

  destroy(): void {
    this.timerPresenter.destroy();
  }
}

// timer.factory.ts
class TimerFactory {
  createTimerController(timerElement: HTMLElement): TimerController {
    const timerModel = new TimerModel();
    const timerRenderer = new TimerRenderer(timerElement);
    const timerPresenter = new TimerPresenter(timerModel, timerRenderer);
    return new TimerController(timerPresenter);
  }
}

// main.ts
import { TimerFactory } from './timer.factory';
import { MongoClient } from 'mongodb';

const timerElement: HTMLElement | null = document.getElementById("timer");

if (!timerElement) {
  console.error("Timer element not found");
} else {
  const timerFactory = new TimerFactory();
  const timerController = timerFactory.createTimerController(timerElement);

  // Connect to MongoDB
  const client = new MongoClient('mongodb+srv://IWannaBeDoggy:VYMr-5N-a5A!Ac9@IWannaBeDoggy.mongodb.net/time-db?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  client.connect((err, client) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Connected to MongoDB');

      // Create a collection
      const collection = client.collection('timers');

      // Insert a document
      collection.insertOne({ startTime: new Date(), interval: 1000, currentTime: 0 }, (err, result) => {
        if (err) {
          console.error(err);
        } else {
          console.log('Document inserted');

          // Start the timer
          timerController.startCountdown();
        }
      });
    }
  });
}
