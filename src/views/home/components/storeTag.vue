<template>
  <li class="box">
    <div>
      <div class="box_context">
        <h3>仓库A</h3>
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
      <img src="@/assets/image/02.jpg" alt="" />
    </div>
  </li>
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
  },
};
</script>

<style lang="less" scoped>
.box {
  position: relative;
  .box_context {
    width: 358px;
    height: 213px;
    position: absolute;
    //top: 14%;
    margin-top: 18px;
    .box_context_p1 {
      position: absolute;
      top: 20%;
      left: 10%;
      span {
        position: absolute;
        top: 160%;
        left: 95%;
      }
    }
    h3 {
      position: absolute;
      top: 0;
      left: 37%;
      color: #00ffff;
    }
  }
  /*字体颜色大小*/
  .box_context {
    p {
      font-size: 12px;
      color: #4f7399;
    }
    span {
      color: #fff;
      font-size: 28px;
      font-weight: bolder;
    }
    .box_context_p2 {
      position: absolute;
      top: 52%;
      left: 10%;
    }
    .box_context_p2 span {
      position: absolute;
      top: 160%;
      left: 115%;
    }
  }
}
</style>
