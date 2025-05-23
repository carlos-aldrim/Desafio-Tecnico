<template>
  <div class="min-h-screen bg-gradient-to-tr from-indigo-400 via-purple-500 to-blue-700">
    <NavBar />
    <div class="flex flex-col items-center py-10 px-4">
      <h2 class="text-4xl font-extrabold text-white mb-10 drop-shadow-lg">
        {{ $t('categories.title') }}
      </h2>

      <!-- Campo para adicionar nova categoria -->
      <div v-if="addingNew" class="mb-6 w-full max-w-xl bg-white bg-opacity-90 rounded-xl shadow-md p-4 flex gap-2 items-center">
        <input
          v-model="newCategoryName"
          @keyup.enter="saveNewCategory"
          @keyup.esc="cancelNewCategory"
          class="flex-1 text-lg text-indigo-900 font-semibold p-2 rounded border border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          placeholder="Nova categoria"
          autofocus
        />
        <button
          @click="saveNewCategory"
          class="text-blue-600 text-md font-bold px-3 hover:text-indigo-800 transition"
          :disabled="!newCategoryName.trim()"
          :title="$t('categories.save')"
        >
          ✔
        </button>
        <button
          @click="cancelNewCategory"
          class="text-red-600 text-2xl font-bold px-3 hover:text-red-800 transition"
          :title="$t('categories.cancel')"
        >
          ×
        </button>
      </div>

      <div class="grid gap-4 w-full max-w-xl">
        <div
          v-for="category in paginatedCategories"
          :key="category.id"
          class="category-button bg-white bg-opacity-90 rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer flex justify-between items-center"
        >
          <div @click="!editingId && router.push(`/categorias/${category.id}`)" class="flex-1">
            <template v-if="editingId === category.id">
              <input
                required
                v-model="editedName"
                @keyup.enter="saveCategory(category.id)"
                @keyup.esc="cancelEdit"
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

          <div v-if="auth.user?.role === 'admin'" class="flex gap-2 items-center">
            <template v-if="editingId === category.id">
              <button
                @click="saveCategory(category.id)"
                class="text-indigo-600 hover:text-indigo-800 font-bold text-md p-1 rounded-full transition"
                :title="$t('categories.save')"
              >
                ✔
              </button>
            </template>
            <template v-else>
              <button
                @click.stop="startEditing(category)"
                :title="$t('categories.edit')"
                class="text-indigo-600 hover:text-indigo-800 font-bold text-ml p-1 rounded-full transition"
              >
                ✎
              </button>
              <button
                @click.stop="deleteCategory(category.id)"
                :title="$t('categories.delete')"
                class="text-red-600 hover:text-red-800 font-bold text-xl p-1 rounded-full transition"
                style="cursor: pointer;"
              >
                ×
              </button>
            </template>
          </div>
        </div>
      </div>

      <div v-if="error" class="mt-4 text-red-400 font-semibold">
        {{ $t('categories.errorFetching') }}
      </div>

      <div class="mt-8 flex space-x-6">
        <button
          :disabled="currentPage === 1"
          @click="currentPage--"
          class="px-5 py-2 rounded-lg bg-white text-indigo-700 font-semibold shadow-md hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {{ $t('categories.previous') }}
        </button>
        <button
          :disabled="currentPage >= totalPages"
          @click="currentPage++"
          class="px-5 py-2 rounded-lg bg-white text-indigo-700 font-semibold shadow-md hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {{ $t('categories.next') }}
        </button>
      </div>
    </div>

    <button
      v-if="auth.user?.role === 'admin' && !addingNew"
      @click="addingNew = true"
      class="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white text-3xl rounded-full w-14 h-14 shadow-lg flex items-center justify-center transition"
      :title="$t('categories.newCategory')"
    >
      +
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import NavBar from '../components/NavBar.vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useI18n } from 'vue-i18n'
import { API_BASE } from '../config/api.js'

const { t } = useI18n()

const router = useRouter()
const categories = ref([])
const currentPage = ref(1)
const pageSize = 4
const error = ref(false)
const auth = useAuthStore()

const editingId = ref(null)
const editedName = ref('')

const addingNew = ref(false)
const newCategoryName = ref('')

function startEditing(category) {
  editingId.value = category.id
  editedName.value = category.name
}

function cancelEdit() {
  editingId.value = null
  editedName.value = ''
}

async function saveCategory(id) {
  if (!editedName.value.trim()) {
    alert(t('categories.nameRequired'))
    return
  }

  try {
    const response = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editedName.value.trim() }),
    })

    if (!response.ok) throw new Error(t('categories.updateError'))

    const updated = await response.json()

    const index = categories.value.findIndex(c => c.id === id)
    if (index !== -1) {
      categories.value[index].name = updated.name
    }

    cancelEdit()
  } catch (err) {
    console.error(err)
    alert(t('categories.updateError'))
  }
}

async function saveNewCategory() {
  if (!newCategoryName.value.trim()) {
    alert(t('categories.nameRequired'))
    return
  }

  try {
    const response = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCategoryName.value.trim() }),
    })

    if (!response.ok) throw new Error(t('categories.createError'))

    const created = await response.json()

    categories.value.unshift(created)
    newCategoryName.value = ''
    addingNew.value = false

    currentPage.value = 1
  } catch (err) {
    console.error(err)
    alert(t('categories.createError'))
  }
}

function cancelNewCategory() {
  newCategoryName.value = ''
  addingNew.value = false
}

const fetchCategories = async () => {
  error.value = false
  try {
    const res = await fetch(`${API_BASE}/categories`)
    if (!res.ok) throw new Error(t('categories.apiResponseError'))

    const data = await res.json()
    categories.value = data
  } catch (err) {
    console.error(t('categories.fetchError'), err)
    error.value = true
  }
}

const deleteCategory = async (id) => {
  if (!confirm(t('categories.confirmDelete'))) return

  try {
    const response = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) throw new Error(t('categories.deleteError'))

    categories.value = categories.value.filter(c => c.id !== id)

    if (paginatedCategories.value.length === 0 && currentPage.value > 1) {
      currentPage.value--
    }

  } catch (err) {
    console.error(err)
    alert(t('categories.alertDeleteError'))
  }
}

onMounted(fetchCategories)

const totalPages = computed(() => Math.ceil(categories.value.length / pageSize))
const paginatedCategories = computed(() =>
  categories.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize)
)
</script>

<style scoped>
.category-button {
  cursor: pointer;
}
</style>