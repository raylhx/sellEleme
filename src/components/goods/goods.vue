<template>
<div>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul >
        <li v-for="(item,index) in goods" class="menu-item" :class="{'current': currentIndex === index}" @click="selectMenu(index,$event)">
          <span class="text border-1px" >
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}</span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="item in goods" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="food in item.foods" class="food-item border-1px" @click="select(food,$event)">
              <div class="icon">
                <img :src="food.icon" width="57px" height="57px">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol @add="addFood" :food="food" ></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!--使用ref给子组件传递-->
    <shopcart ref="shopcart" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice" :selectFood="selectFood"></shopcart>
  </div>
  <!--selectedFood是用来装载已经选好了的物品，跟selectFood不同-->
  <food :food="selectedFood" ref="food" @add="addFood"></food>

</div>
</template>

<script type="text/ecmascript-6">
  import axios from 'axios';
  import BScroll from 'better-scroll';
  import shopcart from '../shopcart/shopcart';
  import cartcontrol from '../cartcontrol/cartcontrol';
  import food from '../food/food';
  const ERR_OK = 0;
  export default{
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        goods: [],
        // 存放高度数值
        listHeight: [],
        // 滚动的Y坐标
        scrollY: 0,
        // 用来装载选中的食品，传递给food子组件，然后就会跳出详情页
        selectedFood: {}
      };
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];

      axios.get('/api/goods').then((res) => {
        let response = res.data;
        if (response.errno === ERR_OK) {
          this.goods = response.data;
          this.$nextTick(() => {
            this._initScroll();
            this._calculateHeight();
          });
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    computed: {
      currentIndex() {
        // console.log('advdsf');
        // console.log(this.listHeight.length);
        // 因为Y值实时更新，所以currentIndex也是动态变化计算的。
        for (let i = 0; i < this.listHeight.length; i++){
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            // console.log(i);
            return i;
          }
        }
        return 0;
      },
      selectFood() {
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count){
              foods.push(food);
            }
          });
        });
        return foods;
      }
    },
    methods: {
      _initScroll() {
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          //  是否派发click事件
          click: true
        });
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          click: true,
          probeType: 3
        });

        this.foodsScroll.on('scroll', (pos) => {
          // 向上滚动的时候scrollY是正值，向下滚动的时候是负值，所以利用abs函数取得正值
          this.scrollY = Math.abs(Math.round(pos.y));
          // console.log(this.scrollY);
        });
      },
      _calculateHeight() {
        // 拿到区块的高度,注意这个是一个数组,在后面for循环中
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        // 定义一个临时变量存放高度
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++){
          let item = foodList[i];
          // console.log(item.clientHeight); item是每个区块的高度
          height += item.clientHeight;
          this.listHeight.push(height);
          // console.log(this.listHeight);
        }
      },
      selectMenu(index, event) {
        // 加上这个判断条件是因为在PC端的浏览器上，点击menu的时候会调用两次事件，使用这个方法可以让手机端和PC端统一
        if (!event._constructed){
          return;
        }
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let el = foodList[index];
        this.foodsScroll.scrollToElement(el, 300);
        // console.log(index);
      },
      addFood(target) {
        // 在子组件cartcontrol中使用$emit(xxx)派发事件，在组件cartcontrol上使用@xxx接受传递的对象
        this._drop(target);
      },
      _drop(target) {
        // 访问子组件使用this.$refs,并且调用子组件的drop方法
        // console.log('_drop');
        this.$nextTick(() => {
          this.$refs.shopcart.drop(target);
        });
      },
      select(food, event) {
        // console.log('ok');
        if (!event._constructed) {
          return;
        }
        this.selectedFood = food;
        // 在父组件中拿到了子组件的show方法，使用ref绑定
        this.$refs.food.show();
      }
    },
    components: {
      shopcart,
      cartcontrol,
      food
    }
  };
</script>

<style rel="stylesheet/stylus" lang="stylus">
  @import "../../common/stylus/mixin.styl";

  .goods
    display: flex
    position: absolute
    top: 174px
    bottom: 46px
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background-color: #f3f5f7
      .menu-item
        display: table
        width: 56px
        height: 54px
        line-height: 14px
        padding: 0 12px
        &.current
          position: relative
          z-idnex: 1
          margin-top: -1px
          font-weight: 700
          background-color: #fff
          .text
            border-none()
        .icon
          display: inline-block
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
          &.guarantee
            bg-image('guarantee_3')
        .text
          display: table-cell
          vertical-align: middle
          font-size: 14px
          border-1px(rgba(7,17,27,0.1))
    .foods-wrapper
      flex: 1
      .food-list
        .title
          padding: 0 14px
          height: 26px
          border-left: 2px solid #d9dde1
          font-size: 12px
          line-height: 26px
          color: rgb(147,153,159)
          background-color: #f3f5f7
        .food-item
          display: flex
          margin: 18px
          padding-bottom: 18px
          border-1px(rgba(7,17,27,0.1))
          &:last-child
            border-none()
            border-bottom: 0px
        .icon
          flex: 0 0 57px
          margin-right: 8px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            font-size: 14px
            height: 14px
            line-height: 14px
            color: rgb(7,17,27)
          .desc
            margin-bottom: 8px
            font-size: 10px
            line-height: 12px
            color: rgb(147,153,159)
          .extra
            font-size: 10px
            line-height: 10px
            color: rgb(147,153,159)
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240,20,20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147,153,159)
          .cartcontrol-wrapper
            position: absolute
            right: 0px
            bottom: 12px

</style>
