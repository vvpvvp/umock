<template>
    <div>
        <h4>模块</h4>
        <ul class="nav nav-stacked">
            <li v-on:click="changeMenu('')" v-bind:class=[menu==""?"open":""]><a href="javascript:;">全部</a></li>
            <li v-for="m in menus" v-on:click="changeMenu(m)" v-bind:class=[m==menu?"open":""]><a href="javascript:;">{{m}}</a></li>
        </ul>
    </div>
</template>
<script>
import Router from "../../index.js";

export default {
    props: ['menus',"menu"],
    data() {
        return {
        };
    },
    ready() {
    },
    methods: {
        changeMenu: function(menu) {
            if(window.location.hash.indexOf('/develop')!=-1){
                Router.go("/"+this.$route.params.id+"/develop?menu="+menu);
            }else{
                Router.go("/"+this.$route.params.id+"/list?menu="+menu);
            }
        }
    }
}
</script>
