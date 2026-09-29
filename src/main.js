import { createApp } from 'vue'
import './assets/styles.css'
import './assets/enhancements.css'
import './assets/contact.css'
import 'lenis/dist/lenis.css'
import './assets/motion.css'
import App from './App.vue'
import router from './router'
import reveal from './directives/reveal'

document.addEventListener('load', (event) => {
	const image = event.target
	if (image instanceof HTMLImageElement && image.loading === 'lazy') {
		image.classList.add('is-loaded')
	}
}, true)

const app = createApp(App)
app.directive('reveal', reveal)
app.use(router).mount('#app')
