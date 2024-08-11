<script setup lang="ts">
import TaskStatus from './TaskStatus.vue'

function setFilter(event: Event) {
  console.log(event)
}

</script>

<template>
  <TaskStatus 
    :isFilter="true"
    :setFilter="setFilter"
  />
</template>


<style>

</style>
