<template>
  <div
    class="category-button bg-white bg-opacity-90 rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer flex justify-between items-center"
  >
    <div @click="!editing && router.push(`/categorias/${props.category.id}`)" class="flex-1">
      <template v-if="editing">
        <input
          required
          v-model="editedName"
          @keyup.enter="save"
          @keyup.esc="cancel"
          class="text-lg sm:text-xl font-semibold text-indigo-900 w-full"
          autofocus
        />
      </template>
      <template v-else>
        <h3 class="text-lg sm:text-xl font-semibold text-indigo-900 truncate">
          {{ category.name }}
        </h3>
      </template>
    </div>

    <div v-if="isAdmin" class="flex gap-2 items-center">
      <template v-if="editing">
        <button @click="save" class="text-indigo-600 hover:text-indigo-800 font-bold text-md p-1 rounded-full transition" :title="t('categories.save')">
          ✔
        </button>
      </template>
      <template v-else>
        <button @click.stop="startEdit" class="text-indigo-600 hover:text-indigo-800 font-bold text-ml p-1 rounded-full transition" :title="t('categories.edit')">
          ✎
        </button>
        <button @click.stop="remove" class="text-red-600 hover:text-red-800 font-bold text-xl p-1 rounded-full transition" :title="t('categories.delete')">
          ×
        </button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const props = defineProps(['category', 'isAdmin'])
const emit = defineEmits(['save', 'delete'])

const { t } = useI18n()
const router = useRouter()

const editing = ref(false)
const editedName = ref(props.category.name)

function startEdit() {
  editing.value = true
}

function cancel() {
  editing.value = false
  editedName.value = props.category.name
}

function save() {
  if (!editedName.value.trim()) {
    alert(t('categories.nameRequired'))
    return
  }
  emit('save', { id: props.category.id, name: editedName.value.trim() })
  editing.value = false
}

function remove() {
  emit('delete', props.category.id)
}
</script>
