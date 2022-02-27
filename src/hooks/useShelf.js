export const useShelf = () => {
  // 货物数据
  let shelfList = [
    {
      id: 1,
      name: "shelf1",
      position: { x: 0, y: 0, z: 0 },
    },
    {
      id: 2,
      name: "shelf2",
      position: { x: 1, y: 0, z: 0 },
    },
    {
      id: 3,
      name: "shelf3",
      position: { x: 2, y: 0, z: 0 },
    },
    {
      id: 4,
      name: "shelf4",
      position: { x: 1, y: 0, z: 1 },
    },
  ];

  // 获取货物数据
  // const getShelf = () => {
  //   getShelfApi().then((res) => {
  //     if (res.status === 200) {
  //       shelfList = res.data;
  //     }
  //   });
  // };

  return { shelfList };
};
