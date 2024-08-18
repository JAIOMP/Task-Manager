<script setup lang="ts">
import { withDefaults, defineProps } from 'vue'

interface Props {
  change: () => void
  value?: string
  checked?: boolean
  label: string
}

withDefaults(defineProps<Props>(), {
  change: () => {},
  value: '',
  checked: false,
})

</script>

<template>
  <label>
    <input 
      type="checkbox" 
      :value="value" 
      :checked="checked" 
      @change="change" 
      class="todo_task-checkbox"
    />
    {{ label }}
  </label>
</template>
<style scoped>
.todo_task-checkbox {
  cursor: pointer;
}
</style>
