<script setup lang="ts">
import {computed} from 'vue';
import {guideTopic,guideReturn,modal,dispatch} from './store';
import Art from './Art.vue';
const pages=[
 {id:'shop',name:'开门营业',art:'lin-qiao',title:'从第一位街坊开始',steps:[['叫号','按柜台绿灯，让下一位客人进店。空格或对话按钮继续交谈，听完需求后接单、买货或出售。'],['整理','上方托盘是来货，中间是谈判台，下方才是自有仓库。拖动，或点选物品再点空格；Q / E 旋转，Esc 取消。购买后的物品仍在台面，入库后再闭店。'],['日结','思考不消耗时间。操作使用工时，闭店结算租金和维护费；工单与库存保留，食品随营业日老化。下一天恢复工时并更新来客。']]},
 {id:'trade',name:'检查与议价',art:'portable-terminal',title:'看货，再谈价格',steps:[['逐件核对','左侧选货并检查，右侧显示清单。每件旧货独立生成，检查一件不会揭示其他货物。品相与功能看基础检查，容量、纯度或完整度看扫描，真伪与原貌查序列。'],['还价','输入整批报价，客人接受时直接成交；不接受时可能还价。合理报价可换来逐步让价，极端报价只消耗耐心。接受还价使用同一份货单，换货需重新谈；刷新保留议价进度。'],['结算','同次购入至少三件享九折。买家有剩余预算，可按预算挑选。成交小票显示实际钱款；售出差额为货款减货品累计成本，尚未扣租金、维护和培训。谈不拢保留未成交货物与现金。']]},
 {id:'repair',name:'检测与维修',art:'micro-solder',title:'按读数动手',steps:[['定位','接单后连接检测仪，核对故障和操作位置。客户送修件独立保管，材料预付款只用于对应工单；自有旧货翻新优先使用库存耗材。'],['操作','清洁：擦过六个接点；拆装：松开螺丝、装入模块，再锁紧；校准：对齐信号与目标读数。准备不扣费，确认执行时按预览结算。参数模式可直接选择工序、位置和读数，熟练后可用快捷工序。'],['交付','排除全部故障后通电复检，再交付。古董更换原件会降低原貌，修整原件需要额外工时。维修恢复物理功能，数据完整度与历史真伪仍需分别核对。工时用完可第二天继续。']]},
 {id:'stock',name:'库存与收藏',art:'battery-pack',title:'给旧物留个位置',steps:[['摆放','物品按实际形状占格。绿色预览可放，红色表示碰撞或越界；谈判台可暂存自有货物。右键或触屏长按打开操作菜单，双击进入详情。扩容在仓库下方新增格位。'],['六类货品','机电看故障与修复投入；能源看容量和纯度；食品看保质期；神经器件看接口和交易许可；数据看完整度与授权；古董看真伪、原貌和出处。未检查的信息不会预先揭示。'],['陈列','已鉴定的自有真品可以陈列，展示品退出普通售卖，撤展后回到货架。主题与品类组合影响吸引力，同款重复收益递减。客户送修物不能当作藏品。']]},
 {id:'orders',name:'街坊与成长',art:'data-chip',title:'把生意做成招牌',steps:[['订货','每天三份需求，同时最多接两份。免费接单，按约定条件挑选实际自有库存，半个工时交货。检查工具须已持有，食品按交货日验收。最后一天闭店前交付；取消或过期保留现金与未交付货物。'],['技能与资质','通用树和维修树共享技能点。大师需维修树先投入六点，再支付两点；按任务板积累案例、参加培训与考核。维修证书和受管制货品交易许可分别取得。'],['经营权','完成街区委托后领取谢礼与回信。取得大师能力、完成联络中枢三阶段修复，再支付收购款即可通关；之后可保存结局，或免租继续经营、考古董资质和完成挑战。']]},
 {id:'save',name:'保存与补救',art:'cleaner',title:'明天还能重新开门',steps:[['保存','经营操作自动保存。换浏览器或设备前导出进度，在目标环境导入。本机与正式域名存储独立；导入后以导入点建立备份，下一个营业日起按开门状态备份。'],['欠费','基础援助维修可以零现金接取。第一次欠费后还有三次营业日结可补缴，实际期限和欠款看任务板、日结。凑够费用后完成结算才消除欠费；停业可恢复当天开门备份。'],['显示与声音','设置中可静音、调节音量、关闭环境音或减少动态。F 切换全屏，Esc 关闭面板；手机使用横屏。场景动画不会让经营时间自行流逝。']]},
];
const page=computed(()=>pages.find(p=>p.id===guideTopic.value)??pages[0]!);
function restart(){dispatch({type:'tutorial',step:0,skipped:false});modal.value='';}
</script>
<template>
 <section class="game-guide" aria-label="店铺教程">
  <header><p>九街旧物 / 操作手册</p><h2>店铺教程</h2></header>
  <nav aria-label="教程章节"><button v-for="p in pages" :key="p.id" :aria-pressed="page.id===p.id" @click="guideTopic=p.id">{{p.name}}</button></nav>
  <div class="guide-page"><aside><Art :id="page.art" eager/><span>{{String(pages.indexOf(page)+1).padStart(2,'0')}} / 06</span></aside><article><h3>{{page.title}}</h3><section v-for="(step,index) in page.steps" :key="step[0]"><h4><b>{{index+1}}</b>{{step[0]}}</h4><p>{{step[1]}}</p></section></article></div>
  <footer><button v-if="page.id==='shop'" @click="restart">重走开店引导</button><button class="primary" @click="modal=guideReturn">{{guideReturn?'返回操作':'返回店铺'}} →</button></footer>
 </section>
</template>
<style scoped>
.game-guide{color:#c7d5c5}.game-guide header{padding-bottom:20px;border-bottom:1px solid #54766c}.game-guide header p{font-size:10px;letter-spacing:.12em;color:#86aaa2}.game-guide h2{font-size:29px;margin-top:8px}.game-guide nav{display:flex;flex-wrap:wrap;gap:7px;margin:22px 0}.game-guide nav button{font-size:12px;background:#102b2e;color:#a5c2b9;border-color:#41625c}.game-guide nav button[aria-pressed=true]{background:#8ac4b5;color:#133434;border-color:#8ac4b5}.guide-page{display:grid;grid-template-columns:150px minmax(0,1fr);gap:32px;padding:12px 0 24px}.guide-page aside{display:flex;align-items:center;flex-direction:column;gap:24px;background:radial-gradient(ellipse at 50% 30%,#3f655936,transparent 60%)}.guide-page aside img{width:130px;height:190px;object-fit:contain;filter:drop-shadow(0 10px 14px #0007)}.guide-page aside span{font-size:10px;letter-spacing:.2em;color:#6e9d91}.guide-page h3{font-size:21px;color:#d6ddc6;margin:0 0 24px}.guide-page h4{font-size:14px;display:flex;gap:12px;align-items:center;margin-bottom:8px}.guide-page h4 b{font-size:10px;font-weight:400;width:22px;height:22px;display:grid;place-items:center;border:1px solid #5d897b;color:#95c4b4}.guide-page article section{margin-bottom:22px}.guide-page article p{font-size:13px;line-height:1.9;color:#a9c3b8}.game-guide footer{display:flex;justify-content:flex-end;gap:12px;border-top:1px solid #45655b;padding-top:20px}.game-guide footer button{font-size:12px}@media(max-width:900px){.guide-page{grid-template-columns:90px minmax(0,1fr);gap:20px}.guide-page aside img{width:90px;height:130px}.guide-page article p{font-size:12px}.game-guide nav{margin:15px 0}.game-guide nav button{padding:8px;font-size:11px}}@media(max-width:550px){.guide-page{display:block}.guide-page aside{display:none}}@media(pointer:coarse){.game-guide button{min-height:44px}}
</style>
