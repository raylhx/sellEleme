<template>
  <div class="ratingselect">
    <div class="rating-type">
      <span  @click="select(2,$event)" class="block all" :class="{'active':selectType === 2}">{{desc.all}}<span class="count" >{{ratings.length}}</span></span>
      <span  @click="select(0,$event)" class="block positive" :class="{'active':selectType === 0}">{{desc.positive}}<span class="count" >{{positivesNum.length}}</span></span>
      <span  @click="select(1,$event)" class="block negative" :class="{'active':selectType === 1}">{{desc.negative}}<span class="count" >{{negativesNum.length}}</span></span>
    </div>
    <div class="switch" :class="{'on':onlyContent}" @click="toggleContent">
      <i class="icon_check_circle"></i>
      <span class="text"> 只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // 定义常量，提高代码可读性：满意，不满意，全部
  const POISITVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;

  export default {
    props: {
      ratings: {
        type: Array,
        default() {
          return [];
        }
      },
      selectType: {
        // 这个属性是关于选择满意不满意和全部
        type: Number,
        default: ALL
      },
      onlyContent: {
        // 对应着： 是否只显示有内容的评价
        type: Boolean,
        default: false
      },
      desc: {
        // 描述的内容可以用参数来代替，因为两个地方的文字不一样，所以这个需要注意一下
        type: Object,
        default() {
          return {
            positive: '满意',
            negative: '不满意',
            all: '全部'
          };
        }
      }
    },
    methods: {
      select(type, event) {
        if (!event._constructed) {
          return;
        }
        // this.selectType = type;
        // 子组件需要向父组件传递消息，需在子组件中派发事件
        this.$emit('select', type);
      },
      toggleContent(event) {
        if (!event._constructed) {
          return;
        }
        this.$emit('toggle');
      }
    },
    computed: {
      positivesNum() {
        return this.ratings.filter((rating) => {
          return rating.rateType === POISITVE;
        });
      },
      negativesNum() {
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE;
        });
      }
    }
  };
</script>

<style rel="stylesheet/stylus" lang="stylus">
  @import "../../common/stylus/mixin.styl";
  .ratingselect
    .rating-type
      padding: 18px 0
      margin: 0 18px
      border-1px(rgba(7,17,27,0.2))
      font-size: 0px
      .block
        display: inline-block
        margin-right: 8px
        padding: 8px 12px
        text-align: center
        font-size: 12px
        line-height:16px
        color: rgb(77,85,93)
        border-radius: 1px
        .count
          font-size: 8px
          margin-left: 2px
        &.active
          color: #fff
      .all
        background-color: rgba(0,160,220,0.2)
        &.active
          background-color: rgb(0,160,220)
      .positive
        background-color: rgba(0,160,220,0.2)
        &.active
          background-color: rgb(0,160,220)
      .negative
        background-color: rgba(77,85,93,0.2)
        &.active
          background-color: rgb(77,85,93)
    .switch
      padding: 12px 18px
      line-height: 24px
      border-bottom: 1px solid rgba(7,17,27,0.2)
      color: rgb(147,153,159)
      font-size: 0
      &.on
       .icon_check_circle
          color: #00c850
      .icon_check_circle
        display: inline-block
        vertical-align: top
        margin-right: 4px
        font-size: 24px
      .text
        display: inline-block
        vertical-align: top
        font-size: 12px



</style>
