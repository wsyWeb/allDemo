<template>
    <div></div>
</template>

<script>

    export default {
        name: "BaseComponent",
        data() {
            return {
                pageCacheName: this.$route.path,
                scrollY: 0,
                permission: []
            }
        },
        mounted() {
            const _this = this;

            _this.pageCacheName = _this.$route.path;
            let cacheData = JSON.parse(unescape(sessionStorage.getItem(_this.pageCacheName)));
            if (cacheData) {
                // 恢复滚动高度
                let scrollY = cacheData["scrollY"];
                let dom = document.querySelector('.main-box');
                dom.scrollTo(0, scrollY);
                // 恢复数据
                Object.keys(cacheData).forEach(key => {
                    _this[key] = cacheData[key];
                });
            }

            let dom = document.querySelector('.main-box');
            dom.addEventListener("scroll", _this.scrollHandler);

            // 刷新页面时保存数据
            window.addEventListener("beforeunload", function () {
                _this.cache();
            });
        },
        destroyed() {
            this.cache();

            removeEventListener("scroll", this.scrollHandler);
        },
        methods: {
            scrollHandler() {
                let dom = document.getElementById('main-box');
                this.scrollY = dom.scrollTop;
            },
            cache() {
                // 缓存数据
                let cacheData = {};
                Object.keys(this).forEach(key => {
                    if (key.indexOf("c_") === 0) {
                        cacheData[key] = this[key];
                    }
                });
                if (this.$route.path.indexOf(this.pageCacheName) === - 1) {
                    // 跳转其他路由
                    // 移除当前页面数据
                    sessionStorage.removeItem(this.pageCacheName);
                } else {
                    // 跳转当前路由下的分路由
                    // 保存当前页面数据
                    // let dom = document.getElementById('main-box');
                    // let scrollY = dom.getBoundingClientRect().top;
                    cacheData['scrollY'] = this.scrollY;
                    sessionStorage.setItem(this.pageCacheName, escape(JSON.stringify(cacheData)));
                }
            }
        }
    }
</script>

<style scoped>

</style>
