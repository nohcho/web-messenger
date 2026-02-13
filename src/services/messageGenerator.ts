import type { Message } from '@/types';

const SAMPLE_TEXTS_INCOMING = [
  'Привет! Как дела?',
  'Ты видел новый релиз?',
  'Давай созвонимся позже',
  'Я отправил документы на почту',
  'Когда будет готов проект?',
  'Отличная работа!',
  'Нужно обсудить пару вопросов',
  'Встреча перенесена на завтра',
  'Посмотри, пожалуйста, мой PR',
  'Спасибо за помощь!',
  'Можешь глянуть баг в продакшене?',
  'Дедлайн в пятницу, успеваем?',
  'Я обновил дизайн макеты',
  'Клиент одобрил концепцию',
  'Давай обсудим на стендапе',
];

const SAMPLE_TEXTS_OUTGOING = [
  'Привет! Всё отлично',
  'Да, уже смотрю',
  'Хорошо, давай после обеда',
  'Принял, проверю',
  'К концу недели будет готово',
  'Спасибо!',
  'Конечно, напиши список',
  'Ок, записал',
  'Сейчас посмотрю',
  'Не за что!',
  'Уже фикшу',
  'Да, всё по плану',
  'Круто, обновлю на фронте',
  'Отлично!',
  'Обсудим, есть пара идей',
];

let messageIdCounter = 0;

function generateId(): string {
  messageIdCounter += 1;
  return `msg-${Date.now()}-${messageIdCounter}`;
}

export function generateMessageHistory(chatId: number, count = 25): Message[] {
  const messages: Message[] = [];
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  for (let i = 0; i < count; i++) {
    const isOutgoing = Math.random() > 0.5;
    const texts = isOutgoing ? SAMPLE_TEXTS_OUTGOING : SAMPLE_TEXTS_INCOMING;
    const text = texts[Math.floor(Math.random() * texts.length)];
    const timestamp = now - dayMs * 2 + (dayMs * 2 * i) / count;

    messages.push({
      id: generateId(),
      chatId,
      text,
      timestamp,
      isOutgoing,
      isRead: true,
    });
  }

  return messages;
}

export function createMessage(
  chatId: number,
  text: string,
  isOutgoing: boolean
): Message {
  return {
    id: generateId(),
    chatId,
    text,
    timestamp: Date.now(),
    isOutgoing,
    isRead: false,
  };
}
