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
        <a-button type="primary" @click="clickArrBtn($event, 'hahaha')">Primary Button</a-button>
        <div>--- 事件修饰符 ---</div>
        <a-input @keyup.delete="onkeyup" v-model="myObject.title" />

        <a-button @click.ctrl.exact="onCtrlClick">点击事件修饰符</a-button>
        <div>--- v-model ---</div>
        <div>
            <input type="checkbox" id="jack" value="Jack" v-model="checkedNames" />
            <label for="jack">Jack</label>
            <input type="checkbox" id="john" value="John" v-model="checkedNames" />
            <label for="john">John</label>
            <input type="checkbox" id="mike" value="Mike" v-model="checkedNames" />
            <label for="mike">Mike</label>
            <br />
            <span>Checked names: {{ checkedNames }}</span>
        </div>
        <div>--- 自定义组件实例 ---</div>
        <div id="blog-post-demo" class="demo">
            {{ items }}
            <blog-post
                v-for="(item, idx) of items"
                :key="idx"
                v-model="item.message"
                @remove-item="items.splice(idx, 1)"
                @add-item="items.push({ message: '' })"
                @update:value="item.message = $event"
            ></blog-post>
        </div>
        <div>-- 插槽 ---</div>
        <div>
            <child2>我是父页面哦</child2>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import { apiTestApi } from 'api/modules/dashboard'
import BlogPost from 'components/test/child1'
import child2 from 'components/test/child2'

export default {
    name: 'Home',
    components: {
        BlogPost,
        child2,
    },
    data() {
        return {
            checkedNames: [],
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
        clickArrBtn(event, msg) {
            alert(event)
            alert(msg)
        },
        onCtrlClick() {
            alert('onCtrlClick')
        },
        onkeyup() {
            alert('onkeyup')
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
