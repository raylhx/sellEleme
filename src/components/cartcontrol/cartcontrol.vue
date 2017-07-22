<template>
<div class="cartcontrol">
  <transition name="move">
    <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart($event)">
      <span class="inner icon_remove_circle_outline"></span>
    </div>
  </transition>

<div class="cart-count" v-show="food.count>0">{{food.count}}</div>
<div class="cart-add icon_add_circle" @click.stop.prevent="addCart($event)"></div>
</div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';

  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      addCart(event) {
        if (!event._constructed){
          return;
        }
        // console.log('clickaaa');
        if (!this.food.count){
          // this.food.count = 1;
          // 使用vue的set方法，创建属性
          Vue.set(this.food, 'count', 1);
        } else {
          this.food.count++;
        }
        // console.log(event.target);
        this.$emit('add', event.target);
      },
      decreaseCart(event) {
        if (!event._constructed){
          return;
        }

        if (this.food.count){
          this.food.count--;
        }
      }
    }

  };
</script>

<style rel="stylesheet/stylus" lang="stylus">
  .cartcontrol
    font-size: 0px
    .cart-decrease
      display: inline-block
      padding: 6px
      opacity: 1px
      transform: translate3d(0,0,0)
      .inner
        display: inline-block
        line-height: 24px
        font-size: 24px
        color: rgb(0,160,220)
        transition: all 0.4s linear
        transform: rotate(0)
      &.move-enter-active, &.move-leave-active
        transition: all 0.4s linear
      &.move-enter, &.move-leave-active
        opacity: 0
        transform: translate3d(24px,0,0)
        .inner
          transform: rotate(180deg)
    .cart-count
      display: inline-block
      vertical-align: top
      width: 12px
      padding-top: 6px
      font-size: 10px
      line-height: 24px
      text-align: center
      color: rgb(147,153,159)
    .cart-add
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color: rgb(0,160,220)


</style>
