import { defineStore } from 'pinia'

export const useTutoriasStore = defineStore('tutorias', {
  state: () => ({
    tutorias: [
      {
        id: 1,
        nombre: 'Tutoría de Matemáticas',
        descripcion: 'Ayuda con álgebra y cálculo',
        fecha: '2026-01-10',
        hora: '10:00',
        asesor: 'Dr. Juan Pérez'
      }
    ],
    solicitudesTutorias: [],
    historial: [],
    notificaciones: [],
    eventosCalendario: [],
    usuario: null
  }),

  actions: {
    agregarSolicitud(tutoria) {
      this.solicitudesTutorias.push(tutoria)

      this.notificaciones.push({
        id: Date.now(),
        mensaje: `Se solicitó la tutoría: ${tutoria.materia || ''} - ${tutoria.nombre} (${tutoria.fecha} ${tutoria.hora})`,
        fecha: new Date().toLocaleString(),
        tipo: 'solicitud',
        rolDestino: 'estudiante',
        leida: false,
        tutoriaId: tutoria.id
      })

      this.notificaciones.push({
        id: Date.now() + 1,
        mensaje: `Solicitud recibida: ${tutoria.materia || ''} - ${tutoria.nombre} (${tutoria.fecha} ${tutoria.hora})`,
        fecha: new Date().toLocaleString(),
        tipo: 'solicitud',
        rolDestino: 'docente',
        leida: false,
        tutoriaId: tutoria.id
      })

      if (!this.tutorias.find(t => t.id === tutoria.id)) {
        this.tutorias.push(tutoria)
      }
    },

    responderSolicitud(id, aceptada) {
      const t = this.tutorias.find(t => t.id === id)
      if (t) {
        if (aceptada) {
          this.notificaciones.push({
            id: Date.now(),
            mensaje: `El docente aceptó la tutoría: ${t.nombre}`,
            fecha: new Date().toLocaleString(),
            tipo: 'confirmacion',
            rolDestino: 'estudiante',
            leida: false,
            tutoriaId: t.id
          })

          if (!this.eventosCalendario.find(e => e.id === t.id)) {
            this.eventosCalendario.push({
              id: t.id,
              titulo: t.nombre,
              fecha: t.fecha,
              hora: t.hora,
              descripcion: t.descripcion,
              asesor: t.asesor || this.usuario?.email
            })
          }

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

    crearTutoria(tutoria) {
      tutoria.id = Date.now()
      tutoria.estado = 'Disponible'

      // Normalizar fecha a ISO
      if (tutoria.fecha) {
        tutoria.fecha = new Date(tutoria.fecha).toISOString().split('T')[0]
      }

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

      // Notificación para docente
      this.notificaciones.push({
        id: Date.now() + 1,
        mensaje: `Has creado la tutoría: ${tutoria.nombre} (${tutoria.fecha} ${tutoria.hora})`,
        fecha: new Date().toLocaleString(),
        tipo: 'confirmacion',
        rolDestino: 'docente',
        leida: false,
        tutoriaId: tutoria.id
      })

      // Evento para el calendario
      if (!this.eventosCalendario.find(e => e.id === tutoria.id)) {
        this.eventosCalendario.push({
          id: tutoria.id,
          titulo: tutoria.nombre,
          fecha: tutoria.fecha,
          hora: tutoria.hora,
          descripcion: tutoria.descripcion,
          asesor: tutoria.asesor
        })
      }
    },

    registrarImpartida(id) {
      const tutoria = this.tutorias.find(t => t.id === id)
      if (tutoria) {
        this.historial.push({ ...tutoria, estado: 'Impartida' })
        this.tutorias = this.tutorias.filter(t => t.id !== id)

        // Notificación para estudiante
        this.notificaciones.push({
          id: Date.now(),
          mensaje: `La tutoría "${tutoria.nombre}" fue impartida`,
          fecha: new Date().toLocaleString(),
          tipo: 'info',
          rolDestino: 'estudiante',
          leida: false,
          tutoriaId: tutoria.id
        })

        // Notificación para docente
        this.notificaciones.push({
          id: Date.now() + 1,
          mensaje: `Has registrado como impartida la tutoría: ${tutoria.nombre}`,
          fecha: new Date().toLocaleString(),
          tipo: 'info',
          rolDestino: 'docente',
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

    marcarLeida(id) {
      const notif = this.notificaciones.find(n => n.id === id)
      if (notif) notif.leida = true
    },

    getNotificacionesPorRol(rol) {
      return this.notificaciones.filter(n => n.rolDestino === rol)
    }
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: 'tutorias',
        storage: localStorage,
        paths: [
          'tutorias',
          'solicitudesTutorias',
          'historial',
          'notificaciones',
          'eventosCalendario',
          'usuario'
        ]
      }
    ]
  }
})
