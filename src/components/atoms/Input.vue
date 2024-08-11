<script setup lang="ts">
import { withDefaults, defineProps } from 'vue';

interface Props {
  placeholder: string
  modelValue: string
  id: string
  type: string
  value: string
  customClass: string
  required: boolean
}

withDefaults(defineProps<Props>(), {
  placeholder: '',
  modelValue: '',
  id: '',
  type: 'text',
  value: '',
  customClass: '',
  required: false
})

</script>

<template>
  <input 
    :type="type" 
    :placeholder="placeholder" 
    class="todo__task-input" 
    :class="customClass" 
    @input="$emit('update:modelValue', $event.target!.value)" 
  />
</template>


<style>
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
