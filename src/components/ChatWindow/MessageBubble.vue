<template>
  <div
    class="message"
    :class="{
      'message--outgoing': message.isOutgoing,
      'message--incoming': !message.isOutgoing,
      'message--animated': animated,
    }"
  >
    <div class="message__bubble">
      <div class="message__text" v-html="formattedText" />
      <span class="message__time">{{ formattedTime }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Message } from '@/types';
import { formatTime, formatMessageText } from '@/utils/format';

const props = defineProps<{
  message: Message;
  animated?: boolean;
}>();

const formattedText = computed(() => formatMessageText(props.message.text));
const formattedTime = computed(() => formatTime(props.message.timestamp));
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.message {
  display: flex;
  padding: 2px 16px;

  &--outgoing {
    justify-content: flex-end;

    .message__bubble {
      background-color: $color-outgoing;
      border-radius: $radius-lg $radius-lg $radius-sm $radius-lg;
    }
  }

  &--incoming {
    justify-content: flex-start;

    .message__bubble {
      background-color: $color-incoming;
      border-radius: $radius-lg $radius-lg $radius-lg $radius-sm;
    }
  }

  &--animated {
    animation: fadeIn $transition-slow forwards;
  }

  &__bubble {
    max-width: 65%;
    padding: 8px 12px;
    display: inline-flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: 8px;
  }

  &__text {
    font-size: $font-size-base;
    line-height: 1.4;
    word-break: break-word;

    :deep(strong) {
      font-weight: 700;
    }

    :deep(em) {
      font-style: italic;
    }
  }

  &__time {
    font-size: $font-size-xs;
    color: $color-text-muted;
    flex-shrink: 0;
    margin-left: auto;
  }
}
</style>
