<template>
    <div>
        <h4>开发人员</h4>
        <ul class="nav nav-stacked">
            <li v-on:click="changeDeveloper('')" v-bind:class=[developer==""?"open":""]><a href="javascript:;">全部</a></li>
            <li v-for="m in developers" v-on:click="changeDeveloper(m)" v-bind:class=[m==developer?"open":""]><a href="javascript:;">{{m}}</a></li>
        </ul>
    </div>
</template>
<script>
import Router from "../../index.js";

export default {
    props: ['developers',"developer"],
    data() {
        return {
        };
    },
    ready() {
    },
    methods: {
        changeDeveloper: function(data) {
            if(window.location.hash.indexOf('/develop')!=-1){
                Router.go("/mockset/"+this.$route.params.id+"/develop?develop="+data);
            }else{
                Router.go("/mockset/"+this.$route.params.id+"/list?develop="+data);
            }
        }
    }
}
</script>
