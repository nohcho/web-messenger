<template>
  <ChatWindow
    :chat="activeChat"
    :show-back="true"
    @send="store.sendMessage"
    @back="goBack"
  />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useChatsStore } from '@/stores/chats';
import ChatWindow from '@/components/ChatWindow/ChatWindow.vue';

const props = defineProps<{
  chatId: number;
}>();

const store = useChatsStore();
const router = useRouter();
const { activeChat } = storeToRefs(store);

onMounted(() => {
  store.setActiveChat(props.chatId);
});

function goBack() {
  store.setActiveChat(null);
  router.push({ name: 'messenger' });
}
</script>
