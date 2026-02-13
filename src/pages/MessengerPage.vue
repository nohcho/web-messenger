<template>
  <div class="messenger">
    <ChatList class="messenger__sidebar" />
    <ChatWindow
      class="messenger__chat"
      :chat="activeChat"
      @send="store.sendMessage"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useChatsStore } from '@/stores/chats';
import ChatList from '@/components/ChatList/ChatList.vue';
import ChatWindow from '@/components/ChatWindow/ChatWindow.vue';

const store = useChatsStore();
const { activeChat } = storeToRefs(store);
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
    @include mobile {
      display: none;
    }
  }
}
</style>
