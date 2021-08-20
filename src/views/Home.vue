<template>
    <div class="home">
        <div class="static" :class="{ active: isActive, 'text-danger': hasError }">sdasd</div>
        <div>--- objeck渲染 ---</div>
        <ul id="v-for-object" class="demo">
            <li v-for="(value, name, index) in myObject" :key="value">{{ value }}: {{ name }}-{{ index }}</li>
        </ul>
        <div>--- array渲染 ---</div>
        <ul id="array-rendering">
            <li v-for="item of items" :key="item.message">
                {{ item.message }}
            </li>
        </ul>
        <a-button type="primary" @click="clickArrBtn">Primary Button</a-button>
    </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import { apiTestApi } from '../api/modules/dashboard'

export default {
    name: 'Home',
    data() {
        return {
            isActive: true,
            hasError: false,
            items: [{ message: 'Foo' }, { message: 'Bar' }],
            myObject: {
                title: 'How to do lists in Vue',
                author: 'Jane Doe',
                publishedAt: '2016-04-10',
            },
        }
    },
    created() {
        apiTestApi({ token: '1' }).then(() => {})
        // HelloWorld
    },
    methods: {
        clickArrBtn() {
            this.items.splice(1, 0, { message: 'new' })
            console.log(this.items, 'this')
        },
    },
}
</script>
<style scoped>
.static.active {
}
.text-danger {
    color: red;
}
</style>
