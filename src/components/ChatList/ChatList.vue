<template>
  <aside class="chat-list">
    <div class="chat-list__header">
      <h1 class="chat-list__title">Сообщения</h1>
    </div>

    <div class="chat-list__search">
      <input
        v-model="searchQuery"
        type="text"
        class="chat-list__search-input"
        placeholder="Поиск..."
      />
    </div>

    <div class="chat-list__items">
      <div v-if="isLoading" class="chat-list__loading">Загрузка...</div>
      <div v-else-if="loadError" class="chat-list__error">
        <p class="chat-list__error-text">{{ loadError }}</p>
        <button
          type="button"
          class="chat-list__retry"
          @click="store.loadChats"
        >
          Повторить
        </button>
      </div>
      <template v-else>
        <ChatListItem
          v-for="chat in filteredChats"
          :key="chat.id"
          :chat="chat"
          :is-active="chat.id === activeChatId"
          @select="onSelect(chat.id)"
        />
      </template>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useChatsStore } from '@/stores/chats';
import { storeToRefs } from 'pinia';
import ChatListItem from './ChatListItem.vue';

const store = useChatsStore();
const router = useRouter();
const { sortedChats, activeChatId, isLoading, loadError } = storeToRefs(store);
const searchQuery = ref('');

const isMobile = computed(() => window.innerWidth <= 768);

const filteredChats = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return sortedChats.value;
  return sortedChats.value.filter((chat) =>
    chat.user.name.toLowerCase().includes(query)
  );
});

function onSelect(chatId: number) {
  store.setActiveChat(chatId);
  if (isMobile.value) {
    router.push({ name: 'chat', params: { id: chatId } });
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.chat-list {
  display: flex;
  flex-direction: column;
  width: $sidebar-width;
  height: 100%;
  background-color: $color-bg-secondary;
  border-right: 1px solid $color-border;

  @include mobile {
    width: 100%;
    border-right: none;
  }

  &__header {
    display: flex;
    align-items: center;
    height: $header-height;
    padding: 0 20px;
    border-bottom: 1px solid $color-border;
  }

  &__title {
    font-size: $font-size-lg;
    font-weight: 600;
  }

  &__search {
    padding: 12px 16px;
  }

  &__search-input {
    width: 100%;
    padding: 10px 14px;
    background-color: $color-input-bg;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    color: $color-text;
    font-size: $font-size-sm;
    transition: border-color $transition-fast;

    &::placeholder {
      color: $color-text-muted;
    }

    &:focus {
      border-color: $color-primary;
    }
  }

  &__items {
    flex: 1;
    overflow-y: auto;
    @include scrollbar;
  }

  &__loading {
    padding: 24px;
    text-align: center;
    color: $color-text-muted;
  }

  &__error {
    padding: 24px 16px;
    text-align: center;
  }

  &__error-text {
    margin-bottom: 12px;
    color: $color-text-secondary;
    font-size: $font-size-sm;
  }

  &__retry {
    padding: 8px 14px;
    border-radius: $radius-sm;
    background-color: $color-primary;
    color: $color-text;
    font-size: $font-size-sm;
    font-weight: 500;
    transition: background-color $transition-fast;

    &:hover {
      background-color: $color-primary-hover;
    }
  }
}
</style>
