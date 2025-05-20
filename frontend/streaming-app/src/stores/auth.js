import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
  }),
  actions: {
    async login(email, password) {
      const response = await fetch('http://localhost:3000/login', {
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

      this.user = { email }
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
    },

    tryAutoLogin() {
      const savedToken = localStorage.getItem('token')
      if (savedToken) {
        this.token = savedToken
      }
    },
  },
})
