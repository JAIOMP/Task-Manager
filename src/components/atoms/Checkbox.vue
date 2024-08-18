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
    />
    {{ label }}
  </label>
</template>
