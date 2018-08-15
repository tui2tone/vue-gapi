import GoogleAuthService from './GoogleAuthService'

const googleAuthService = new GoogleAuthService()
const { login, logout, isAuthenticated, getUserData } = googleAuthService

export default {
  install: function (Vue, clientConfig) {
    Vue.gapiLoadClientPromise = null

    const resolveAuth2Client = (resolve, reject) => {
      if (!window.gapi.auth) {
        window.gapi.load('client:auth2', () => {
          Vue.gapiLoadClientPromise = window.gapi.client.init(clientConfig)
            .then(() => {
              console.info('gapi client initialised.')
              googleAuthService.authInstance = window.gapi.auth2.getAuthInstance()
              resolve(window.gapi)
            })
        })
      } else {
        resolve(window.gapi)
      }
    }

    Vue.prototype.$getGapiClient = () => {
      return new Promise((resolve, reject) => {
        if (Vue.gapiLoadClientPromise &&
            Vue.gapiLoadClientPromise.status === 0) { // promise is being executed
          resolve(Vue.gapiLoadClientPromise)
        } else {
          resolveAuth2Client(resolve, reject)
        }
      })
    }

    Vue.prototype.$login = () => {
      return Vue.prototype.$getGapiClient()
        .then(login)
    }

    Vue.prototype.$logout = () => {
      return Vue.prototype.$getGapiClient()
        .then(logout)
    }

    Vue.prototype.$isAuthenticated = isAuthenticated

    Vue.prototype.$getUserData = getUserData
  }
}
