var ye=Object.defineProperty,he=Object.defineProperties;var pe=Object.getOwnPropertyDescriptors;var O=Object.getOwnPropertySymbols;var ke=Object.prototype.hasOwnProperty,Te=Object.prototype.propertyIsEnumerable;var K=(e,c,d)=>c in e?ye(e,c,{enumerable:!0,configurable:!0,writable:!0,value:d}):e[c]=d,J=(e,c)=>{for(var d in c||(c={}))ke.call(c,d)&&K(e,d,c[d]);if(O)for(var d of O(c))Te.call(c,d)&&K(e,d,c[d]);return e},U=(e,c)=>he(e,pe(c));(function(e,c){typeof exports=="object"&&typeof module!="undefined"?module.exports=c(require("vue")):typeof define=="function"&&define.amd?define(["vue"],c):(e=typeof globalThis!="undefined"?globalThis:e||self,e["ass-lyric"]=c(e.Vue))})(this,function(e){"use strict";var c="",d=(i,M)=>{const u=i.__vccOpts||i;for(const[S,$]of M)u[S]=$;return u};const G=["innerHTML"],Q=["innerHTML"],R={key:1,class:"center-mark"},X=e.defineComponent({name:"ASSLyric"}),Z=e.defineComponent(U(J({},X),{props:{currentTime:{type:Number,required:!0},isPasued:{type:Boolean,required:!0},lyric:{type:String,required:!0},lyricActiveClass:{type:String,default:""},lyricCenterClass:{type:String,default:""},karaokeBasicColor:{type:String,default:"#00f"},karaokeChangedColor:{type:String,default:"#f00"},lyricScrollTime:{type:Number,default:400},dragendWaitTime:{type:Number,default:3e3},lyricMargin:{type:String,default:"20px"},lyricLineheight:{type:String,default:"1.5em"},triangleColor:{type:String,default:"orange"},triangleWidth:{type:String,default:"40px"},centerLineColor:{type:String,default:"#ccc"},centerTimeColor:{type:String,default:"orange"},karaokeAutoMode:{type:Boolean,default:!0}},emits:["change-current-time"],setup(i,{emit:M}){const u=i;e.useCssVars(t=>({"86f05752-karaokeChangedColor":i.karaokeChangedColor,"86f05752-karaokeBasicColor":i.karaokeBasicColor}));const S=e.ref(u.lyric),$=e.ref(0),N=e.ref(0),h=e.ref(!1),g=e.ref(0),I=e.ref(),p=e.ref(-1),W=e.ref([]),ee=e.ref(null),z=e.ref(0),k=e.ref(0),Y=e.ref(null),D=e.ref(null),T=e.ref([]),P=e.ref(0),F=e.ref(0),A=e.ref(),m=e.ref(),y=30,L=e.ref(!1),v=e.computed(()=>{if(S.value){const a=S.value.replace(/([^\]^\n])\[/g,n=>`${n}
[`).split(`
`),r=new Map;let l=[];const s=a.length;for(let n=0;n<s;n++){const f=a[n].match(/\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/g),q=a[n].match(/^\[\s*(\w+)\s*:(.*)]/g);if(f){const b=f.length;for(let H=0;H<b;H++){const ge=w(f[H]),me=ae(a[n],w(f[H],!0));l.push([ge+(r.get("offset")/-1e3||0),me])}}else if(q){const b=/^\[\s*(\w+)\s*:(.*)]/g.exec(q[0]);b&&r.set(b[1].trim(),b[2].trim())}}l=l.filter(n=>n[1]),l.sort((n,f)=>n[0]-f[0]);const o=[];for(let n=0;n<l.length-1;n++)o.push(l[n]),l[n][0]===l[n+1][0]&&(o[o.length-1][2]=l[n+1][1],n++);return l[l.length-1][0]!==o[o.length-1][0]&&o.push(l[l.length-1]),o}else return[]}),C=e.computed(()=>{const t=[];let a=0;return T.value&&T.value.forEach(r=>{const l=r.offsetHeight;W.value.push(l),t.push(a),a+=l}),t}),B=e.computed(()=>{const t=v.value,a=u.currentTime;for(let r=0,l=t.length;r<l;r++)if(t[r][0]<=a&&(t[r+1]&&t[r+1][0]>a||!t[r+1]))return r;return 0}),E=e.computed(()=>k.value/2-P.value/2),te=e.computed(()=>k.value/2-F.value/2),j=e.computed(()=>-(z.value-k.value+te.value));e.watch(()=>u.lyric,t=>{L.value=!1,S.value=t}),e.watch(()=>u.currentTime,()=>{ie()}),e.watch(()=>u.isPasued,()=>{m.value&&(A.value=setTimeout(()=>x(m.value.eps,m.value.index,m.value.ps,m.value.process,m.value.pos,m.value.count),y))}),e.watch(v,()=>{e.nextTick(()=>{var t,a;le(),k.value=((t=Y.value)==null?void 0:t.offsetHeight)||0,z.value=((a=D.value)==null?void 0:a.offsetHeight)||0,g.value=E.value})}),e.watch(B,t=>{L.value&&de(T.value[t].getElementsByTagName("span"))});const V=(t,a)=>{const r=parseFloat(t),l=t.replace(r.toString(),"");return`${r/a}${l}`},w=(t,a=!1)=>{const r=/\[?(\d{2}):(\d{2})(\.(\d{2,3}))?]?/.exec(t);if(r){const l=parseInt(r[1])*60,s=parseInt(r[2]);if(a){const o=r[4]?parseInt(r[4]):0;return(l+s)*1e3+o}else{const o=r[4]?parseInt(r[4])/(`${r[4]}`.length===2?100:1e3):0;return l+s+o}}else return-1},re=t=>{typeof t=="string"&&(t=Number(t)),t=Math.round(t);let a=t%60,r=Math.floor(t/60);return a<10&&(a=`0${a}`),r<10&&(r=`0${r}`),`${r}:${a}`},ae=(t,a)=>{let r="";const l=t.replace(/.*\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/g,"").replace(/^\s+|\s+$/g,"").replace(/\[$/g,"");if(l.search(/<(\d{2}):(\d{2})(\.(\d{2,3}))?>/g)!==-1){const s=l.split(/<|>/);let o="",n=-1;for(const f of s)f.match(/(\d{2}):(\d{2})(\.(\d{2,3}))?/g)?(n!==-1&&(o=o.replace("$2",(w(f,!0)-n).toString()),r+=o),o='<span data-offset="$1" data-duration="$2">$3</span>',n=w(f,!0),o=o.replace("$1",(n-a).toString())):o=o.replace("$3",f);r.length>0&&(L.value=u.karaokeAutoMode)}else r=l;return r},le=()=>{const t=T.value;t&&(P.value=t[0].offsetHeight,F.value=t[t.length-1].offsetHeight)},ne=()=>{M("change-current-time",v.value[p.value][0]),e.nextTick(()=>{h.value=!1})},oe=t=>{if(t){const a=window.getComputedStyle(t);return(a.transform||a.webkitTransform).split(",")[5].replace(")","")}return null},ie=()=>{if(!h.value){const t=C.value[B.value]+W.value[B.value]/2-k.value/2;g.value=-t}},ce=t=>{h.value=!0,clearTimeout(I.value),$.value=t.touches[0].clientY,N.value=Number(oe(ee.value)),g.value=N.value},se=t=>{t.preventDefault();const a=t.touches[0].clientY,r=N.value+a-$.value;r>E.value?g.value=E.value:r<j.value?g.value=j.value:(g.value=r,p.value=fe())},ue=()=>{I.value=setTimeout(()=>{h.value=!1,p.value=-1},u.dragendWaitTime)},fe=()=>{const t=k.value/2;for(let a=0,r=C.value.length;a<r;a++){const l=C.value[a];if(g.value+l<t&&C.value[a+1]&&g.value+C.value[a+1]>t||!C.value[a+1])return a}return-1},x=(t,a,r,l,s,o)=>{if(u.isPasued){m.value={eps:t,index:a,ps:r,process:l,pos:s,count:o},clearTimeout(A.value);return}const n=t[a];if(o>=s&&(l+=r,n.style.backgroundImage=`-webkit-linear-gradient(top, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%), -webkit-linear-gradient(left, ${u.karaokeChangedColor} ${l}%, ${u.karaokeBasicColor} 0%)`,l>=99)){if(a+1>=t.length){m.value=null;return}a++;const f=Math.round(Number(t[a].getAttribute("data-duration"))/y)===0?1:Math.round(Number(t[a].getAttribute("data-duration"))/y);r=100/f,l=0,s=Math.round(Number(t[a].getAttribute("data-offset"))/y)}o++,A.value=setTimeout(()=>x(t,a,r,l,s,o),y)},de=t=>{t&&x(t,0,100/Math.round(Number(t[0].getAttribute("data-duration"))/y),0,Math.round(Number(t[0].getAttribute("data-offset"))/y),0)};return e.onBeforeUpdate(()=>{T.value=[]}),(t,a)=>(e.openBlock(),e.createElementBlock("div",{ref_key:"lyricView",ref:Y,class:"lyric-view",onTouchstart:ce,onTouchmove:se,onTouchend:ue},[i.lyric?(e.openBlock(),e.createElementBlock("div",{key:0,ref_key:"lyricWrapper",ref:D,class:"lyric-wrapper",style:e.normalizeStyle({transform:`translate3d(0, ${g.value}px, 0)`,transition:`${h.value?"none":`all ease ${i.lyricScrollTime}ms`}`})},[(e.openBlock(!0),e.createElementBlock(e.Fragment,null,e.renderList(e.unref(v),(r,l)=>(e.openBlock(),e.createElementBlock("div",{ref_for:!0,ref:s=>{s!=null&&(T.value[l]=s)},key:l,style:e.normalizeStyle({padding:`${V(i.lyricMargin,2)} 0`}),class:e.normalizeClass({[i.lyricCenterClass]:l===p.value,[i.lyricActiveClass]:l===e.unref(B)})},[e.createElementVNode("p",{style:e.normalizeStyle({lineHeight:i.lyricLineheight}),class:e.normalizeClass({karaok:L.value}),innerHTML:r[1]},null,14,G),r[2]?(e.openBlock(),e.createElementBlock("p",{key:0,style:e.normalizeStyle({lineHeight:i.lyricLineheight}),class:e.normalizeClass({karaok:L.value}),innerHTML:r[2]},null,14,Q)):e.createCommentVNode("v-if",!0)],6))),128))],4)):e.createCommentVNode("v-if",!0),e.createCommentVNode(" \u62D6\u62FD\u65F6\u4E2D\u95F4\u6807\u8BB0 "),h.value?(e.openBlock(),e.createElementBlock("div",R,[e.createElementVNode("div",{class:"triangle",style:e.normalizeStyle({borderColor:`transparent transparent transparent ${i.triangleColor}`,borderWidth:`${V(i.triangleWidth,1.732)} 0 ${V(i.triangleWidth,1.732)} ${i.triangleWidth}`}),onClick:ne},null,4),e.createElementVNode("div",{class:"line",style:e.normalizeStyle({background:i.centerLineColor})},null,4),e.createElementVNode("div",{class:"target-time",style:e.normalizeStyle({color:i.centerTimeColor})},e.toDisplayString(e.unref(v)[p.value]&&re(e.unref(v)[p.value][0])),5)])):e.createCommentVNode("v-if",!0)],544))}}));var _=d(Z,[["__scopeId","data-v-86f05752"],["__file","J:/ass-lyric/src/ASSLyric.vue"]]);return _});
