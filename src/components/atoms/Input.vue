<script setup lang="ts">
import { withDefaults, defineProps } from 'vue';

interface Props {
  placeholder: string
  type: string
  value: string
  customClass: string
  required: boolean
}

withDefaults(defineProps<Props>(), {
  placeholder: '',
  type: 'text',
  value: '',
  customClass: '',
  required: false
})

</script>

<template>
  <div class="todo__task-input-container">
    <input 
      :type="type" 
      :placeholder="placeholder" 
      class="todo__task-input"
      :value="value"
      :class="customClass"
    />
  </div>
</template>


<style>
.todo__task-input-container {
  position: relative;
}

.todo__task-input {
  width: 100%;
  padding: 10px;
  border: none;
  border-bottom: 2px solid var(--sand-dune);
  outline: none;
  transition: border-color 0.3s ease;
}

.todo__task-input:focus {
  border-bottom: 2px solid var(--earth-brown);
}
</style>
