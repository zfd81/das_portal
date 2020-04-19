let keepTwo = value => {
  // 截取当前数据到小数点后三位
  const tempVal = Number(value).toFixed(3);
  if (tempVal === "NaN") {
    return "0.00";
  }
  const realVal = tempVal.substring(0, tempVal.length - 1);
  return realVal;
};

export { keepTwo };
