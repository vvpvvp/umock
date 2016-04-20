<template>
    <div id="mockMenu">
        <h4>目录</h4>
        <ul class="nav nav-stacked">
            <li v-on:click="changeMenu1('')" v-bind:class=[nowMenu==""?"open":""]><a href="javascript:;">全部</a></li>
            <li v-for="menu in menus" v-on:click="changeMenu1(menu)" v-bind:class=[menu==nowMenu?"open":""]><a href="javascript:;">{{menu}}</a></li>
        </ul>
    </div>
</template>
<script>
import Router from "../index.js";

export default {
    props: ['mocksets',"nowProject"],
    data() {
        return {
            nowMenu:"",
            menus:[]
        };
    },
    ready() {
        
    },
    methods: {
        changeMenu: function(menu) {
            Router.go("/"+this.nowProject._id+"/"+menu);
        },
        changeMenu1: function(menu) {
            this.nowMenu = menu;
            this.$dispatch("changeMenu",menu);
        }
    },
    events:{
        menuInit(menu){
            this.menus = menu;
        },
        changeMenuBy(menu){
            this.changeMenu1(menu);
        }
    }
}
</script>
