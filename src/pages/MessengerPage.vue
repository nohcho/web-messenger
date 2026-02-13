<template>
  <div class="messenger">
    <ChatList class="messenger__sidebar" />
    <div class="messenger__chat">
      <div class="messenger__placeholder">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <p>Выберите чат</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChatList from '@/components/ChatList/ChatList.vue';
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.messenger {
  display: flex;
  height: 100%;

  &__sidebar {
    @include mobile {
      width: 100%;
    }
  }

  &__chat {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: $color-bg;

    @include mobile {
      display: none;
    }
  }

  &__placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    color: $color-text-muted;

    p {
      font-size: $font-size-lg;
    }
  }
}
</style>
