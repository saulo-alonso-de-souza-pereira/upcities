<template>
  <nav class="flex space-x-4 desktop:space-x-8 h-full items-center">
    <RouterLink 
      v-for="item in items"
      :key="item.key"
      :to="item.to" 
      class="nav-item py-2 transition-colors duration-200"
      :class="{ 'nav-active': isItemActive(item.to) }"
      @click.prevent="handleItemClick(item.key)" 
    >
      {{ item.name }}
    </RouterLink>
  </nav>
</template>

<script lang="ts">
import { defineComponent, type PropType, computed } from 'vue';
import { useRoute } from 'vue-router';

interface NavItem {
    name: string;
    key: string;
    to: string; 
}

export default defineComponent({
  name: 'Menu',
  
  props: {
    items: {
      type: Array as PropType<NavItem[]>,
      required: true,
    },
    isOpen: {
      type: Boolean,
      default: false,
    }
  },

  emits: ['itemClick'],

  setup(props, { emit }) {
    
    const route = useRoute();

    const isItemActive = (path: string) => {
        return route.path === path;
    };

    const handleItemClick = (key: string) => {
      emit('itemClick', key);
    };

    return {
      handleItemClick,
      isItemActive,
      items: props.items,
      isOpen: props.isOpen,
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