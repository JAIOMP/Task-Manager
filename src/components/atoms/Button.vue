<script setup lang="ts">
import { withDefaults, defineProps } from 'vue';
import { ButtonType } from '@/configs/types';

interface Props {
  type?: ButtonType;
  value: string;
  customClass?: string;
}

withDefaults(defineProps<Props>(), {
  type: 'button',
  value: '',
  customClass: '',
})

</script>

<template>
  <div class="todo__task-button-container">
    <button 
      :type="type" 
      class="todo__task-button"
      :class="customClass"
    >
    {{ value }}
    </button>
  </div>
</template>
