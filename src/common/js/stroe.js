/**
 * Created by Ray on 2017/6/5.
 */
// 存取两个函数
// 此函数通用
export function SaveToLocal(id, key, val) {
  // 双下划线   localStorage.__seller__用来存放
  let seller = window.localStorage.__seller__;
  if (!seller) {
    // 如果seller不存的话
    seller = {};
    // seller.id是一个单独的对象
    seller[id] = {};
  } else {
    seller = JSON.parse(seller);
    // seller的不同的id，如果新的id，就需要保存，那就的初始化为一个对象
    if (!seller[id]) {
      seller[id] = {};
    }
  }
  seller[id][key] = val;
  localStorage.__seller__ = JSON.stringify(seller);
};
// def 是默认值
export function LoadFromLocal(id, key, def) {
  let seller = window.localStorage.__seller__;
  if (!seller) {
    return def;
  }
  seller = JSON.parse(seller)[id];
  if (!seller) {
    return def;
  }
  let ret = seller[key];
  return ret || def;
};
