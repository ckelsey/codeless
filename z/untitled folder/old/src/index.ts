import Vue from 'vue'
import App from './components/app/app'

Vue.config.ignoredElements = [
	'nv-checkbox'
]

new Vue({
	el: '#app',
	components: {
		'app-entry': App
	},
	template: '<app-entry></app-entry>'
})