<template>
  <transition name="quickmove">
    <div class="food" v-show="showFlag" ref="food">
      <div class="food-content">
        <!--大图片-->
        <div class="image-header">
          <img :src="food.image">
          <div class="back" @click="hide">
            <i class="icon_arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="name">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span><span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcotrol-wrapper">
            <cartcontrol @add="addFood" :food="food"></cartcontrol>
          </div>
          <transition name="fade">
            <div @click.stop.prevent="addFirst" class="buy" v-show="!food.count || food.count === 0">
              加入购物车
            </div>
          </transition>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品介绍</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect  @select="selectRating" @toggle="toggleContent" :selectType="selectType" :desc="desc" :onlyContent="onlyContent" :ratings="food.ratings"></ratingselect>
          <div class="rating-wrapper">
            <!--循环遍历食品的评价并且判断长度是否为0-->
            <ul v-show="food.ratings && food.ratings.length">
              <li class="rating-item border-1px" v-for="rating in food.ratings" v-show="needShow(rating.rateType,rating.text)">
                <div class="userInfo">
                  <span class="username">{{rating.username}}</span>
                  <img class="avatar" :src="rating.avatar" width="12" height="12">
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <i :class="{'icon_thumb_up':rating.rateType===0,'icon_thumb_down':rating.rateType===1}"></i>
                  {{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!(food.ratings && food.ratings.length)">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>

</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import cartcontrol from '../cartcontrol/cartcontrol';
  import ratingselect from '../ratingselect/ratingselect';
  import split from '../split/split';
  import Vue from 'vue';
  import {formatDate} from '../../common/js/data';
  // 定义常量，提高代码可读性：满意，不满意，全部
  // const POISITVE = 0;
  // const NEGATIVE = 1;
  const ALL = 2;
  export default {
    props: {
      // 用来接收选中的食品信息
      food: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false,
        selectType: ALL,
        desc: {
          positive: '推荐',
          negative: '吐槽',
          all: '全部'
        },
        onlyContent: true
      };
    },
    methods: {
      show() {
        // 这个方法供父组件调用，父组件能够调用子组件的方法，但是子组件不能够调用父组件的方法
        this.showFlag = true;
        this.selectType = ALL;
        this.onlyContent = false;
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.food, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      hide() {
        this.showFlag = false;
      },
      addFirst(event) {
        if (!event._constructed) {
          return;
        }
        this.$emit('add', event.target);
        // Vue 不允许在已经创建的实例上动态添加新的根级响应式属性(root-level reactive property)。
        // 然而它可以使用 Vue.set(object, key, value) 方法将响应属性添加到嵌套的对象上：
        Vue.set(this.food, 'count', 1);
      },
      addFood(target) {
        // 此处有疑问
        // 在版本2中需要调用方法addFood方法才能够实现动画效果
        this.$emit('add', target);
      },
      needShow(type, text) {
        // 如果只显示内容，但是实际评论没内容的话，就返回false，不显示
        if (this.onlyContent && !text) {
          return false;
        }
        // 如果选择了全部显示的话就直接返回true
        if (this.selectType === ALL) {
          return true;
        } else {
          return type === this.selectType;
        }
      },
      // vue2版本中，使用绑定方法来接受
      selectRating(type) {
        this.selectType = type;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      toggleContent() {
        this.onlyContent = !this.onlyContent;
        // 及时属性，避免高度出现变化
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      }
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    components: {
      cartcontrol,
      split,
      ratingselect
    }
  };
</script>

<style rel="stylesheet/stylus" lang="stylus">
  @import "../../common/stylus/mixin.styl";

  .food
    position: fixed
    top: 0
    left: 0
    bottom: 48px
    z-index: 1
    width: 100%
    background-color: #fff
    transform: translate3d(0, 0, 0)
    &.quickmove-enter-active, &.quickmove-leave-active
      transition: all 0.2s linear
    &.quickmove-enter, &.quickmove-leave-active
      transform: translate3d(100%, 0, 0)
    .image-header
      position: relative
      width: 100%
      height: 0
      padding-top: 100%
      img
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
      .back
        position: absolute
        top: 10px
        left: 5px
        .icon_arrow_lift
          display: block
          padding: 10px
          font-size: 20px
          color: #fff
    .content
      position: relative
      padding: 18px
      .name
        line-height: 14px
        margin-bottom: 8px
        font-size: 14px
        font-weight: 700
        colot: rgb(7,17,27)
      .detail
        height: 10px
        margin-bottom: 18px
        line-height: 10px
        font-size: 10px
        color: rgb(147,153,159)
        .sell-count
          margin-right: 12px
      .price
        margin-bottom: 18px
        .now
          font-size: 14px
          font-weight: 700
          line-height: 24px
          color: rgb(240,20,20)
          margin-right: 12px
        .old
          font-size: 10px
          font-weight: normal
          line-height:24px
          color: rgb(147,153,159)
          text-decoration: line-through
      .cartcotrol-wrapper
        position: absolute
        right: 12px
        bottom: 12px
      .buy
        position: absolute
        right: 18px
        bottom: 18px
        height: 24px
        z-index: 2
        line-height: 24px
        box-sizing: border-box
        border-radius: 12px
        padding: 0 12px
        font-size: 10px
        color: #fff
        background-color: rgb(0,160,220)
        opacity: 1
        &.fade-enter-acitve,&.fade-leave-active
          transition: all 0.5s
        &.fade-enter,&.fade-leave-active
          opacity: 0
          z-index: -1
    .info
      padding: 18px
      .title
        line-height: 14px
        font-size: 14px
        color: rgb(7,17,27)
        margin-bottom: 6px
      .text
        padding: 0 8px
        font-size: 12px
        line-height: 24px
        font-weight: 200
        color: rgb(77,85,93)
        margin-bottom: 18px
    .rating
      padding-top: 18px
      .title
        margin-left: 18px
        line-height: 14px
        font-size: 14px
        color: rgb(7,17,27)
        margin-bottom: 6px
      .rating-wrapper
        padding: 0 18px
        .rating-item
          position: relative
          padding: 16px 0
          border-1px(rgba(7,17,27,0.1))
          .userInfo
            position: absolute
            right: 0px
            top: 16px
            font-size: 0
            .username
              display: inline-block
              margin-right: 6px
              vertical-align: top
              line-height: 12px
              font-size: 10px
            .avatar
              border-radius: 50%
          .time
            margin-bottom: 6px
            line-height: 12px
            font-size: 10px
            color: rgb(7,17,27)
          .text
            line-height: 16px
            font-size: 12px
            color: rgb(7,17,27)
            .icon_thumb_up
              margin-right: 4px
              line-height: 16px
              color: rgb(0,160,220)
            .icon_thumb_down
              margin-right: 4px
              line-height: 24px
              color: rgb(147,153,159)
        .no-rating
          padding: 16px 0
          font-size: 12px
          color: rgb(7,17,27)





</style>
