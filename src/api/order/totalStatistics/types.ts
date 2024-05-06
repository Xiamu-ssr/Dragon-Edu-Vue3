export interface TotalStatisticsVo {
  orderNum: number;
  orderThisWeek: number;
  revenue: number;
  revenueGrowRate: number;
  courseNum: number;
  teachplanNum: number;
  discussNum: number;
  discussAvg: number;
  currentOrders: CurrentOrdersVo[];
  saleData: SaleDataEchartsVo;
  bestCourse:BestCourseVo[];
}

export interface CurrentOrdersVo{
  courseId: number;
  courseName: string;
  pic: string;
  price: number;
}

export interface SaleDataEchartsVo{
  xAxis: string[];
  saleNum: number[];
  saleMoney: number[];
  //每门课的平均价格（盈利）-前端自己算
  saleAvg: number[];
  //盈利增长率-前端自己算
  saleGrowRate: number[];
}
export interface BestCourseVo{
  courseName: string;
  star: number;
}
