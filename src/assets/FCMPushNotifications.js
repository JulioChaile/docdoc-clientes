import { Notify } from 'quasar'
import auth from '../auth'
/*
Comportamiento FCMPlugin

- App abierta en primer plano
Se lanza el evento 'notification' y se llama al callback pasado a onNotification, en este caso
wasTapped siempre sera false. Como la app ya estaba en primer plano getInitialPushPayload no es llamado.

- App abierta en segundo plano
Si se abre la app normalmente sin tocar la notificacion no es llamado onNotification ni tampoco
getInitialPushPayload. Si se toca la notificacion se llama al callback pasado a onNotification y wasTapped sera true.

- App cerrada
Si se abre la app normalmente sin tocar la notificacion no es llamado onNotification y
getInitialPushPayload devolvera null. Si se toca la notificacion se llama a getInitialPushPayload  y wasTapped sera true.

Doc
https://github.com/andrehtissot/cordova-plugin-fcm-with-dependecy-updated
*/

export default (v) => {
    const currentPath = v.$router.currentRoute.path
    const query = v.$router.currentRoute.query

    const routerPush = (name, q = {}) => {
        v.$router.push({
            name: name,
            query: q
        })
    }

    const n = {
        /*
        Muestra una alerta de "Nuevo Movimiento" de un caso, al ser tocada la notificacion redirige al caso del id que se le envio
        {
            tipo: "nuevoMovimiento",
            id: Id del caso
        }
        */
        nuevoMovimiento: {
            accion: true,
            noti() { return true },
            botones(p) {
                return [
                    {
                        label: 'Ver caso',
                        color: 'primary',
                        handler: () => { this.tapped(p) }
                    }
                ]
            },
            tapped(p) {
                const idQuery = query.id ? parseInt(query.id) : 0
                const id = parseInt(p.id)

                const enCaso = currentPath.includes('Caso') && id === idQuery

                if (enCaso) {
                    v.forceRender()
                } else {
                    routerPush('Caso', { id })
                }
            },
            icon: 'work'
        }
    }

    const onNotificationCallback = (data) => {
        if (!auth.isLoggedIn || !data) { return }

        const p = data.tipo
            ? n[data.tipo]
            : {
                noti() { return true },
                icon: '',
                accion: false
            }

        if (!data.wasTapped && p.noti(data)){
            Notify.create({
                classes: 'full-width',
                message: notiForeground(data.title, data.body),
                color: 'white',
                textColor: 'black',
                html: true,
                position: 'top',
                icon: p.icon,
                actions: p.accion ? p.botones(data) : []
            })
        } else if (p.accion) {
            p.tapped(data)
        }
    }

    const notiForeground = (title, body) => {
        return `<div class="column">
                    <span class="q-subheading">
                        ${title}
                    </span>
                    <span>
                        ${body}
                    </span>
                </div>`
    }

    setTimeout(() => {
        window.FCM.onNotification(onNotificationCallback)
        window.FCM.getInitialPushPayload().then(onNotificationCallback)
    }, 200)
}