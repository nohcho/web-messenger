<template>
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useChatsStore } from '@/stores/chats';

const store = useChatsStore();

onMounted(() => {
  store.loadChats();
});
</script>
