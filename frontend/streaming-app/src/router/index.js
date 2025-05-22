import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { storeToRefs } from 'pinia'
import { API_BASE } from '../config/api'
import HomePage from '../views/HomePage.vue'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import EditUserPage from '../views/EditUserPage.vue'
import UserSettings from '../views/UserSettings.vue'
import VideosPage from '../views/VideosPage.vue'
import CategoriesPage from '../views/CategoriesPage.vue'
import CategoryVideosPage from '../views/CategoryVideosPage.vue'
import VideoDetailPage from '../views/VideoDetailPage.vue'
import VideoFormPage from '../views/VideoFormPage.vue'
import VideoEditPage from '../views/VideoEditPage.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import AdminEditUserPage from '../views/AdminEditUserPage.vue'
import AdminCreateUserPage from '../views/AdminCreateUserPage.vue'

const routes = [
  { path: '/', component: HomePage, meta: { requiresAuth: true } },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/editar', component: EditUserPage, meta: { requiresAuth: true } },
  { path: '/usuario', component: UserSettings, meta: { requiresAuth: true } },
  { path: '/videos', component: VideosPage, meta: { requiresAuth: true } },
  { path: '/categorias', component: CategoriesPage, meta: { requiresAuth: true } },
  { path: '/categorias/:id', component: CategoryVideosPage, meta: { requiresAuth: true } },
  { path: '/videos/:id', component: VideoDetailPage, meta: { requiresAuth: true } },
  { path: '/videos/novo', component: VideoFormPage, meta: { requiresAuth: true } },
  { path: '/videos/editar/:id', component: VideoEditPage, meta: { requiresAuth: true } },
  { path: '/admin', component: AdminDashboard, meta: { requiresAuth: true } },
  { path: '/admin/editar/:id', component: AdminEditUserPage, meta: { requiresAuth: true } },
  { path: '/admin/novo', component: AdminCreateUserPage, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()
  const { user, token } = storeToRefs(auth)

  if (token.value && !user.value) {
    try {
      const profileResponse = await fetch(`${API_BASE}/profile`, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })
      const profileData = await profileResponse.json()
      auth.user = profileData.user
    } catch {
      auth.logout()
      return next('/login')
    }
  }

  if (to.meta.requiresAuth && !token.value) {
    return next('/login')
  }

  if (to.path.startsWith('/admin') && user.value?.role !== 'admin') {
    return next('/')
  }

  next()
})

export default router
