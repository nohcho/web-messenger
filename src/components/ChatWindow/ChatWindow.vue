<template>
  <div v-if="chat" class="chat-window">
    <div class="chat-window__header">
      <button v-if="showBack" class="chat-window__back" @click="$emit('back')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="chat-window__avatar" :style="{ backgroundColor: avatarColor }">
        <span class="chat-window__initials">{{ initials }}</span>
      </div>
      <div class="chat-window__info">
        <span class="chat-window__name">{{ chat.user.name }}</span>
        <span
          class="chat-window__status"
          :class="chat.isOnline ? 'chat-window__status--online' : 'chat-window__status--offline'"
        >
          {{ chat.isOnline ? 'онлайн' : 'оффлайн' }}
        </span>
      </div>
    </div>

    <div ref="containerRef" class="chat-window__messages">
      <template v-for="(group, gi) in groupedMessages" :key="gi">
        <div class="chat-window__date-separator">
          <span>{{ group.date }}</span>
        </div>
        <MessageBubble
          v-for="msg in group.messages"
          :key="msg.id"
          :message="msg"
          :animated="newMessageIds.has(msg.id)"
        />
      </template>
    </div>

    <MessageInput @send="onSend" />
  </div>

  <div v-else class="chat-window chat-window--empty">
    <div class="chat-window__placeholder">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <p>Выберите чат</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, reactive } from 'vue';
import type { Chat, Message } from '@/types';
import { formatDate, getInitials, getAvatarColor } from '@/utils/format';
import { useAutoScroll } from '@/composables/useAutoScroll';
import MessageBubble from './MessageBubble.vue';
import MessageInput from './MessageInput.vue';

const props = defineProps<{
  chat: Chat | null;
  showBack?: boolean;
}>();

const emit = defineEmits<{
  send: [text: string];
  back: [];
}>();

const { containerRef, scrollToBottom } = useAutoScroll();
const newMessageIds = reactive(new Set<string>());

const initials = computed(() =>
  props.chat ? getInitials(props.chat.user.name) : ''
);

const avatarColor = computed(() =>
  props.chat ? getAvatarColor(props.chat.id) : ''
);

interface MessageGroup {
  date: string;
  messages: Message[];
}

const groupedMessages = computed<MessageGroup[]>(() => {
  if (!props.chat) return [];
  const groups: MessageGroup[] = [];
  let currentDate = '';

  for (const msg of props.chat.messages) {
    const date = formatDate(msg.timestamp);
    if (date !== currentDate) {
      currentDate = date;
      groups.push({ date, messages: [] });
    }
    groups[groups.length - 1].messages.push(msg);
  }

  return groups;
});

function onSend(text: string) {
  emit('send', text);
}

watch(
  () => props.chat?.id,
  () => {
    newMessageIds.clear();
    scrollToBottom(false);
  }
);

watch(
  () => props.chat?.messages.length,
  (newLen, oldLen) => {
    if (!props.chat || !newLen || !oldLen) {
      scrollToBottom(false);
      return;
    }
    if (newLen > oldLen) {
      const lastMsg = props.chat.messages[props.chat.messages.length - 1];
      newMessageIds.add(lastMsg.id);
      scrollToBottom(true);
    }
  }
);
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: $color-bg;

  &--empty {
    @include flex-center;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 12px;
    height: $header-height;
    padding: 0 20px;
    border-bottom: 1px solid $color-border;
    background-color: $color-bg;
    flex-shrink: 0;
  }

  &__back {
    @include flex-center;
    width: 36px;
    height: 36px;
    border-radius: $radius-full;
    color: $color-text;
    transition: background-color $transition-fast;

    &:hover {
      background-color: $color-surface-hover;
    }
  }

  &__avatar {
    width: 40px;
    height: 40px;
    border-radius: $radius-full;
    flex-shrink: 0;
    @include flex-center;
  }

  &__initials {
    font-size: $font-size-sm;
    font-weight: 600;
    color: #fff;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__name {
    font-size: $font-size-base;
    font-weight: 500;
  }

  &__status {
    font-size: $font-size-xs;
    transition: color $transition-base;

    &--online {
      color: $color-online;
    }

    &--offline {
      color: $color-text-muted;
    }
  }

  &__messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
    @include scrollbar;
  }

  &__date-separator {
    @include flex-center;
    padding: 12px 0;

    span {
      font-size: $font-size-xs;
      color: $color-text-muted;
      background-color: $color-surface;
      padding: 4px 12px;
      border-radius: $radius-lg;
    }
  }

  &__placeholder {
    @include flex-center;
    flex-direction: column;
    gap: 16px;
    color: $color-text-muted;

    p {
      font-size: $font-size-lg;
    }
  }
}
</style>
