import{LoadingIcon as _,decodeData as h}from"@vuepress/helper/client";import{useEventListener as f,useDebounceFn as m}from"@vueuse/core";import{defineComponent as g,toRefs as w,shallowRef as S,ref as v,h as o,onMounted as y,watch as E,nextTick as C,onUnmounted as R}from"vue";import{onContentUpdated as U}from"vuepress/client";import"../styles/echarts.scss";import{u as z}from"../echarts-wWyG_jRB.js";const D=(async()=>{}).constructor,O=(t,i,n)=>i==="js"?D("echarts",`let width,height,option,__echarts_config__;
{
${t}
__echarts_config__={width,height,option};
}
return __echarts_config__;
`)(n):Promise.resolve({option:JSON.parse(t)});var P=g({name:"ECharts",props:{config:{type:String,required:!0},id:{type:String,required:!0},title:String,type:{type:String,default:"json"}},setup(t){const{config:i,id:n}=w(t),s=z(),a=S(),c=v(!1);let e=null;f("resize",m(()=>{e?.resize()},100));const p=()=>{e?.dispose(),e=null},u=async()=>{if(__VUEPRESS_SSR__)return;const r=await import("echarts");await s.setup?.(),e=r.init(a.value);const{option:l,...d}=await O(h(t.config),t.type,e);e.resize(d),e.setOption({...s.option,...l})};return U(async r=>{r==="mounted"&&(await u(),c.value=!0)}),y(()=>{__VUEPRESS_DEV__&&E([i,n],async()=>{p(),await C(),await u()},{flush:"post"})}),R(p),()=>[t.title?o("div",{class:"echarts-title"},decodeURIComponent(t.title)):null,o("div",{class:"echarts-wrapper"},[o("div",{ref:a,class:"echarts-container",id:t.id}),c.value?null:o(_,{class:"echarts-loading",height:360})])]}});export{P as default};
//# sourceMappingURL=ECharts.js.map
