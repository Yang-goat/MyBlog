const S=i=>{const o=i.split(`
`),u=o.reduce((l,a)=>{for(let n=0;n<a.length;n++)if(a[n]!==" "&&a[n]!=="	")return Math.min(n,l);return l},1/0);return u<1/0?o.map(l=>l.slice(u)).join(`
`):i},j=(i,{name:o,open:u,close:l,render:a}={name:"uml",open:"start",close:"end",render:(n,p)=>{const h=n[p],{content:e,info:c,type:m}=h;return`<div class="${m}" title="${c}">${e}</div>`}})=>{const n=`@${u}`,p=`@${l}`,h=(e,c,m,g)=>{let s=e.bMarks[c]+e.tShift[c],k=e.eMarks[c];if(e.src.charAt(s)!=="@")return!1;let t;for(t=0;t<n.length;++t)if(n[t]!==e.src[s+t])return!1;const $=e.src.slice(s,s+t),M=e.src.slice(s+t,k);if(g)return!0;let b=!1,r=c;for(;r<m&&(s=e.bMarks[r]+e.tShift[r],k=e.eMarks[r],!(s<k&&e.sCount[r]<e.blkIndent));){if(e.src.charAt(s)==="@"&&e.sCount[r]<=e.sCount[c]){let d=!0;for(t=0;t<p.length;++t)if(p[t]!==e.src[s+t]){d=!1;break}if(d&&e.skipSpaces(s+t)>=k){b=!0;break}}r++}const C=e.src.split(`
`).slice(c+1,r).join(`
`),f=e.push(o,"uml",0);return f.block=!0,f.info=M,f.content=S(C),f.map=[c,r],f.markup=$,e.line=r+(b?1:0),!0};i.block.ruler.before("fence",o,h,{alt:["paragraph","reference","blockquote","list"]}),i.renderer.rules[o]=a};export{j as uml};
//# sourceMappingURL=browser.js.map
