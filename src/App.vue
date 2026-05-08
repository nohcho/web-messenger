<template>
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useChatsStore } from '@/stores/chats';

const store = useChatsStore();

onMounted(() => {
  store.loadChats();
});

onUnmounted(() => {
  store.destroyEmulator();
});
</script>
