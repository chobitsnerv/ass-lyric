"use strict";var ce=Object.defineProperty,ie=Object.defineProperties;var se=Object.getOwnPropertyDescriptors;var j=Object.getOwnPropertySymbols;var ue=Object.prototype.hasOwnProperty,fe=Object.prototype.propertyIsEnumerable;var q=(n,s,i)=>s in n?ce(n,s,{enumerable:!0,configurable:!0,writable:!0,value:i}):n[s]=i,O=(n,s)=>{for(var i in s||(s={}))ue.call(s,i)&&q(n,i,s[i]);if(j)for(var i of j(s))fe.call(s,i)&&q(n,i,s[i]);return n},K=(n,s)=>ie(n,se(s));var e=require("vue");var ve=(n,s)=>{const i=n.__vccOpts||n;for(const[C,b]of s)i[C]=b;return i};const de=["innerHTML"],ge=["innerHTML"],me={key:1,class:"center-mark"},ye=e.defineComponent({name:"ASSLyric"}),he=e.defineComponent(K(O({},ye),{props:{currentTime:{type:Number,required:!0},isPasued:{type:Boolean,required:!0},lyric:{type:String,required:!0},lyricActiveClass:{type:String,default:""},lyricCenterClass:{type:String,default:""},karaokeBasicColor:{type:String,default:"#00f"},karaokeChangedColor:{type:String,default:"#f00"},lyricScrollTime:{type:Number,default:400},dragendWaitTime:{type:Number,default:3e3},lyricMargin:{type:String,default:"20px"},lyricLineheight:{type:String,default:"1.5em"},triangleColor:{type:String,default:"orange"},triangleWidth:{type:String,default:"40px"},centerLineColor:{type:String,default:"#ccc"},centerTimeColor:{type:String,default:"orange"},karaokeAutoMode:{type:Boolean,default:!0}},emits:["change-current-time"],setup(n,{emit:s}){const i=n;e.useCssVars(t=>({"86f05752-karaokeChangedColor":n.karaokeChangedColor,"86f05752-karaokeBasicColor":n.karaokeBasicColor}));const C=e.ref(i.lyric),b=e.ref(0),H=e.ref(0),m=e.ref(!1),v=e.ref(0),V=e.ref(),y=e.ref(-1),I=e.ref([]),J=e.ref(null),W=e.ref(0),h=e.ref(0),x=e.ref(null),z=e.ref(null),p=e.ref([]),Y=e.ref(0),D=e.ref(0),M=e.ref(),d=e.ref(),g=30,S=e.ref(!1),k=e.computed(()=>{if(C.value){const a=C.value.replace(/([^\]^\n])\[/g,o=>`${o}
[`).split(`
`),r=new Map;let l=[];const u=a.length;for(let o=0;o<u;o++){const f=a[o].match(/\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/g),F=a[o].match(/^\[\s*(\w+)\s*:(.*)]/g);if(f){const L=f.length;for(let w=0;w<L;w++){const ne=B(f[w]),oe=Q(a[o],B(f[w],!0));l.push([ne+(r.get("offset")/-1e3||0),oe])}}else if(F){const L=/^\[\s*(\w+)\s*:(.*)]/g.exec(F[0]);L&&r.set(L[1].trim(),L[2].trim())}}l=l.filter(o=>o[1]),l.sort((o,f)=>o[0]-f[0]);const c=[];for(let o=0;o<l.length-1;o++)c.push(l[o]),l[o][0]===l[o+1][0]&&(c[c.length-1][2]=l[o+1][1],o++);return l[l.length-1][0]!==c[c.length-1][0]&&c.push(l[l.length-1]),c}else return[]}),T=e.computed(()=>{const t=[];let a=0;return p.value&&p.value.forEach(r=>{const l=r.offsetHeight;I.value.push(l),t.push(a),a+=l}),t}),$=e.computed(()=>{const t=k.value,a=i.currentTime;for(let r=0,l=t.length;r<l;r++)if(t[r][0]<=a&&(t[r+1]&&t[r+1][0]>a||!t[r+1]))return r;return 0}),N=e.computed(()=>h.value/2-Y.value/2),U=e.computed(()=>h.value/2-D.value/2),P=e.computed(()=>-(W.value-h.value+U.value));e.watch(()=>i.lyric,t=>{S.value=!1,C.value=t}),e.watch(()=>i.currentTime,()=>{_()}),e.watch(()=>i.isPasued,()=>{d.value&&(M.value=setTimeout(()=>E(d.value.eps,d.value.index,d.value.ps,d.value.process,d.value.pos,d.value.count),g))}),e.watch(k,()=>{e.nextTick(()=>{var t,a;R(),h.value=((t=x.value)==null?void 0:t.offsetHeight)||0,W.value=((a=z.value)==null?void 0:a.offsetHeight)||0,v.value=N.value})}),e.watch($,t=>{S.value&&le(p.value[t].getElementsByTagName("span"))});const A=(t,a)=>{const r=parseFloat(t),l=t.replace(r.toString(),"");return`${r/a}${l}`},B=(t,a=!1)=>{const r=/\[?(\d{2}):(\d{2})(\.(\d{2,3}))?]?/.exec(t);if(r){const l=parseInt(r[1])*60,u=parseInt(r[2]);if(a){const c=r[4]?parseInt(r[4]):0;return(l+u)*1e3+c}else{const c=r[4]?parseInt(r[4])/(`${r[4]}`.length===2?100:1e3):0;return l+u+c}}else return-1},G=t=>{typeof t=="string"&&(t=Number(t)),t=Math.round(t);let a=t%60,r=Math.floor(t/60);return a<10&&(a=`0${a}`),r<10&&(r=`0${r}`),`${r}:${a}`},Q=(t,a)=>{let r="";const l=t.replace(/.*\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/g,"").replace(/^\s+|\s+$/g,"").replace(/\[$/g,"");if(l.search(/<(\d{2}):(\d{2})(\.(\d{2,3}))?>/g)!==-1){const u=l.split(/<|>/);let c="",o=-1;for(const f of u)f.match(/(\d{2}):(\d{2})(\.(\d{2,3}))?/g)?(o!==-1&&(c=c.replace("$2",(B(f,!0)-o).toString()),r+=c),c='<span data-offset="$1" data-duration="$2">$3</span>',o=B(f,!0),c=c.replace("$1",(o-a).toString())):c=c.replace("$3",f);r.length>0&&(S.value=i.karaokeAutoMode)}else r=l;return r},R=()=>{const t=p.value;t&&(Y.value=t[0].offsetHeight,D.value=t[t.length-1].offsetHeight)},X=()=>{s("change-current-time",k.value[y.value][0]),e.nextTick(()=>{m.value=!1})},Z=t=>{if(t){const a=window.getComputedStyle(t);return(a.transform||a.webkitTransform).split(",")[5].replace(")","")}return null},_=()=>{if(!m.value){const t=T.value[$.value]+I.value[$.value]/2-h.value/2;v.value=-t}},ee=t=>{m.value=!0,clearTimeout(V.value),b.value=t.touches[0].clientY,H.value=Number(Z(J.value)),v.value=H.value},te=t=>{t.preventDefault();const a=t.touches[0].clientY,r=H.value+a-b.value;r>N.value?v.value=N.value:r<P.value?v.value=P.value:(v.value=r,y.value=ae())},re=()=>{V.value=setTimeout(()=>{m.value=!1,y.value=-1},i.dragendWaitTime)},ae=()=>{const t=h.value/2;for(let a=0,r=T.value.length;a<r;a++){const l=T.value[a];if(v.value+l<t&&T.value[a+1]&&v.value+T.value[a+1]>t||!T.value[a+1])return a}return-1},E=(t,a,r,l,u,c)=>{if(i.isPasued){d.value={eps:t,index:a,ps:r,process:l,pos:u,count:c},clearTimeout(M.value);return}const o=t[a];if(c>=u&&(l+=r,o.style.backgroundImage=`-webkit-linear-gradient(top, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%), -webkit-linear-gradient(left, ${i.karaokeChangedColor} ${l}%, ${i.karaokeBasicColor} 0%)`,l>=99)){if(a+1>=t.length){d.value=null;return}a++;const f=Math.round(Number(t[a].getAttribute("data-duration"))/g)===0?1:Math.round(Number(t[a].getAttribute("data-duration"))/g);r=100/f,l=0,u=Math.round(Number(t[a].getAttribute("data-offset"))/g)}c++,M.value=setTimeout(()=>E(t,a,r,l,u,c),g)},le=t=>{t&&E(t,0,100/Math.round(Number(t[0].getAttribute("data-duration"))/g),0,Math.round(Number(t[0].getAttribute("data-offset"))/g),0)};return e.onBeforeUpdate(()=>{p.value=[]}),(t,a)=>(e.openBlock(),e.createElementBlock("div",{ref_key:"lyricView",ref:x,class:"lyric-view",onTouchstart:ee,onTouchmove:te,onTouchend:re},[n.lyric?(e.openBlock(),e.createElementBlock("div",{key:0,ref_key:"lyricWrapper",ref:z,class:"lyric-wrapper",style:e.normalizeStyle({transform:`translate3d(0, ${v.value}px, 0)`,transition:`${m.value?"none":`all ease ${n.lyricScrollTime}ms`}`})},[(e.openBlock(!0),e.createElementBlock(e.Fragment,null,e.renderList(e.unref(k),(r,l)=>(e.openBlock(),e.createElementBlock("div",{ref_for:!0,ref:u=>{u!=null&&(p.value[l]=u)},key:l,style:e.normalizeStyle({padding:`${A(n.lyricMargin,2)} 0`}),class:e.normalizeClass({[n.lyricCenterClass]:l===y.value,[n.lyricActiveClass]:l===e.unref($)})},[e.createElementVNode("p",{style:e.normalizeStyle({lineHeight:n.lyricLineheight}),class:e.normalizeClass({karaok:S.value}),innerHTML:r[1]},null,14,de),r[2]?(e.openBlock(),e.createElementBlock("p",{key:0,style:e.normalizeStyle({lineHeight:n.lyricLineheight}),class:e.normalizeClass({karaok:S.value}),innerHTML:r[2]},null,14,ge)):e.createCommentVNode("v-if",!0)],6))),128))],4)):e.createCommentVNode("v-if",!0),e.createCommentVNode(" \u62D6\u62FD\u65F6\u4E2D\u95F4\u6807\u8BB0 "),m.value?(e.openBlock(),e.createElementBlock("div",me,[e.createElementVNode("div",{class:"triangle",style:e.normalizeStyle({borderColor:`transparent transparent transparent ${n.triangleColor}`,borderWidth:`${A(n.triangleWidth,1.732)} 0 ${A(n.triangleWidth,1.732)} ${n.triangleWidth}`}),onClick:X},null,4),e.createElementVNode("div",{class:"line",style:e.normalizeStyle({background:n.centerLineColor})},null,4),e.createElementVNode("div",{class:"target-time",style:e.normalizeStyle({color:n.centerTimeColor})},e.toDisplayString(e.unref(k)[y.value]&&G(e.unref(k)[y.value][0])),5)])):e.createCommentVNode("v-if",!0)],544))}}));var pe=ve(he,[["__scopeId","data-v-86f05752"],["__file","J:/ass-lyric/src/ASSLyric.vue"]]);module.exports=pe;
