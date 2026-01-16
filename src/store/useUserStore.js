// src/store/useUserStore.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    usuario: null,
    // Usuarios registrados de ejemplo
    usuariosRegistrados: [
      { email: 'docente@live.uleam.edu.ec', password: 'docente123', rol: 'docente' },
      { email: 'estudiante@live.uleam.edu.ec', password: 'estudiante123', rol: 'estudiante' }
    ]
  }),

  actions: {
    login(email, password) {
      // Validar dominio del correo
      if (!email.endsWith('@live.uleam.edu.ec')) {
        throw new Error('El correo debe ser @live.uleam.edu.ec');
      }

      // Validar longitud de contraseña
      if (!password || password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      // Buscar usuario registrado
      const user = this.usuariosRegistrados.find(
        u => u.email === email && u.password === password
      );

      if (!user) {
        throw new Error('Credenciales inválidas');
      }

      // Guardar sesión
      this.usuario = { email: user.email, rol: user.rol };
    },

    logout() {
      this.usuario = null;
    },

    isAuthenticated() {
      return !!this.usuario;
    }
  },

  persist: true
});
