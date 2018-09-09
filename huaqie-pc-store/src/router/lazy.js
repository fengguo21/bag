let BACK_TAG = 'vue';
// 懒加载功能函数 path 仅需要以views作为根目录的路径,有没有.vue后缀都可
let lazy = (path) => {
    if(path.split('.').indexOf(BACK_TAG) !== -1) {
        return resolve => require([`@/components${path}`], resolve)
    } else {
        return resolve => require([`@/components${path}.vue`], resolve)
    }  
}

export default lazy;