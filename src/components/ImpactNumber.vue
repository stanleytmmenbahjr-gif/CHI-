<script setup>
import { computed } from 'vue'
import { useCountUp } from '../composables/useCountUp'

const props = defineProps({ value: { type: Number, required: true }, suffix: { type: String, default: '' } })
const { count, element } = useCountUp(props.value)
const formatted = computed(() => `${count.value.toLocaleString()}${props.suffix}`)
</script>

<template><strong ref="element">{{ formatted }}</strong></template>