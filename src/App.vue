<template>
  <div>
    <v-header :seller="seller">hhhhh</v-header>
    <div class="tab border-1px">
<!--  <div class="tab-item">商品</div>
      <div class="tab-item">评价</div>
      <div class="tab-item">商家</div>-->

      <router-link to="/goods" class="tab-item">商品</router-link>
      <router-link to="/ratings" class="tab-item">评价</router-link>
      <router-link to="/seller" class="tab-item">商家</router-link>

    </div>
    <!--keep-alive保持三个模块切换的时候不会跳，避免重新渲染-->
    <keep-alive>
     <!-- <div class="content">content</div>    被router-view代替了-->
      <router-view :seller="seller">
        <!--内容-->
      </router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
  import header from './components/header/header.vue';
  import {urlParse} from './common/js/util.js';
  import axios from 'axios';

  const ERR_OK = 0;
  export default{
    data() {
      return {
        seller: {
          id: (() => {
            let queryParam = urlParse();
            // console.log(queryParam);
            return queryParam.id;
          })()
        }
      };
    },
    created() {
      axios.get('/api/seller?id=').then((res) => {
        // response = response.json();
        // console.log(response.data);
        var response = res.data;
        // console.log(response.errno);
        if (response.errno === ERR_OK){
          // console.log('ok');
          // this.seller = response.data;
          // 下列语句可以保存seller的id
          this.seller = Object.assign({}, this.seller, response.data);
          // console.log(this.seller.id);
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    components: {'v-header': header}
  };

</script>

<style rel="stylesheet/stylus" lang="stylus">
  @import './common/stylus/mixin.styl'

  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    // border-bottom: 1px solid rgba(7, 17, 27, 0.1)
    border-1px( rgba(7, 17, 27, 0.1))
    .tab-item
      flex: 1
      text-align: center
      display: block
      font-size: 14px
      color: rgb(77, 85, 93)
      &.active
          color: rgb(240, 20, 20)

</style>
