<script setup lang="ts">
import { withDefaults, defineProps } from 'vue'

interface Props {
  placeholder?: string
  modelValue: string
  id: string
  type?: string
  value: string
  customClass?: string
  required?: boolean
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
    :id="id"
    :type="type" 
    :placeholder="placeholder" 
    class="todo__task-input" 
    :value="value"
    :class="customClass" 
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" 
  />
</template>


<style>
.todo__task-input {
  width: 100%;
  outline: none;
  transition: border-color 0.3s ease;
}
</style>
