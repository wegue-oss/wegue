import mitt from 'mitt'

const emitter = mitt()

const WguEventBus = {
  $on: (...args) => emitter.on(...args),
  $off: (...args) => emitter.off(...args),
  $emit: (...args) => emitter.emit(...args)
}

// Exported object acting as an app-wide event-bus in Vue2
export { WguEventBus }
