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
