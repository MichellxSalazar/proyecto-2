<template>
  <div class="layout">
    <!-- Sidebar dinámico según rol -->
    <component :is="sidebarComponent" @logout="cerrarSesion" />

    <main class="content calendario">
      <Header 
        title="Calendario de Tutorías" 
        :subtitle="subtituloCalendario" 
      />

      <div class="calendario-contenido">
        <!-- Calendario mensual -->
        <div class="calendario-grid">
          <div class="calendario-dia-nombre" v-for="d in diasSemana" :key="d">{{ d }}</div>

          <div 
            v-for="dia in diasMes" 
            :key="dia.fechaISO" 
            class="calendario-dia" 
            :class="{ activo: dia.fechaISO === seleccionada }"
            @click="seleccionar(dia.fechaISO)"
          >
            <div class="numero">{{ dia.numero }}</div>
            <div v-if="eventosPorDia(dia.fechaISO).length" class="punto"></div>
          </div>
        </div>

        <!-- Panel de detalles -->
        <div class="calendario-detalles" v-if="eventoSeleccionado">
          <h3>Detalles de la Tutoría</h3>
          <p><strong>Fecha:</strong> {{ formatearFecha(seleccionada) }}</p>
          <p><strong>Título:</strong> {{ eventoSeleccionado.titulo }}</p>
          <p><strong>Materia:</strong> {{ eventoSeleccionado.descripcion }}</p>
          <p><strong>Hora:</strong> {{ eventoSeleccionado.hora }}</p>
          <p><strong>Asesor:</strong> {{ eventoSeleccionado.asesor }}</p>

          <!-- Botón solo visible para docentes -->
          <button 
            v-if="userStore.usuario?.rol === 'docente'" 
            @click="registrarImpartida(eventoSeleccionado.id)"
          >
            Registrar como impartida
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTutoriasStore } from '../store/useTutoriasStore'
import { useUserStore } from '../store/useUserStore'
import { useRouter } from 'vue-router'
import Sidebar from '../components/Sidebar.vue'
import SidebarDocente from '../components/SidebarDocente.vue'
import Header from '../components/Header.vue'

const store = useTutoriasStore()
const userStore = useUserStore()
const router = useRouter()

function cerrarSesion() {
  userStore.logout()
  router.push('/login')
}

const seleccionada = ref(null)

function seleccionar(fecha) {
  seleccionada.value = fecha
}

function formatearFecha(fechaISO) {
  const opciones = { day: 'numeric', month: 'long', year: 'numeric' }
  return new Date(fechaISO).toLocaleDateString('es-ES', opciones)
}

const eventoSeleccionado = computed(() =>
  eventosPorDia(seleccionada.value)[0] || null
)

const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const hoy = new Date()
const anio = hoy.getFullYear()
const mes = hoy.getMonth()
const primerDia = new Date(anio, mes, 1).getDay() || 7
const diasEnMes = new Date(anio, mes + 1, 0).getDate()

const diasMes = computed(() => {
  const dias = []
  for (let i = 1; i <= diasEnMes; i++) {
    const fechaObj = new Date(anio, mes, i)
    const fechaISO = fechaObj.toISOString().split('T')[0]
    dias.push({ numero: i, fechaISO })
  }
  for (let i = 1; i < primerDia; i++) {
    dias.unshift({ numero: '', fechaISO: `vacio-${i}` })
  }
  return dias
})

function eventosPorDia(fechaISO) {
  if (userStore.usuario?.rol === 'docente') {
    return store.eventosCalendario.filter(
      e => e.fecha === fechaISO && e.asesor === userStore.usuario.email
    )
  } else {
    return store.eventosCalendario.filter(e => e.fecha === fechaISO)
  }
}

function registrarImpartida(id) {
  store.registrarImpartida(id)
}

const sidebarComponent = computed(() =>
  userStore.usuario?.rol === 'docente' ? SidebarDocente : Sidebar
)

const subtituloCalendario = computed(() =>
  userStore.usuario?.rol === 'docente'
    ? 'Consulta las fechas de las tutorías que impartes'
    : 'Consulta las fechas programadas para tutorías académicas'
)
</script>
