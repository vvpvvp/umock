<template>
    <div id="mockMenu">
        <h4>目录</h4>
        <ul class="nav nav-stacked">
            <li class="open" v-on:click="changeMenu($event,'')"><a href="javascript:;">全部</a></li>
            <li v-for="menu in menus" v-on:click="changeMenu($event,menu)"><a href="javascript:;">{{menu}}</a></li>
        </ul>
    </div>
</template>
<script>

export default {
    props: ['mocksets',"nowProject"],
    data() {
        return {menus:[]};
    },
    ready() {
        
    },
    methods: {
        changeMenu: function($event,menu) {
            let _this = $($event.path[1]);
            if(_this.hasClass("open"))return false;
            $("#mockMenu li.open").removeClass("open");
            _this.addClass("open");
            this.$dispatch("changeMenu",menu);
        }
    },
    events:{
        menuInit(menu){
            this.menus = menu;
        }
    }
}
</script>
