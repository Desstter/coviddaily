<template>
<HelloWorld />
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
    name: 'App',
    components: {
        HelloWorld
    }
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}

html {
    background-image: url('https://images.theconversation.com/files/349985/original/file-20200728-13-195kv0v.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=1200&h=675.0&fit=crop');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    background-attachment: fixed;
}
</style>
