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
          <!-- Materia -->
          <div class="form-group">
            <label for="materia">Materia <span class="required">*</span></label>
            <input id="materia" v-model="materia" type="text" placeholder="Ej. Aplicaciones Web" required />
          </div>

          <!-- Tema -->
          <div class="form-group">
            <label for="tema">Tema específico <span class="required">*</span></label>
            <input id="tema" v-model="tema" type="text" placeholder="Ej. Proyecto Final" required />
          </div>

          <!-- Fecha y hora en dos columnas -->
          <div class="form-row">
            <div class="form-group">
              <label for="fecha">Fecha deseada <span class="required">*</span></label>
              <input id="fecha" v-model="fecha" type="date" required />
            </div>
            <div class="form-group">
              <label for="hora">Hora <span class="required">*</span></label>
              <input id="hora" v-model="hora" type="time" required />
            </div>
          </div>

          <!-- Descripción -->
          <div class="form-group">
            <label for="descripcion">Descripción adicional</label>
            <textarea id="descripcion" v-model="descripcion" rows="3" placeholder="Agrega detalles relevantes..."></textarea>
          </div>

          <!-- Botones -->
          <div class="form-actions">
            <button type="submit" class="btn-enviar">📩 Enviar solicitud</button>
            <button type="button" class="btn-cancelar" @click="limpiarFormulario">❌ Cancelar</button>
          </div>
        </form>

        <!-- Modal de confirmación -->
        <div v-if="confirmacion" class="modal-tutoria">
          <div class="modal-contenido">
            <div class="modal-header">
              <h3>✅ Solicitud enviada</h3>
              <span class="cerrar-modal" @click="confirmacion = false">&times;</span>
            </div>
            <p>Tu solicitud ha sido registrada correctamente. Recibirás una notificación cuando sea asignada.</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTutoriasStore } from '../store/useTutoriasStore'
import { useUserStore } from '../store/useUserStore'
import { useRouter } from 'vue-router'
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'

const store = useTutoriasStore()
const userStore = useUserStore()
const router = useRouter()

const materia = ref('')
const tema = ref('')
const fecha = ref('')
const hora = ref('')
const descripcion = ref('')
const confirmacion = ref(false)

function enviarSolicitud() {
  const nuevaTutoria = {
    nombre: tema.value,
    materia: materia.value,
    fecha: fecha.value,
    hora: hora.value,
    descripcion: descripcion.value,
    asesor: null
  }
  store.solicitarTutoria(nuevaTutoria.id || Date.now())
  confirmacion.value = true
  limpiarFormulario()
}

function limpiarFormulario() {
  materia.value = ''
  tema.value = ''
  fecha.value = ''
  hora.value = ''
  descripcion.value = ''
}

function cerrarSesion() {
  userStore.logout()
  router.push('/login')
}
</script>
