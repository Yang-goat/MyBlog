import{icon as $,extractInfo as w,stringifyAttrs as h}from"@mdit/plugin-icon";import{isString as l,isArray as p,Logger as v,isLinkHttp as x,isLinkAbsolute as I,endsWith as u,getModulePath as a,ensureEndingSlash as j,addViteSsrNoExternal as k,addCustomElement as A}from"@vuepress/helper";import{path as L,getDirname as S}from"vuepress/utils";const T=t=>/\/iconify-icon(?:[@/]|$)/.test(t),m=t=>/^(?:https:)?\/\/kit\.fontawesome\.com\//.test(t)||/\/fontawesome(?:[@/-]|$)/.test(t),y=t=>/^(?:https:)?\/\/at\.alicdn\.com\/t\//.test(t),P=t=>p(t)?t.every(m):t==="fontawesome"||t==="fontawesome-with-brands"||m(t),C=t=>p(t)?t.every(y):y(t),E=t=>l(t)&&(T(t)||t==="iconify"),F=({assets:t="iconify"})=>P(t)?"fontawesome":C(t)?"iconfont":E(t)?"iconify":"unknown",g="@vuepress/plugin-icon",b=new v(g),d=t=>`https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6/js/${t}.min.js`,f=t=>({type:"script",content:`useScriptTag(
  \`${t}\`,
  () => {},
  { attrs: { "data-auto-replace-svg": "nest" } }
);
`}),V=t=>{if(l(t)){if(t==="fontawesome")return["solid","regular","fontawesome"].map(d).map(f);if(t==="fontawesome-with-brands")return["all"].map(d).map(f);if(t==="iconify")return[{type:"script",content:"useScriptTag(`https://cdn.jsdelivr.net/npm/iconify-icon@2`);"}];const e=x(t)||I(t)?t:`//${t}`;if(u(e,".css"))return[{type:"style",content:`useStyleTag(\`\\
@import url("${e}");
\`);`}];if(u(e,".js"))return m(e)?[f(e)]:[{type:"script",content:`          useScriptTag(\`${e}\`);          `}];b.error(`Can not recognize icon link: "${t}"`)}return[]},z=(t="iconify")=>(p(t)?t:[t]).map(V).flat(),N="iconfont icon-",G=(t,e)=>e??(t==="iconfont"?N:""),M=S(import.meta.url),D=j(L.resolve(M,"../client")),O=(t,{assets:e,prefix:n,component:o="VPIcon"},s)=>{const r=z(e),c=G(s,n);return t.writeTemp("icon/config.js",`import { hasGlobalComponent } from "${a("@vuepress/helper/client",import.meta)}";
${r.some(({type:i})=>i==="script")?`import { useScriptTag } from "${a("@vueuse/core/index.mjs",import.meta)}";
`:""}${r.some(({type:i})=>i==="style")?`import { useStyleTag } from "${a("@vueuse/core/index.mjs",import.meta)}";
`:""}import { h } from "vue";
import { VPIcon } from "${D}index.js"

export default {
  enhance: ({ app }) => {
${o?`    if(!hasGlobalComponent("${o}")) {
      app.component(
        "${o}",
        (props) =>
          h(VPIcon, {
            type: "${s}",
            prefix: "${c}",
            ...props,
          })
      )
    }
`:""}  },
  setup: () => {
${r.map(({content:i})=>`    ${i}`).join(`
`)}
  },
}
`)},_=(t={})=>{const e=t.type??F(t);return{name:g,extendsBundlerOptions:(n,o)=>{k(n,o,"@vuepress/helper"),e==="iconify"&&A(n,o,"iconify-icon")},extendsMarkdown:n=>{(t.markdown??!0)&&n.use($,{render:o=>{const{attrs:s,content:r,color:c,size:i}=w({content:o});return c&&!s.color&&(s.color=c),i&&!s.size&&(s.size=i),`<${t.component??"VPIcon"} icon="${r}"${h(s)} />`}})},clientConfigFile:n=>O(n,t,e)}};export{_ as iconPlugin};
//# sourceMappingURL=index.js.map
