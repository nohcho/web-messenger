type ReplyCallback = (chatId: number, text: string) => void;
type StatusCallback = (chatId: number, isOnline: boolean) => void;

const AUTO_REPLY_TEXT = 'Спасибо за сообщение!)';
const REPLY_DELAY_MIN = 1000;
const REPLY_DELAY_MAX = 2000;
const STATUS_INTERVAL = 8000;

class MessengerEmulator {
  private replyTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();
  private statusInterval: ReturnType<typeof setInterval> | null = null;
  private onReply: ReplyCallback | null = null;
  private onStatusChange: StatusCallback | null = null;
  private chatIds: number[] = [];

  init(
    chatIds: number[],
    onReply: ReplyCallback,
    onStatusChange: StatusCallback
  ) {
    this.stopStatusEmulation();
    this.chatIds = chatIds;
    this.onReply = onReply;
    this.onStatusChange = onStatusChange;
    this.startStatusEmulation();
  }

  scheduleReply(chatId: number) {
    const delay =
      REPLY_DELAY_MIN + Math.random() * (REPLY_DELAY_MAX - REPLY_DELAY_MIN);
    const timerId = setTimeout(() => {
      this.onReply?.(chatId, AUTO_REPLY_TEXT);
      this.replyTimers.delete(`reply-${chatId}-${timerId}`);
    }, delay);
    this.replyTimers.set(`reply-${chatId}-${timerId}`, timerId);
  }

  private startStatusEmulation() {
    this.statusInterval = setInterval(() => {
      if (this.chatIds.length === 0) return;
      const randomIndex = Math.floor(Math.random() * this.chatIds.length);
      const chatId = this.chatIds[randomIndex];
      const isOnline = Math.random() > 0.4;
      this.onStatusChange?.(chatId, isOnline);
    }, STATUS_INTERVAL);
  }

  private stopStatusEmulation() {
    if (this.statusInterval) {
      clearInterval(this.statusInterval);
      this.statusInterval = null;
    }
  }

  destroy() {
    this.replyTimers.forEach((timer) => clearTimeout(timer));
    this.replyTimers.clear();
    this.stopStatusEmulation();
  }
}

export const emulator = new MessengerEmulator();
