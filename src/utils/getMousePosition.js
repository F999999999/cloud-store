const getMousePosition = (event) => {
  const e = event || window.event;
  const scrollX =
    document.documentElement.scrollLeft || document.body.scrollLeft;
  const scrollY = document.documentElement.scrollTop || document.body.scrollTop;
  return {
    x: e.pageX || e.clientX + scrollX,
    y: e.pageY || e.clientY + scrollY,
  };
};

export default getMousePosition;
