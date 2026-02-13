<template>
  <div class="message-input">
    <div class="message-input__formatting">
      <button
        class="message-input__format-btn"
        title="Жирный (**текст**)"
        @click="wrapSelection('**')"
      >
        B
      </button>
      <button
        class="message-input__format-btn message-input__format-btn--italic"
        title="Курсив (*текст*)"
        @click="wrapSelection('*')"
      >
        I
      </button>
    </div>
    <div class="message-input__row">
      <textarea
        ref="textareaRef"
        v-model="text"
        class="message-input__textarea"
        placeholder="Введите сообщение..."
        rows="1"
        @keydown="onKeydown"
        @input="autoResize"
      />
      <button
        class="message-input__send"
        :disabled="!canSend"
        @click="send"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M22 2L11 13"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M22 2L15 22L11 13L2 9L22 2Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const emit = defineEmits<{
  send: [text: string];
}>();

const text = ref('');
const textareaRef = ref<HTMLTextAreaElement | null>(null);

const canSend = computed(() => text.value.trim().length > 0);

function send() {
  if (!canSend.value) return;
  emit('send', text.value);
  text.value = '';
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    send();
  }
}

function autoResize() {
  const el = textareaRef.value;
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

function wrapSelection(wrapper: string) {
  const el = textareaRef.value;
  if (!el) return;
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const selected = text.value.substring(start, end);

  if (selected) {
    text.value =
      text.value.substring(0, start) +
      wrapper +
      selected +
      wrapper +
      text.value.substring(end);
  } else {
    const placeholder = wrapper === '**' ? 'жирный' : 'курсив';
    text.value =
      text.value.substring(0, start) +
      wrapper +
      placeholder +
      wrapper +
      text.value.substring(end);
  }
  el.focus();
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.message-input {
  padding: 8px 16px 12px;
  border-top: 1px solid $color-border;
  background-color: $color-bg;

  &__formatting {
    display: flex;
    gap: 4px;
    padding-bottom: 6px;
  }

  &__format-btn {
    width: 28px;
    height: 28px;
    border-radius: $radius-sm;
    @include flex-center;
    font-size: $font-size-sm;
    font-weight: 700;
    color: $color-text-muted;
    transition: all $transition-fast;

    &:hover {
      background-color: $color-surface-hover;
      color: $color-text;
    }

    &--italic {
      font-style: italic;
      font-weight: 400;
      font-family: Georgia, serif;
    }
  }

  &__row {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    background-color: $color-input-bg;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    padding: 8px 8px 8px 14px;
    transition: border-color $transition-fast;

    &:focus-within {
      border-color: $color-primary;
    }
  }

  &__textarea {
    flex: 1;
    resize: none;
    background: none;
    color: $color-text;
    font-size: $font-size-base;
    line-height: 1.4;
    max-height: 120px;

    &::placeholder {
      color: $color-text-muted;
    }
  }

  &__send {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border-radius: $radius-full;
    background-color: $color-primary;
    color: #fff;
    @include flex-center;
    transition: all $transition-fast;

    &:hover:not(:disabled) {
      background-color: $color-primary-hover;
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }
}
</style>
