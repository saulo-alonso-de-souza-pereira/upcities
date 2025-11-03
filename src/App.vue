<template>
  <div class="app-container">
    <HeaderLayout />
    <main>
      <Loading v-if="faqStore.isLoading"/>
      <RouterView v-else/>
    </main>
    <FooterLayout />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HeaderLayout from './components/HeaderLayout.vue';
import FooterLayout from './components/FooterLayout.vue';
import HelpPage from './views/HelpPage.vue';
import { RouterView } from 'vue-router';
import Loading from './components/Loading.vue';
import { useFaqStore } from './stores/Faq';

export default defineComponent({
  components: {
    HeaderLayout,
    FooterLayout,
    HelpPage,
    Loading,
    RouterView,
  },
  setup() {
    const faqStore = useFaqStore();
    
    return {
      faqStore,
    };
  }
});
</script>
