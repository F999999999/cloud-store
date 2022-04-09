<template>
  <div class="operationPanel-storage" style="display: none">
    <a-form layout="vertical" :model="formState" @finish="onFinish">
      <a-form-item label="商品名称：" name="name">
        <a-input v-model:value="formState.name" required />
      </a-form-item>
      <a-form-item label="商品重量（单位：kg）：" name="weight">
        <a-input v-model:value="formState.weight" type="number" />
      </a-form-item>
      <a-form-item label="商品保质期（单位：天）：" name="shelflife">
        <a-input v-model:value="formState.shelflife" type="number" />
      </a-form-item>
      <a-form-item label="商品生产日期：" name="production_date">
        <a-date-picker v-model:value="formState.production_date">
        </a-date-picker>
      </a-form-item>
      <a-form-item label="商品入库时间：" name="storage_time">
        <a-date-picker show-time v-model:value="formState.storage_time">
        </a-date-picker>
      </a-form-item>
      <a-form-item label="存储位置：" name="position">
        <a-cascader
          v-model:value="shelfOptionsValue"
          :options="shelfOptions"
          :display-render="displayRender"
          expand-trigger="hover"
          placeholder="请选择"
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">商品入库</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import moment from "moment";

export default {
  name: "operationPanelStorage",
  props: {
    storeId: {
      type: Number,
      default: null,
    },
  },
  setup(props) {
    const store = useStore();
    // 入库表单字段
    const formState = ref({
      // 商品名称
      name: "",
      // 商品重量
      weight: null,
      // 商品保质期
      shelflife: null,
      // 商品生产日期
      production_date: null,
      // 商品入库时间
      storage_time: moment(),
      // 存储位置
      position: "",
      // 货架ID
      shelf_id: null,
      // 货架格子ID
      shelf_grid_id: null,
    });

    // 选中的货架
    const shelfOptionsValue = ref(null);
    // 货架信息
    const shelfOptions = computed(
      () => store.getters["shelf/getEmptyShelfGridList"]
    );

    // 选中位置后的回调事件
    const displayRender = ({ labels, selectedOptions }) => {
      console.log("selectedOptions", selectedOptions);
      if (selectedOptions.length > 0) {
        formState.value.shelf_id = selectedOptions[0].value;
        formState.value.shelf_grid_id = selectedOptions[1].value;
      }
      return labels.join(" / ");
    };

    // 更新入库时间
    const updateStorageTime = (date = new Date()) => {
      formState.value.storage_time = moment(date);
    };

    // 提交表单且数据验证成功后回调事件
    const onFinish = (values) => {
      // 清空当前选中的商品
      shelfOptionsValue.value = null;
      // 将时间进行处理 处理为时间戳
      values.production_date = Math.floor(
        new Date(values.production_date).valueOf() / 1000
      );
      values.storage_time = Math.floor(
        new Date(values.storage_time).valueOf() / 1000
      );
      // 添加商品
      store
        .dispatch("goods/addGoods", {
          storeId: props.storeId,
          name: values.name,
          weight: values.weight,
          shelflife: values.shelflife,
          productionDate: values.production_date,
          storageTime: values.storage_time,
          shelfId: formState.value.shelf_id,
          shelfGridId: formState.value.shelf_grid_id,
        })
        .then(() => {
          // 将表单内容清空
          formState.value = {
            name: "",
            weight: null,
            shelflife: null,
            production_date: null,
            storage_time: moment(),
            position: "",
            shelf_id: null,
            shelf_grid_id: null,
          };
        });
    };

    return {
      formState,
      onFinish,
      shelfOptionsValue,
      shelfOptions,
      displayRender,
      updateStorageTime,
    };
  },
};
</script>

<style scoped lang="less">
.operationPanel-storage {
  :deep(.ant-input) {
    padding: 4px;
  }
  :deep(.ant-calendar-picker) {
    width: 239px;
  }
}
</style>
