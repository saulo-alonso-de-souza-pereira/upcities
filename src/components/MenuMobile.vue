<template>
    <div 
      class="fixed top-16 left-0 h-full w-64 bg-white shadow-xl p-4 desktop:hidden transition-transform duration-300 ease-in-out"
      :class="{ 
        'transform -translate-x-full': !isOpen, 
        'transform translate-x-0': isOpen
      }"
    >
      <nav class="flex flex-col space-y-4 text-black">
        <RouterLink 
          v-for="item in items"
          :key="item.key"
          :to="item.to" 
          class="nav-item py-2 transition-colors duration-200"
          :class="{ 'nav-active': activeKey === item.key }"
          @click.prevent="handleItemClick(item.key)" 
        >
          {{ item.name }}
        </RouterLink>
      </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';

interface NavItem {
    name: string;
    key: string;
    to: string; 
}

export default defineComponent({
  name: 'MenuMobile',
  
  props: {
    items: {
      type: Array as () => NavItem[], 
      required: true,
    },
    activeKey: {
      type: String,
      required: true,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['itemClick'],

  setup(props, { emit }) {
    
    const { items, activeKey, isOpen } = toRefs(props);
    
    const handleItemClick = (key: string) => {
      emit('itemClick', key); 
    };

    return {
      items,
      activeKey,
      isOpen,
      handleItemClick,
    };
  }
});
</script>

<style scoped lang="postcss">
  .nav-item {
    @apply h-full flex items-center text-sm desktop:text-base transition-colors;
  }

  .nav-active {
    @apply font-bold border-b-2 border-black;
  }

  .nav-item {
    @apply h-full flex items-center text-black text-sm desktop:text-base font-montserrat transition-colors;
    @apply pt-0 pb-0; 
  }

</style>