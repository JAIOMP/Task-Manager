<script setup lang="ts">
import { withDefaults, defineProps } from 'vue'

type Tag = 'h1' | 'h2' | 'h3' | 'p'

interface Props {
  tag: Tag
  color: string
  customClass: string,
}

withDefaults(defineProps<Props>(), {
  tag: 'h2',
  color: '',
  customClass: '',
})

</script>

<template>
  <component :is="tag" :style="{ color: color }" class="todo__task-heading">
    <slot></slot>
  </component>
</template>


<style scoped>
.todo__task-heading {
  margin: 0;
  margin-bottom: 16px;
}
</style>
