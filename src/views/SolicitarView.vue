<template>
  <div class="layout">
    <Sidebar @logout="cerrarSesion" />
    <main class="content">
      <Header 
        title="Solicitar Tutoría" 
        subtitle="Completa el formulario para agendar una tutoría personalizada" 
      />
      <section class="section">
        <form @submit.prevent="enviarSolicitud" class="solicitud-form">
          <div class="form-group">
            <label for="materia">Materia *</label>
            <input id="materia" v-model="materia" type="text" required />
          </div>
          <div class="form-group">
            <label for="tema">Tema específico *</label>
            <input id="tema" v-model="tema" type="text" required />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="fecha">Fecha *</label>
              <input id="fecha" v-model="fecha" type="date" required />
            </div>
            <div class="form-group">
              <label for="hora">Hora *</label>
              <input id="hora" v-model="hora" type="time" required />
            </div>
          </div>
          <div class="form-group">
            <label for="descripcion">Descripción</label>
            <textarea id="descripcion" v-model="descripcion"></textarea>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-enviar">📩 Enviar solicitud</button>
            <button type="button" class="btn-cancelar" @click="limpiarFormulario">❌ Cancelar</button>
          </div>
        </form>
        <div v-if="confirmacion" class="modal-tutoria">
          <div class="modal-contenido">
            <h3>✅ Solicitud enviada correctamente</h3>
            <p>Tu solicitud ha sido registrada.</p>
            <button class="btn-cerrar" @click="cerrarModal">Cerrar</button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import { useUserStore } from '../store/useUserStore'
import { useTutoriasStore } from '../store/useTutoriasStore'
import { useRouter } from 'vue-router'

const materia = ref('')
const tema = ref('')
const fecha = ref('')
const hora = ref('')
const descripcion = ref('')
const confirmacion = ref(false)

const userStore = useUserStore()
const store = useTutoriasStore()
const router = useRouter()

function enviarSolicitud() {
  const nuevaTutoria = {
    id: Date.now(),
    nombre: tema.value,
    materia: materia.value,
    fecha: fecha.value,
    hora: hora.value,
    descripcion: descripcion.value,
    asesor: null,
    estado: 'Solicitada'
  }

  store.agregarSolicitud(nuevaTutoria)

  confirmacion.value = true
  setTimeout(() => {
    confirmacion.value = false
    limpiarFormulario()
  }, 3000)
}

function limpiarFormulario() {
  materia.value = ''
  tema.value = ''
  fecha.value = ''
  hora.value = ''
  descripcion.value = ''
}

function cerrarModal() {
  confirmacion.value = false
  limpiarFormulario()
}

function cerrarSesion() {
  userStore.logout()
  router.push('/login')
}
</script>
