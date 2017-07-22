<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家 {{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingselect  @select="selectRating" @toggle="toggleContent" :selectType="selectType"  :onlyContent="onlyContent" :ratings="ratings"></ratingselect>
      <div class="rating-wrapper">
        <ul>
          <li v-for="rating in ratings" class="rating-item" v-show="needShow(rating.rateType,rating.text)">
            <div class="avatar">
              <img :src="rating.avatar" width="28" height="28">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <div class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</div>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                <i class="icon_thumb_up"></i>
                <span class="item" v-for="item in rating.recommend">
                  {{item}}
                </span>
              </div>
              <div class="time">
                {{rating.rateTime | formatDate}}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from '../star/star';
  import split from '../split/split';
  import BScroll from 'better-scroll';
  import ratingselect from '../ratingselect/ratingselect';
  import axios from 'axios';
  import {formatDate} from '../../common/js/data';
  const ALL = 2;
  const ERR_OK = 0;
  export default{
    props: {
      // 在APP.vue中已经传递好了seller
      seller: {
        type: Object
      }
    },
    data() {
      return {
        selectType: ALL,
        onlyContent: false,
        ratings: []
      };
    },
    created() {
      axios.get('/api/ratings').then((res) => {
        let response = res.data;
        if (response.errno === ERR_OK) {
          this.ratings = response.data;
          this.$nextTick(() => {
            this.scroll = new BScroll(this.$refs.ratings, {
              click: true
            });
          });
        }
      }).catch((error) => {
        console.log('ERROR: ' + error);
      });
    },
    methods: {
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
      selectRating(type) {
        this.selectType = type;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      toggleContent() {
        this.onlyContent = !this.onlyContent;
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
      star,
      split,
      ratingselect,
      formatDate
    }
  };
</script>

<style rel="stylesheet/stylus" lang="stylus">
  @import "../../common/stylus/mixin.styl";

  .ratings
    position: absolute
    top: 174px
    bottom: 0
    left: 0
    width: 100%
    overflow: hidden
    .overview
      display: flex
      padding: 18px 0
      .overview-left
        flex: 0 0 137px
        padding: 6px 0
        width: 137px
        border-right: 1px solid rgba(7,17,27,0.1)
        text-align: center
        @media only screen and (max-width: 320px)
          flex: 0 0 120px
          width: 120px
        .score
          margin-bottom: 6px
          line-height: 28px
          font-size: 24px
          color: rgb(255,153,0)
        .title
          margin-bottom: 8px
          line-height: 12px
          font-size: 12px
          color: rgb(7,17,27)
        .rank
          line-heigt: 10px
          font-size: 10px
          color: rgb(147,153,159)
      .overview-right
        flex: 1
        padding: 6px 0 6px 24px
        @media only screen and (max-width: 320px)
          padding-left: 6px
        .score-wrapper
          margin-bottom: 8px
          font-size: 0px
          .title
            display: inline-block
            vertical-align: top
            margin-right: 12px
            line-height: 18px
            font-size: 12px
            color: rgb(7,17,27)
          .star
            display: inline-block
            vertical-align: top
            margin-right: 12px
          .score
            display: inline-block
            vertical-align: top
            line-height: 18px
            font-size:12px
            color: rgb(255,153,0)
        .delivery-wrapper
          font-size: 0px
          .title
            display: inline-block
            margin-right: 12px
            line-height: 18px
            font-size: 12px
            color: rgb(7,17,27)
          .delivery
            display: inline-block
            line-height: 18px
            font-size: 12px
            color: rgb(147,153,159)
    .rating-wrapper
      padding: 0 18px
      .rating-item
        display: flex
        padding: 18px 0
        border-1px(rgba(7,17,27,.01))
        .avatar
          flex: 0 0 28px
          margin-right: 12px
          width: 28px
          height: 28px
          img
            border-radius: 50%
        .content
          position: relative
          flex: 1
          .name
            margin-bottom: 4px
            line-height: 12px
            font-size: 10px
            color: rgb(7,17,27)
          .star-wrapper
            margin-bottom: 6px
            line-height: 12px
            font-size: 0
            .star
              display: inline-block
              vertical-align: top
              margin-right: 6px
            .delivery
              display: inline-block
              vertical-align: top
              font-size: 10px
              font-weight: 200
              color: rgb(147,153,159)
          .text
            margin-botto: 8px
            line-height: 18px
            font-size: 12px
            color: rgb(7,17,27)
          .recommend
            font-size: 0px
            .icon_thumb_up
              display: inline-block
              margin: 0 8px 4px 0
              line-height: 16px
              font-size: 9px
              color: rgb(0,160,220)
            .item
              display: inline-block
              text-align: center
              margin: 0 8px 4px 0
              padding: 0 6px
              line-height: 16px
              font-size: 9px
              color: rgb(147,153,159)
              background-color: #fff
              border: 1px solid rgba(7,17,27,0.1)
              border-radius: 2px
          .time
            position: absolute
            top: 0px
            right: 0px
            line-height: 12px
            font-size: 10px
            font-weight: 200
            color: rgb(147,153,159)







</style>
