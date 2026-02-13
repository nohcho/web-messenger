<template>
  <div
    class="chat-item"
    :class="{ 'chat-item--active': isActive }"
    @click="$emit('select')"
  >
    <div class="chat-item__avatar" :style="{ backgroundColor: avatarColor }">
      <span class="chat-item__initials">{{ initials }}</span>
      <span
        class="chat-item__status"
        :class="chat.isOnline ? 'chat-item__status--online' : 'chat-item__status--offline'"
      />
    </div>

    <div class="chat-item__content">
      <div class="chat-item__top">
        <span class="chat-item__name">{{ chat.user.name }}</span>
        <span v-if="lastMessage" class="chat-item__time">
          {{ formattedTime }}
        </span>
      </div>
      <div class="chat-item__bottom">
        <span class="chat-item__message">{{ lastMessageText }}</span>
        <span v-if="chat.unreadCount > 0" class="chat-item__badge">
          {{ chat.unreadCount }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Chat, Message } from '@/types';
import { formatTime, getInitials, getAvatarColor } from '@/utils/format';

const props = defineProps<{
  chat: Chat;
  isActive: boolean;
}>();

defineEmits<{
  select: [];
}>();

const lastMessage = computed<Message | null>(() =>
  props.chat.messages.length > 0
    ? props.chat.messages[props.chat.messages.length - 1]
    : null
);

const lastMessageText = computed(() => {
  if (!lastMessage.value) return 'Нет сообщений';
  const prefix = lastMessage.value.isOutgoing ? 'Вы: ' : '';
  return prefix + lastMessage.value.text;
});

const formattedTime = computed(() =>
  lastMessage.value ? formatTime(lastMessage.value.timestamp) : ''
);

const initials = computed(() => getInitials(props.chat.user.name));
const avatarColor = computed(() => getAvatarColor(props.chat.id));
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.chat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color $transition-fast;

  &:hover {
    background-color: $color-surface-hover;
  }

  &--active {
    background-color: $color-surface;
  }

  &__avatar {
    position: relative;
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    border-radius: $radius-full;
    @include flex-center;
  }

  &__initials {
    font-size: $font-size-sm;
    font-weight: 600;
    color: #fff;
    letter-spacing: 0.5px;
  }

  &__status {
    position: absolute;
    bottom: 1px;
    right: 1px;
    width: 12px;
    height: 12px;
    border-radius: $radius-full;
    border: 2px solid $color-bg-secondary;
    transition: background-color $transition-base;

    &--online {
      background-color: $color-online;
    }

    &--offline {
      background-color: $color-offline;
    }
  }

  &__content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__top,
  &__bottom {
    @include flex-between;
    gap: 8px;
  }

  &__name {
    font-size: $font-size-base;
    font-weight: 500;
    @include truncate;
  }

  &__time {
    flex-shrink: 0;
    font-size: $font-size-xs;
    color: $color-text-muted;
  }

  &__message {
    flex: 1;
    font-size: $font-size-sm;
    color: $color-text-secondary;
    @include truncate;
  }

  &__badge {
    flex-shrink: 0;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    border-radius: $radius-full;
    background-color: $color-primary;
    color: #fff;
    font-size: $font-size-xs;
    font-weight: 600;
    @include flex-center;
  }
}
</style>
