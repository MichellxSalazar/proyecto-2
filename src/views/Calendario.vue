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
  if (!fecha.startsWith('vacio')) {
    seleccionada.value = fecha
  }
}

function formatearFecha(fechaISO) {
  if (!fechaISO) return ''
  return new Date(fechaISO).toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const eventosSeleccionados = computed(() => eventosPorDia(seleccionada.value))

const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

// Combobox de mes y año
const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]
const anioActual = new Date().getFullYear()
const mesSeleccionado = ref(new Date().getMonth())
const anioSeleccionado = ref(anioActual)

const diasMes = computed(() => {
  const dias = []
  const primerDia = new Date(anioSeleccionado.value, mesSeleccionado.value, 1).getDay()
  const diasEnMes = new Date(anioSeleccionado.value, mesSeleccionado.value + 1, 0).getDate()

  // Rellenar huecos antes del primer día
  for (let i = 0; i < (primerDia === 0 ? 6 : primerDia - 1); i++) {
    dias.push({ numero: '', fechaISO: `vacio-${i}` })
  }

  // Generar días del mes
  for (let i = 1; i <= diasEnMes; i++) {
    const fechaObj = new Date(anioSeleccionado.value, mesSeleccionado.value, i)
    const fechaISO = fechaObj.toISOString().split('T')[0]
    dias.push({ numero: i, fechaISO })
  }

  return dias
})

function eventosPorDia(fechaISO) {
  return store.eventosCalendario.filter(e => {
    if (!e.fecha || !fechaISO) return false
    return e.fecha === fechaISO &&
      (userStore.usuario?.rol !== 'docente' || e.asesor === userStore.usuario.email)
  })
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

<template>
  <div class="layout">
    <component :is="sidebarComponent" @logout="cerrarSesion" />

    <main class="content calendario">
      <Header 
        title="Calendario de Tutorías" 
        :subtitle="subtituloCalendario" 
      />

      <div class="filtros">
        <select v-model="mesSeleccionado">
          <option v-for="(mes, index) in meses" :key="index" :value="index">{{ mes }}</option>
        </select>
        <select v-model="anioSeleccionado">
          <option v-for="a in [anioActual - 1, anioActual, anioActual + 1]" :key="a" :value="a">{{ a }}</option>
        </select>
      </div>

      <div class="calendario-contenido">
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

        <div class="calendario-detalles" v-if="eventosSeleccionados.length">
          <h3>Detalles de la Tutoría</h3>
          <p><strong>Fecha:</strong> {{ formatearFecha(seleccionada) }}</p>
          <div v-for="ev in eventosSeleccionados" :key="ev.id" class="evento-detalle">
            <p><strong>Título:</strong> {{ ev.titulo }}</p>
            <p><strong>Materia:</strong> {{ ev.descripcion }}</p>
            <p><strong>Hora:</strong> {{ ev.hora }}</p>
            <p><strong>Asesor:</strong> {{ ev.asesor }}</p>
            <hr />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.filtros {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
select {
  padding: 6px;
  font-size: 1em;
}
.calendario-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}
.calendario-dia {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  min-height: 60px;
  position: relative;
}
.calendario-dia.activo {
  background: #e6f0ff;
}
.calendario-dia .punto {
  width: 8px;
  height: 8px;
  background: red;
  border-radius: 50%;
  position: absolute;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
}
.calendario-dia-nombre {
  font-weight: bold;
  text-align: center;
}
.calendario-detalles {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ccc;
  background: #f9f9f9;
}
.evento-detalle {
  margin-bottom: 10px;
}
</style>
