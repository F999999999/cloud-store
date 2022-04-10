<template>
  <div class="box">
    <div class="box_context">
      <h3>{{ store_name }}</h3>
      <div class="box_context_p1">
        <p>货位总量</p>
        <span>{{ storeTotal }}</span>
      </div>
      <div class="box_context_p2">
        <p>已使用</p>
        <span>{{ useGoods }}</span>
      </div>
    </div>
    <progress-ball
      :ballId="'ball' + id"
      :storeTotal="storeTotal"
      :useGoods="useGoods"
    />
    <img src="@/assets/image/box2_bg.png" alt="" />
  </div>
</template>

<script>
import ProgressBall from "@/views/home/components/progressBall";
export default {
  components: { ProgressBall },
  props: {
    id: {
      type: Number,
      default: 0,
    },
    storeTotal: {
      type: Number,
      default: 0,
    },
    useGoods: {
      type: Number,
      default: 0,
    },
    store_name: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="less" scoped>
.box {
  position: relative;
  width: 100%;
  /*字体颜色大小*/
  .box_context {
    position: absolute;
    margin-top: 18px;
    width: 100%;
    height: 100%;
    text-align: center;
    .box_context_p1 {
      position: absolute;
      top: 20%;
      left: 10%;
      span {
        position: absolute;
        top: 2rem;
        left: 3rem;
      }
    }
    .box_context_p2 {
      position: absolute;
      top: 58%;
      left: 10%;
      span {
        position: absolute;
        top: 1.6rem;
        left: 3.5rem;
      }
    }
    h3 {
      font-size: 1rem;
      color: #00ffff;
    }
    p {
      font-size: 1rem;
      color: #4f7399;
    }
    span {
      color: #fff;
      font-size: 1.5rem;
      font-weight: bolder;
    }
  }
  img {
    width: 100%;
  }
}
</style>
