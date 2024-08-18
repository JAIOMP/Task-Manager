<script setup lang="ts">
import { withDefaults, defineProps } from 'vue';
import { ButtonType, DesignSystemColors } from '@/configs/types';

interface Props {
  type?: ButtonType;
  value: string;
  customClass?: string;
  color?: DesignSystemColors;
}

withDefaults(defineProps<Props>(), {
  type: 'button',
  value: '',
  customClass: '',
  color: '--lush-green'
})

</script>

<template>
  <div class="todo__task-button-container">
    <button 
      :type="type" 
      class="todo__task-button"
      :class="customClass"
      :style="{'--btnColor': `var(${color})`}"
    >
    {{ value }}
    </button>
  </div>
</template>

<style>
.todo__task-button {
  border: none;
  border-radius: 16px;
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  cursor: pointer;
  background-color: var(--btnColor);
  transition: background-color 0.3s ease;
}
.todo__task-button:hover {
  opacity: 0.8;
}
</style>
