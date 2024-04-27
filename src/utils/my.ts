import {listCategory} from "@/api/course/Open";
import {ComponentPublicInstance} from "@vue/runtime-core";

export const sleep=(ms: number) =>{
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 获取分类数据
export const getCategory = async (proxy:ComponentPublicInstance | null) => {
  const categoryList = ref([])
  const useCacheCategory = (list: any) => {
    console.log("categoryList将使用local缓存")
    //直接使用
    categoryList.value = list;
  }
  const reloadCacheCategory = async () => {
    //获取分类列表
    const resCategory = await listCategory();
    categoryList.value = proxy?.handleTree(resCategory, 'id', 'parentid');
    //更新缓存
    console.log("categoryList缓存过期，将查询后更新")
    proxy?.$cache.local.setJSON("categoryList", categoryList.value);
    proxy?.$cache.local.setTTL("categoryListTTL", 60 * 60 * 1000);
  }

  //先查询缓存，未过期
  if (proxy?.$cache.local.getTTL("categoryListTTL")) {
    let list = proxy?.$cache.local.getJSON('categoryList');
    if (list == null || list.length == 0) {
      //但是缓存无效
      await reloadCacheCategory();
    } else {
      useCacheCategory(list);
    }
  } else {
    //缓存过期
    await reloadCacheCategory();
  }
  return categoryList.value;
}

// 通过分类的id获取分类的name
export const showCategoryById = (categoryList:any[], mt: number, st: number | undefined = undefined, mode:number = 0) : any => {
  let res = {
    'mt': '',
    'st': ''
  }
  for (let category of categoryList) {
    if (category['id'] == mt) {
      res.mt = category['name'];
      if (st != undefined){
        for (let c of category['children']) {
          if (c['id'] == st) {
            res.st = c['name']
            break;
          }
        }
      }
      break;
    }
  }
  // console.log(res)
  switch (mode) {
    case 0:return res;//返回{}
    case 1:return res.mt+" - "+res.st;//返回mt-st
    case 2:return res.mt;//返回mt
    case 3:return res.st;//返回st
  }

}
