<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="login-header">
        <h2>Sistema de Tutorías Académicas</h2>
        <p>Accede con tus credenciales</p>
      </div>

      <form @submit.prevent="login" class="login-form">
        <div class="form-group">
          <label for="usuario">Correo institucional</label>
          <input 
            id="usuario" 
            v-model="usuario" 
            type="email" 
            placeholder="ejemplo@live.uleam.edu.ec" 
            required 
          />
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input 
            id="password" 
            v-model="password" 
            type="password" 
            placeholder="Ingresa tu contraseña" 
            required 
          />
        </div>

        <div class="form-group">
          <label for="rol">Selecciona tu rol</label>
          <select id="rol" v-model="rol" required>
            <option value="estudiante">Estudiante</option>
            <option value="docente">Docente</option>
          </select>
        </div>

        <button type="submit" class="btn-primary">Iniciar Sesión</button>
      </form>

      <div class="login-footer">
        <a href="#">¿Olvidaste tu contraseña?</a>
        <a href="#">¿Problemas para acceder?</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '../store/useUserStore'
import { useRouter } from 'vue-router'

const usuario = ref('')
const password = ref('')
const rol = ref('estudiante')
const userStore = useUserStore()
const router = useRouter()

function login() {
  try {
    userStore.login(usuario.value, password.value, rol.value)

    if (rol.value === 'estudiante') {
      router.push('/dashboard')
    } else if (rol.value === 'docente') {
      router.push('/docente/dashboard')
    }
  } catch (error) {
    alert(error.message)
  }
}
</script>
