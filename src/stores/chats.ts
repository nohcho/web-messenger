import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Chat, Message } from '@/types';
import { fetchUsers } from '@/services/api';
import { generateMessageHistory, createMessage } from '@/services/messageGenerator';
import { emulator } from '@/services/emulator';

const STORAGE_KEY = 'messenger-chats';

function loadFromStorage(): Chat[] | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function saveToStorage(chats: Chat[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  } catch {}
}

export const useChatsStore = defineStore('chats', () => {
  const chats = ref<Chat[]>([]);
  const activeChatId = ref<number | null>(null);
  const isLoading = ref(false);

  const activeChat = computed(() =>
    chats.value.find((c) => c.id === activeChatId.value) ?? null
  );

  const sortedChats = computed(() =>
    [...chats.value].sort((a, b) => {
      const lastA = a.messages[a.messages.length - 1];
      const lastB = b.messages[b.messages.length - 1];
      return (lastB?.timestamp ?? 0) - (lastA?.timestamp ?? 0);
    })
  );

  function initEmulator() {
    const ids = chats.value.map((c) => c.id);
    emulator.init(
      ids,
      (chatId, text) => {
        addIncomingMessage(chatId, text);
      },
      (chatId, isOnline) => {
        const chat = chats.value.find((c) => c.id === chatId);
        if (chat) {
          chat.isOnline = isOnline;
          saveToStorage(chats.value);
        }
      }
    );
  }

  async function loadChats() {
    const cached = loadFromStorage();
    if (cached && cached.length > 0) {
      chats.value = cached;
      initEmulator();
      return;
    }

    isLoading.value = true;
    try {
      const users = await fetchUsers(5);
      chats.value = users.map((user) => ({
        id: user.id,
        user,
        messages: generateMessageHistory(user.id),
        isOnline: Math.random() > 0.4,
        unreadCount: 0,
      }));
      saveToStorage(chats.value);
      initEmulator();
    } finally {
      isLoading.value = false;
    }
  }

  function setActiveChat(chatId: number | null) {
    activeChatId.value = chatId;
    if (chatId !== null) {
      const chat = chats.value.find((c) => c.id === chatId);
      if (chat) {
        chat.unreadCount = 0;
        saveToStorage(chats.value);
      }
    }
  }

  function sendMessage(text: string) {
    if (!activeChatId.value || !text.trim()) return;
    const chatId = activeChatId.value;
    const chat = chats.value.find((c) => c.id === chatId);
    if (!chat) return;

    const message = createMessage(chatId, text.trim(), true);
    chat.messages.push(message);
    saveToStorage(chats.value);
    emulator.scheduleReply(chatId);
  }

  function addIncomingMessage(chatId: number, text: string) {
    const chat = chats.value.find((c) => c.id === chatId);
    if (!chat) return;

    const message = createMessage(chatId, text, false);
    chat.messages.push(message);

    if (activeChatId.value !== chatId) {
      chat.unreadCount += 1;
    }

    saveToStorage(chats.value);
  }

  function getLastMessage(chat: Chat): Message | null {
    return chat.messages.length > 0
      ? chat.messages[chat.messages.length - 1]
      : null;
  }

  return {
    chats,
    activeChatId,
    isLoading,
    activeChat,
    sortedChats,
    loadChats,
    setActiveChat,
    sendMessage,
    getLastMessage,
  };
});
