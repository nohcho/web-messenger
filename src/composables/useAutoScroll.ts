import { ref, nextTick } from 'vue';

export function useAutoScroll() {
  const containerRef = ref<HTMLElement | null>(null);

  async function scrollToBottom(smooth = true) {
    await nextTick();
    if (!containerRef.value) return;
    containerRef.value.scrollTo({
      top: containerRef.value.scrollHeight,
      behavior: smooth ? 'smooth' : 'instant',
    });
  }

  return { containerRef, scrollToBottom };
}
