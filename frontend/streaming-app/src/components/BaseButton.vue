<template>
  <button
    v-bind="$attrs"
    :type="props.type"
    :class="[
      'w-full px-4 py-3 text-white rounded-md text-lg font-semibold transition-all duration-300 ease-in-out',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400',
      'hover:scale-[1.02] active:scale-[0.98]',
      props.bgColor,
      props.hoverColor,
      { 'opacity-50 cursor-not-allowed': $attrs.disabled }
    ]"
  >
    <slot />
  </button>
</template>

<script setup>
const props = defineProps({
  bgColor: {
    type: String,
    default: 'bg-blue-600',
  },
  hoverColor: {
    type: String,
    default: 'hover:bg-blue-700',
  },
  type: {
    type: String,
    default: 'button',
  },
})
</script>
