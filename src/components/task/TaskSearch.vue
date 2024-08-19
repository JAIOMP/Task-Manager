<script setup lang="ts">
import { ref, watch } from 'vue';
import { useTaskStore } from '../../stores/taskStore';

const store = useTaskStore();

const searchQuery = ref('');
watch(searchQuery, (newQuery) => {
  store.setSearchQuery(newQuery);
})

</script>

<template>
  <div>
    <input 
      type="text"
      placeholder="Search tasks..."
      v-model="searchQuery"
      class="tasks__search-bar"
    />
  </div>
</template>


<style lang=scss scoped>
@import '@/assets/styles/main.scss';

.tasks__search-bar {
  width: 100%;
  max-width: 300px;
  border: 1px solid $text-color;
  border-radius: 8px;
  background-color: $background-color;
  outline: none;

  &:focus {
    border-color: $primary-color;
    background-color: $card-bg-color;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
    outline: none;
  }

  &::placeholder {
    color: $muted-text-color;
  }
}
</style>
