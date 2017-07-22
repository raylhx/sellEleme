<template>
<div>
  <div class="shopcart">
    <div class="content" @click="toggleList">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight': totalCount>0}">
            <i class="icon_shopping_cart" :class="{'iconHighlight': totalCount>0}"></i>
          </div>
          <div class="num" v-show="totalCount>0">
            {{totalCount}}
          </div>
        </div>
        <div class="price" :class="{'textHighlight':totalPrice>0}">￥ {{totalPrice}}</div>
        <div class="desc">另需配送费￥{{deliveryPrice}} 元</div>
      </div>
      <div class="content-right" @click.stop.prevent="pay">
        <div class="pay" :class="payClass">
          {{payDesc}}
        </div>
      </div>
    </div>
    <div class="ball-container">
      <div v-for="ball in balls" >
        <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
          <div class="ball" v-show="ball.show">
            <div class="inner inner-hook"></div>
          </div>
        </transition>
      </div>

    </div>
    <transition name="fold">
      <div class="shopcart-list" v-show="listShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty">清空</span>
        </div>
        <div class="list-content" ref="listContent">
          <ul>
            <li class="food" v-for="food in selectFood">
              <span class="name">{{food.name}}</span>
              <div class="price">
                <span>￥{{food.price*food.count}}</span>
              </div>
              <div class="cartcontrol-wrapper">
                <cartcontrol @add="addFood" :food="food"></cartcontrol>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
  <transition name="fade">
    <div class="list-mask" v-show="listShow" @click="hideList"></div>
  </transition>
</div>
</template>

<script type="text/ecmascript-6">
  import cartcontrol from '../cartcontrol/cartcontrol';
  import BScroll from 'better-scroll';
  export default {
    data() {
      return {
        // balls用来维护小球的状态
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        // 保存下落后的小球
        dropBalls: [],
        // 为true是折叠的意思
        fold: true
      };
    },
    props: {
      selectFood: {
        type: Array,
        default(){
          return [];
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    computed: {
      totalPrice() {
        // 所选商品的总和
        let total = 0;
        this.selectFood.forEach((food) => {
          total += food.price * food.count;
        });
        return total;
      },
      totalCount() {
        // 所选商品的总数量
        let count = 0;
        this.selectFood.forEach((food) => {
          count += food.count;
        });
        return count;
      },
      payDesc() {
        if (this.totalPrice === 0){
          return `满￥${this.minPrice}起送`;
        } else if (this.totalPrice < this.minPrice){
          let diff = this.minPrice - this.totalPrice;
          return `还差￥${diff}元起送`;
        } else {
          return `去结算`;
        }
      },
      payClass() {
        if (this.totalPrice < this.minPrice){
          return 'noenough';
        } else {
          return 'enough';
        }
      },
      listShow() {
        // 先判断totalCount是否为0，如果为0，则折叠起来，返回FALSE让该区块不显示
        if (!this.totalCount) {
          this.fold = true;
          return false;
        }
        let isShow = !this.fold;
        if (isShow) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          });
        }
        return isShow;
      }
    },
    methods: {
      drop(el) {
        // 从所有的小球中找到一个隐藏的小球，一旦找到就跳出循环s
        for (let i = 0; i < this.balls.length; i++){
          let ball = this.balls[i];
          if (!ball.show){
            // 设置为true的话，就能够触发一个动画
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      addFood(target){
        this.drop(target);
      },
      beforeDrop(el) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            // getBoundingClientRect返回一个矩形对象，包含四个属性：left、top、right和bottom。
            // 分别表示元素各边与页面上边和左边的距离
            let rect = ball.el.getBoundingClientRect();
            // console.log(rect);
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            // 初始化
            el.style.display = '';
            // Y轴的动画
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            // x轴的动画
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
      dropping(el, done) {
        /*  eslint-disable no-unused-vars */
        // 主动触发浏览器重绘  rf变量不适用但是需要声明
        let rf = el.offsetHeight;
        this.$nextTick(() => {
          // el.style.display = '';
          // 重置样式， 在没有变量的情况下，不能使用``
          // Y轴的动画
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          // x轴的动画
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
          el.addEventListener('transitionend', done);
        });
      },
      afterDrop(el) {
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      },
      toggleList() {
        // 使用这个函数可以改变fold状态
        // 如果数量是空的话，就返回无动作，如果不为0的话则是跳过这一步，发生动作
        if (!this.totalCount) {
          return;
        }
        this.fold = !this.fold;
      },
      empty() {
        this.selectFood.forEach((food) => {
          food.count = 0;
        });
      },
      hideList() {
        // 点击黑色的背景的时候回折叠收好
        this.fold = true;
      },
      pay() {
        if (this.totalPrice < this.minPrice) {
          return;
        }
        window.alert(`确认付款${this.totalPrice}元 ?`);
      }
    },
    components: {
      cartcontrol
    }
  };
</script>

<style rel="stylesheet/stylus" lang="stylus">
  @import "../../common/stylus/mixin.styl";

  .shopcart
    position: fixed
    left:0
    bottom: 0
    z-index:4
    width: 100%
    height: 48px
    .content
      display: flex
      background-color: #141d27
      .content-left
        flex: 1
        font-size: 0
        .logo-wrapper
          display: inline-block
          vertical-align: top
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          box-sizing: border-box
          width: 56px
          height: 56px
          border-radius: 50%
          background-color: #141d27
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
            background-color: #2b343c
            &.highlight
              background-color: rgb(0,160,220)
            .icon_shopping_cart
              line-height: 44px
              font-size: 24px
              font-weight: 700
              color: #80858a
              &.iconHighlight
                color: #fff
          .num
            position: absolute
            top: 0px
            // left: 32px
            right: 0
            width: 24px
            height: 16px
            font-size: 9px
            font-weight: 700
            line-height: 16px
            text-align: center
            border-radius: 6px
            color: #fff
            background-color: rgb(240,20,20)
            box-shadow: 0px 4px 2px 0px rgba(0,0,0,0.4)
        .price
          display: inline-block
          vertical-align: top
          font-size: 16px
          line-height: 24px
          font-weight: 700
          color: rgba(255,255,255,0.4)
          box-sizing: border-box
          margin-top: 12px
          padding-right: 12px
          border-right: 1px solid rgba(255,255,255,0.1)
          &.textHighlight
            color: #fff
        .desc
          display: inline-block
          vertical-align: top
          font-size: 10px
          line-height: 24px
          color: rgba(255,255,255,0.4)
          margin: 12px 12px

      .content-right
        flex: 0 0 105
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          // margin: 0 8px
          color: rgba(255,255,255,0.4)
          font-size: 12px
          font-weight: 700
          &.noenough
           background-color: #2b333b
          &.enough
           background-color: #00b43c
           color: #fff
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: -1
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background-color: rgb(0,160,220)
          transition: all 0.4s linear
    .shopcart-list
      position: absolute
      left: 0
      top: 0
      z-index: -3
      width: 100%
      background-color: #fff
      transform: translate3d(0,-100%,0)
      &.fold-enter-active,&.fold-leave-active
        transition: all 0.5s
      &.fold-enter,&.fold-leave-active
        transform: translate3d(0,0,0)
      .list-header
        height: 40px
        line-height: 40px
        background-color: #f3f5f7
        padding: 0 18px
        border-bottom: 2px solid rgba(7,17,27,0.1)
        font-size: 0
        .title
          display: inline-block
          float: left
          font-size: 14px
          font-weight: 200
          color: rgb(7,17,27)
        .empty
          display: inline-block
          float: right
          font-size: 12px
          font-weight: 200
          color:rgb(0,160,220)
      .list-content
        padding: 0 18px
        max-height: 217px
        overflow: hidden
        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          border-1px(rgba(7,17,27,0.1))
          .name
            font-size: 14px
            line-height: 24px
            color: rgb(7,17,27)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240,20,20)
          .cartcontrol-wrapper
            position: absolute
            right: 0px
            bottom: 6px
  .list-mask
    position: fixed
    top: 0px
    left: 0px
    z-index: 2
    width: 100%
    height: 100%
    backdrop-filter: blur(10px)
    opacity: 1
    background-color: rgba(7,17,27,0.6)
    &.fade-enter-active,&.fade-leave-active
      transition: all 0.5s
    &.fade-enter,&.fade-leave-active
      opacity: 0
      background-color: rgba(7,17,27,0)



</style>
