import { TEngine } from "@/utils/three";
import { lightsList } from "@/utils/three/TLinghts";
import { basicObjectList } from "@/utils/three/TBasicObject";
import cameraControls from "@/utils/three/CameraControls";
import TRaycaster from "@/utils/three/TRaycaster";
import Outline from "@/utils/three/TOutline";
import TDragControls from "@/utils/three/TDragControls";
import { shelfLocation } from "@/utils/modelLocation/shelfModelLocation";
import { useStore } from "vuex";
import { computed } from "vue";

let ThreeJS = null;
const useTEngine = (threeRef) => {
  // 实例化 ThreeJs
  const TE = new TEngine(threeRef);

  ThreeJS = TE;

  // 获取 store
  const store = useStore();

  // 货物列表数据
  const goodsList = computed(() => store.state.goods.goodsList);

  // 辅助工具
  // TE.addObject(...helperList);
  // 光源
  TE.addObject(...lightsList);
  // 基本网格模型
  TE.addObject(...basicObjectList);
  // 相机辅助
  // TE.addObject(new CameraHelper(TE.camera));

  // 相机控制器
  const TCameraControls = cameraControls(TE.renderer, TE.scene, TE.camera);
  // 添加相机控制器到渲染列表
  TE.addRenderAnim(TCameraControls.renderCamera);

  // 射线投射器(鼠标选中模型对象)
  const raycaster = TRaycaster(TE.dom, TE.renderer, TE.scene, TE.camera);

  // 轮廓线渲染
  const outline = Outline(TE.renderer, TE.scene, TE.camera);
  // 添加轮廓线到渲染列表
  TE.addRenderAnim(outline.renderOutline);

  // 拖放控制器
  const dragControls = TDragControls(TE.camera, TE.renderer);

  // 货架格子
  let shelfBaseObjects = [];
  // 拖放前的货架格子
  let beforeShelfBaseObjects = [];
  // 货物
  let goodsObjects = [];
  // 与射线相交的物体
  let intersectObjects = [];

  // 监听鼠标指针移动事件
  TE.renderer.domElement.addEventListener("pointermove", (event) => {
    // 获取与射线相交的物体
    intersectObjects = raycaster.updateIntersects(event);

    // 判断是否有与射线相交的模型
    if (intersectObjects.length > 0) {
      // 遍历相交的模型
      intersectObjects.forEach((intersect) => {
        // 判断是否是货架格子
        if (intersect?.object?.name.slice(0, 11) === "shelf_base_") {
          shelfBaseObjects.push(intersect);
        }
        // 判断是否是货物
        if (intersect?.object?.name === "goods") {
          goodsObjects.push(intersect);
        }
      });

      // 判断是否捕获到货架格子并且拖放控制器是否处于拖放状态
      if (shelfBaseObjects.length > 0 && dragControls.getDragState()) {
        // 清除之前被选中的货架格子的颜色
        beforeShelfBaseObjects.forEach((item) => {
          // 清除颜色
          item.object.material.emissive.set(0x000000);
        });
        // 清空之前被选中的货架格子
        beforeShelfBaseObjects = [];

        // 货架格子添加颜色
        // 只渲染第一个货架格子
        shelfBaseObjects[0].object.material.emissive.set(0x118ee9);
        // 保存被选中的货架格子
        beforeShelfBaseObjects.push(shelfBaseObjects[0]);
      } else {
        // 清除之前被选中的货架格子的颜色
        beforeShelfBaseObjects.forEach((item) => {
          // 清除颜色
          item.object.material.emissive.set(0x000000);
        });
      }
      // 清空货架格子列表
      shelfBaseObjects = [];

      // 判断是否捕获到货物
      if (goodsObjects.length > 0) {
        // 当前货物
        const selectedObject = goodsObjects[0].object;
        // 添加到描边列表
        outline.outlinePass.selectedObjects = [selectedObject];
        // 判断是否处于拖放状态
        if (!dragControls.getDragState()) {
          // 隐藏货物 Tag 标签
          store.commit("goods/changeGoodsTagShow", {
            all: true,
            tagShow: false,
          });
          // 显示货物 Tag 标签
          store.commit("goods/changeGoodsTagShow", {
            id: selectedObject.data.id,
            tagShow: true,
          });
          // 显示货物详情
          // goodsList.value.forEach((item, i) => {
          //   // 隐藏未选中的并显示选中的
          //   goodsList.value[i].tagShow = item.id === selectedObject.data.id;
          // });
        }
      } else {
        // 清除描边效果
        outline.outlinePass.selectedObjects = [];
        // 清空被拖放的物体
        dragControls.clearDragControlsObject();

        // 隐藏货物详情
        goodsList.value.forEach((item) => {
          // 隐藏货物 Tag 标签显示状态
          store.commit("goods/changeGoodsTagShow", {
            id: item.id,
            tagShow: false,
          });
        });
      }
      // 清空货物列表
      goodsObjects = [];
    } else {
      // 清除描边效果
      outline.outlinePass.selectedObjects = [];
      // 清空被拖放的物体
      dragControls.clearDragControlsObject();
    }
  });

  // 监听鼠标左键按下事件
  TE.renderer.domElement.addEventListener("mousedown", () => {
    const _goodsObjects = [];
    // 遍历相交的模型
    intersectObjects.forEach((intersect) => {
      // 判断是否是货物
      if (intersect?.object?.name === "goods") {
        // 判断是否处于拖放状态
        if (!dragControls.getDragState()) {
          // 显示货物 Tag 标签
          store.commit("goods/changeGoodsTagShow", {
            id: intersect.object.data.id,
            tagShow: true,
          });
        }
        _goodsObjects.push(intersect);
      }
    });
    // 判断是否捕获到货物
    if (_goodsObjects.length > 0) {
      // 当前货物
      const selectedObject = _goodsObjects[0].object;
      // 添加到可拖放列表
      dragControls.addDragControlsObject(selectedObject);
    }
  });

  // 开始拖拽时执行
  dragControls.addEventListener("dragstart", (event) => {
    if (dragControls.getCurrentDragControls().length <= 0) {
      // 克隆当前被拖拽的物体
      const object = event.object.clone();
      // 当前被拖放物体的自定义数据
      object.data = event.object.data;
      // 保存当前被拖放的物体
      dragControls.setCurrentDragControls(object);
    }

    // 设置拖放状态为正在拖放
    dragControls.setDragState(true);

    // 隐藏货物 Tag 标签
    store.commit("goods/changeGoodsTagShow", {
      id: intersectObjects[0].object.data.id,
      tagShow: false,
    });
  });

  // dragControls.addEventListener("drag", () => {});

  // 完成拖拽时执行
  dragControls.addEventListener("dragend", (event) => {
    // 设置拖放状态为未在拖放
    dragControls.setDragState(false);

    // 过滤鼠标指向的货架格子
    const shelfBaseMesh = intersectObjects.find(
      (item) => item.object.name.slice(0, 11) === "shelf_base_"
    );

    // 判断是否拖拽到货架格子
    if (shelfBaseMesh) {
      // 判断货架格子是否更改
      if (
        shelfBaseMesh.object.data.id ===
          dragControls.getCurrentDragControls().data.shelf_grid_id &&
        shelfBaseMesh.object.data.shelf_id ===
          dragControls.getCurrentDragControls().data.shelf_id
      ) {
        // 货架格子未进行更改
        console.log("货架格子未进行更改");
        // 货物位置还原
        event.object.position.set(
          dragControls.getCurrentDragControls().position.x,
          dragControls.getCurrentDragControls().position.y,
          dragControls.getCurrentDragControls().position.z
        );
        return;
      }

      // 生成新的货物列表
      const newGoodList = goodsList.value.map((item) => {
        if (
          item.shelf_id === event.object.data.shelf_id &&
          item.shelf_grid_id === event.object.data.shelf_grid_id
        ) {
          item.shelf_id = shelfBaseMesh.object.data.shelf_id;
          item.shelf_grid_id = shelfBaseMesh.object.data.id;
          return item;
        } else {
          return item;
        }
      });

      // 判断货物是否重叠
      if (
        newGoodList.filter(
          (item) =>
            item.shelf_id === event.object.data.shelf_id &&
            item.shelf_grid_id === event.object.data.shelf_grid_id
        ).length > 1
      ) {
        // 货物重叠
        console.log("货物重叠");

        // 物体闪烁
        event.object.material.emissive.set(0xff0000);
        setTimeout(() => {
          event.object.material.emissive.set(0x000000);
          setTimeout(() => {
            event.object.material.emissive.set(0xff0000);
            setTimeout(() => {
              event.object.material.emissive.set(0x000000);
              // 货物位置还原
              event.object.position.set(
                dragControls.getCurrentDragControls().position.x,
                dragControls.getCurrentDragControls().position.y,
                dragControls.getCurrentDragControls().position.z
              );
            }, 200);
          }, 200);
        }, 200);

        return;
      }
      // 更新数据
      store.commit("goods/changeGoods", newGoodList);
      // 更新货物数据
      event.object.data = {
        ...event.object.data,
        shelf_id: shelfBaseMesh.object.data.shelf_id,
        shelf_grid_id: shelfBaseMesh.object.data.id,
      };
      // 把货物放入货架格子
      event.object.position.set(
        shelfBaseMesh.object.parent.position.x +
          shelfLocation[shelfBaseMesh.object.data.id - 1].x,
        shelfBaseMesh.object.parent.position.y +
          shelfLocation[shelfBaseMesh.object.data.id - 1].y,
        shelfBaseMesh.object.parent.position.z +
          shelfLocation[shelfBaseMesh.object.data.id - 1].z
      );
    } else {
      // 还原货物位置
      event.object.position.set(
        dragControls.getCurrentDragControls().position.x,
        dragControls.getCurrentDragControls().position.y,
        dragControls.getCurrentDragControls().position.z
      );
    }
  });

  console.log("TE", TE);
  return TE;
};

export { useTEngine, ThreeJS };
