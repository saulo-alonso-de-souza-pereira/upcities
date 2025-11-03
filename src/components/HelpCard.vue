<template>
  <div
    :class="{
      'w-full bg-white border border-gray-border rounded-md shadow-sm mb-3 cursor-pointer': !isOpen,
      'w-full bg-white border border-primary rounded-md shadow-sm mb-3 cursor-pointer': isOpen
    }">
    <button
      class="flex justify-between items-center w-full px-4 py-3 desktop:px-6 desktop:py-4 transition-colors duration-200"
      @click="toggleCard"
      :aria-expanded="isOpen"
      :aria-controls="`card-content-${_uid}`"
    >
      <span
        class="text-black font-montserrat transition-all duration-200 text-sm overflow-hidden desktop:text-base truncate max-w-[60%]"
        :class="{
          'font-semibold': isOpen,
          'font-normal': !isOpen,
          'max-w-full': isOpen
        }"
      >
        {{ title }}
      </span>

      <ChevronDown
        class="w-5 h-5 transition-transform duration-300 transform"
        :class="{ 'rotate-180 text-primary': isOpen, 'text-gray-icon': !isOpen }"
      />
    </button>

    <div
      v-show="isOpen"
      :id="`card-content-${_uid}`"
      class="p-4 desktop:px-6 desktop:py-4 border-t border-gray-divider"
    >
      <p class="text-black font-montserrat text-sm desktop:text-base leading-relaxed" v-html="content"></p>
    </div>
  </div>
</template>

<script lang="ts">
import { ChevronDown } from 'lucide-vue-next';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'HelpCard',
  components: {
    ChevronDown,
  },
  props: {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  },
  setup() {
    const _uid = Math.random().toString(36).substring(2, 9);
    const isOpen = ref(false);

    const toggleCard = () => {
      isOpen.value = !isOpen.value;
    };

    return {
      isOpen,
      toggleCard,
      _uid
    };
  }
});
</script>
