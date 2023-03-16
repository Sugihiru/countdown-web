import ElementPlus from 'element-plus'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initializeApp } from 'firebase/app'
import firebaseConfig from '@/firebase_config.json'

import fr from 'element-plus/es/locale/lang/fr'
import './assets/main.css'
import 'element-plus/dist/index.css'

initializeApp(firebaseConfig)
const app = createApp(App)

app.use(router).use(ElementPlus, { locale: fr })

app.mount('#app')
