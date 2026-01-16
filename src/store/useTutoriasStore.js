// src/store/useTutoriasStore.js
import { defineStore } from 'pinia'

export const useTutoriasStore = defineStore('tutorias', {
  state: () => ({
    tutorias: [
      // Ejemplo de tutorías
      {
        id: 1,    
        nombre: 'Tutoría de Matemáticas',
        descripcion: 'Ayuda con álgebra y cálculo',
        fecha: '2026-01-10',
        hora: '10:00',
        asesor: 'Dr. Juan Pérez'
      },
    ],
    historial: [],
    notificaciones: [], 
    eventosCalendario: [],
    usuario: null
  }),

  actions: {
    // Estudiante solicita tutoría
    solicitarTutoria(id) {
      const t = this.tutorias.find(t => t.id === id)
      if (t) {
        this.notificaciones.push({
          id: Date.now(),
          mensaje: `El estudiante solicitó la tutoría: ${t.nombre}`,
          fecha: new Date().toLocaleString(),
          tipo: 'solicitud',
          rolDestino: 'docente',
          leida: false,
          tutoriaId: t.id
        })
      }
    },

    // Docente responde solicitud
    responderSolicitud(id, aceptada) {
      const t = this.tutorias.find(t => t.id === id)
      if (t) {
        if (aceptada) {
          this.notificaciones.push({
            id: Date.now(),
            mensaje: `El docente aceptó la tutoría: ${t.nombre}`,
            fecha: new Date().toLocaleString(),
            tipo: 'confirmación',
            rolDestino: 'estudiante',
            leida: false,
            tutoriaId: t.id
          })

          this.eventosCalendario.push({
            id: t.id,
            titulo: t.nombre,
            fecha: t.fecha,
            hora: t.hora,
            descripcion: t.descripcion,
            asesor: t.asesor
          })

          this.historial.push({ ...t, estado: 'Aceptada' })
        } else {
          this.notificaciones.push({
            id: Date.now(),
            mensaje: `El docente rechazó la tutoría: ${t.nombre}`,
            fecha: new Date().toLocaleString(),
            tipo: 'rechazo',
            rolDestino: 'estudiante',
            leida: false,
            tutoriaId: t.id
          })

          this.historial.push({ ...t, estado: 'Rechazada' })
        }
      }
    },

    // Docente crea tutoría → visible para estudiantes
    crearTutoria(tutoria) {
      tutoria.id = Date.now()
      tutoria.estado = 'Disponible'   // 👈 estado inicial
      this.tutorias.push(tutoria)

      // Notificación para estudiantes
      this.notificaciones.push({
        id: Date.now(),
        mensaje: `Nueva tutoría disponible: ${tutoria.nombre}`,
        fecha: new Date().toLocaleString(),
        tipo: 'nueva',
        rolDestino: 'estudiante',
        leida: false,
        tutoriaId: tutoria.id
      })
    },

    // Docente registra tutoría impartida
    registrarImpartida(id) {
      const tutoria = this.tutorias.find(t => t.id === id)
      if (tutoria) {
        this.historial.push({ ...tutoria, estado: 'Impartida' })
        this.tutorias = this.tutorias.filter(t => t.id !== id)

        // Notificación para estudiantes
        this.notificaciones.push({
          id: Date.now(),
          mensaje: `La tutoría "${tutoria.nombre}" fue impartida`,
          fecha: new Date().toLocaleString(),
          tipo: 'info',
          rolDestino: 'estudiante',
          leida: false,
          tutoriaId: tutoria.id
        })
      }
    },

    login(email, rol) {
      this.usuario = { email, rol }
    },
    logout() {
      this.usuario = null
    },

    // Marcar notificación como leída 
    marcarLeida(id) {
      const notif = this.notificaciones.find(n => n.id === id)
      if (notif) notif.leida = true
    },

    // Obtener notificaciones por rol
    getNotificacionesPorRol(rol) {
      return this.notificaciones.filter(n => n.rolDestino === rol)
    }
  },

  persist: true
})
