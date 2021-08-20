import { createApp } from 'vue'
import Header from './Header'

var app = createApp({})
app.component('header', {
    Header,
})

export default app
