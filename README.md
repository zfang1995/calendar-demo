# calendar-demo
线上运行效果：https://zfang1995.github.io/calendar-demo/
## 主要功能
 * 展示日历
 * 展示特定日期中的事件
 * 转跳到特定的日期
 * 在周视图和月视图间切换
## 技术栈
  * vue.js
  * swiper
  * moment.js
## 实现思路
  1. 为日期建立javascript对象模型。
  2. 为事件创建javascript对象模型, 并将其注入由 第1步创建的日期对象模型中。
  3. 创建周视图: 使用vue的createElement方法根据 由第1步生成的日期对象模型 创建出周视图的virtual-dom。
  4. 创建月视图：由于单个月视图可以由多个周视图组合得来，所以我们可以使用vue的computed钩子来缓存由第2步创建的virtual-dom，然后将其组合成月视图的virtual-dom。这样做的好处是可以节省一些创建视图模型所需的开销。
  5. 懒渲染：由于日历没有起点和终点，是一种无限列表，所以我们无法创建整个日历，只能在用户需要浏览它的某部分前提前创建该部分。我这里的实现方法是为日历的每一页绑定页码，然后比较用户当前浏览中的页码是否已接近 起始页或最后一页 的页码，如果是的话就再多创建一些视图。
  6. 转跳到特定的日期： 这个动作可分解为两个步骤：
     1. 转跳到指定日期所在的周/月视图：我的实现方法是用散列表保存每一天与每个周/月视图的对应关系，然后在需要的时候通过该表找到所需显示的视图的索引值，并将其传递给swiper的slideTo方法——让swiper来完成转跳动画。
     2. 把指定日期所对应的视图模型标记为选中状态。


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```
