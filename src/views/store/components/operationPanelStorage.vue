<template>
  <div class="operationPanel-right-storage" style="display: none">
    <a-form layout="vertical" :model="formState" @finish="onFinish">
      <a-form-item label="商品名称：" name="name">
        <a-input v-model:value="formState.name" required />
      </a-form-item>
      <a-form-item label="商品重量（单位：kg）：" name="weight">
        <a-input v-model:value="formState.weight" />
      </a-form-item>
      <a-form-item label="商品保质期（单位：天）：" name="shelflife">
        <a-input v-model:value="formState.shelflife" />
      </a-form-item>
      <a-form-item label="商品生产日期：" name="production_date">
        <a-date-picker v-model:value="formState.production_date">
        </a-date-picker>
      </a-form-item>
      <a-form-item label="商品入库时间：" name="storage_time">
        <a-date-picker show-time v-model:value="formState.storage_time">
        </a-date-picker>
      </a-form-item>
      <a-form-item label="货架：" name="shelf_id">
        <a-cascader
          v-model:value="shelfOptionsValue"
          :options="shelfOptions"
          :display-render="displayRender"
          expand-trigger="hover"
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">添加商品</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { computed, ref, watch } from "vue";
import { addGoodsApi } from "@/api/goods";
import { message } from "ant-design-vue";
import { useStore } from "vuex";

export default {
  name: "operationPanelStorage",
  setup() {
    const store = useStore();
    // 入库表单字段
    const formState = ref({
      // 商品名称
      name: "",
      // 商品重量
      weight: "",
      // 商品保质期
      shelflife: "",
      // 商品生产日期
      production_date: "",
      // 商品入库时间
      storage_time: "",
      // 货架ID
      shelf_id: "",
      // 货架格子ID
      shelf_grid_id: "",
    });
    // 提交表单且数据验证成功后回调事件
    const onFinish = (values) => {
      // 将时间进行处理 处理为时间戳
      values.production_date = Math.floor(
        new Date(values.production_date).valueOf() / 1000
      );
      values.storage_time = Math.floor(
        new Date(values.storage_time).valueOf() / 1000
      );
      // 将货架格子ID添加进请求数据
      values.shelf_grid_id = formState.value.shelf_grid_id;
      console.log(values, "values2");
      console.log("shelfOptionsValue", shelfOptionsValue.value);
      // 商品入库
      addGoodsApi(values).then((data) => {
        console.log(data, "data");
        if (data.status === 200) {
          // 提示信息
          message.success(data.message);
          // 刷新商品列表
          store.dispatch("goods/getGoodsList");
          // 将表单内容清空
          formState.value = {
            name: "",
            weight: "",
            shelflife: "",
            production_date: "",
            storage_time: "",
            shelf_id: "",
            shelf_grid_id: "",
          };
        }
      });
    };

    // 货架列表
    const shelfList = computed(() => store.state.shelf.shelfList);
    // 选中的货架
    const shelfOptionsValue = ref(null);
    // 货架信息
    const shelfOptions = ref([]);
    // 监听货物的变化
    watch(
      () => shelfList.value,
      (value) => {
        shelfOptions.value = [];
        value.forEach((item) => {
          const obj = {
            value: item.id,
            label: item.name,
            children: [],
          };
          item.shelf_grid.forEach((item2) => {
            if (item.goods_id == null) {
              obj.children.push({
                value: item2.shelf_grid_id,
                label: `${item2.position.y + 1}层 ${item2.position.x + 1}行 ${
                  item2.position.z + 1
                }列(${item2.shelf_grid_id})`,
              });
            }
          });
          if (obj.children.length > 0) shelfOptions.value.push(obj);
        });
      }
    );

    const displayRender = ({ labels, selectedOptions }) => {
      if (selectedOptions.length > 0) {
        formState.value.shelf_id = selectedOptions[0].value;
        formState.value.shelf_grid_id = selectedOptions[1].value;
      }
      return labels.join(" / ");
    };

    return {
      formState,
      onFinish,
      shelfOptionsValue,
      shelfOptions,
      displayRender,
    };
  },
};
</script>

<style scoped lang="less">
.operationPanel-right-storage {
  /deep/ .ant-input {
    padding: 4px;
    background-color: #d1d5ed;
  }
  /deep/ .ant-calendar-picker {
    width: 239px;
  }
  /deep/ .ant-cascader-picker {
    background-color: #d1d5ed;
  }
}
</style>
