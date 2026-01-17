import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    usuario: null,
    usuariosRegistrados: [
      { email: 'docente@live.uleam.edu.ec', password: 'docente123', rol: 'docente' },
      { email: 'estudiante@live.uleam.edu.ec', password: 'estudiante123', rol: 'estudiante' }
    ]
  }),

  actions: {
    login(email, password) {
      if (!email.endsWith('@live.uleam.edu.ec')) {
        throw new Error('El correo debe ser @live.uleam.edu.ec')
      }
      if (!password || password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres')
      }

      const user = this.usuariosRegistrados.find(
        u => u.email === email && u.password === password
      )
      if (!user) {
        throw new Error('Credenciales inválidas')
      }

      this.usuario = { email: user.email, rol: user.rol }
    },

    logout() {
      this.usuario = null
    },

    isAuthenticated() {
      return !!this.usuario
    }
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: 'user',
        storage: localStorage,
        paths: ['usuario']
      }
    ]
  }
})
