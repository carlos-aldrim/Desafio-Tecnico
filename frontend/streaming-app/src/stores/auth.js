import { defineStore } from 'pinia'
import { API_BASE } from '../config/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
  }),
  actions: {
    async login(email, password) {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Falha no login')
      }

      const data = await response.json()
      this.token = data.token
      localStorage.setItem('token', data.token)

      const profileResponse = await fetch(`${API_BASE}/profile`, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      })
      const profileData = await profileResponse.json()
      this.user = profileData.user
    },
    fetchUser: async function () {
      if (!this.token) return

      const response = await fetch(`${API_BASE}/profile`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })

      if (!response.ok) {
        this.logout()
        throw new Error('Falha ao buscar perfil do usuário')
      }

      const data = await response.json()
      this.user = data.user
    },
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
    },
  },
})
