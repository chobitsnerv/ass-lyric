var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
import { defineComponent, useCssVars, ref, computed, watch, nextTick, onBeforeUpdate, openBlock, createElementBlock, normalizeStyle, Fragment, renderList, unref, normalizeClass, createElementVNode, createCommentVNode, toDisplayString } from "vue";
var ASSLyric_vue_vue_type_style_index_0_scoped_true_lang = "";
var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _hoisted_1 = ["innerHTML"];
const _hoisted_2 = ["innerHTML"];
const _hoisted_3 = {
  key: 1,
  class: "center-mark"
};
const __default__ = defineComponent({
  name: "ASSLyric"
});
const _sfc_main = /* @__PURE__ */ defineComponent(__spreadProps(__spreadValues({}, __default__), {
  props: {
    currentTime: {
      type: Number,
      required: true
    },
    isPasued: {
      type: Boolean,
      required: true
    },
    lyric: {
      type: String,
      required: true
    },
    lyricActiveClass: {
      type: String,
      default: ""
    },
    lyricCenterClass: {
      type: String,
      default: ""
    },
    karaokeBasicColor: {
      type: String,
      default: "#00f"
    },
    karaokeChangedColor: {
      type: String,
      default: "#f00"
    },
    lyricScrollTime: {
      type: Number,
      default: 400
    },
    dragendWaitTime: {
      type: Number,
      default: 3e3
    },
    lyricMargin: {
      type: String,
      default: "20px"
    },
    lyricLineheight: {
      type: String,
      default: "1.5em"
    },
    triangleColor: {
      type: String,
      default: "orange"
    },
    triangleWidth: {
      type: String,
      default: "40px"
    },
    centerLineColor: {
      type: String,
      default: "#ccc"
    },
    centerTimeColor: {
      type: String,
      default: "orange"
    },
    karaokeAutoMode: {
      type: Boolean,
      default: true
    }
  },
  emits: ["change-current-time"],
  setup(__props, { emit }) {
    const props = __props;
    useCssVars((_ctx) => ({
      "86f05752-karaokeChangedColor": __props.karaokeChangedColor,
      "86f05752-karaokeBasicColor": __props.karaokeBasicColor
    }));
    const lyricObject = ref(props.lyric);
    const startClientY = ref(0);
    const startTranslateY = ref(0);
    const isDragging = ref(false);
    const nowTranslateY = ref(0);
    const timer = ref();
    const centerLyricIdx = ref(-1);
    const offsetHeightList = ref([]);
    const wrapper = ref(null);
    const wrapperHeight = ref(0);
    const viewHeight = ref(0);
    const lyricView = ref(null);
    const lyricWrapper = ref(null);
    const lyricLine = ref([]);
    const firstLyricHeight = ref(0);
    const lastLyricHeight = ref(0);
    const karaokeTimer = ref();
    const karaokeStatus = ref();
    const step = 30;
    const karaokeAvailable = ref(false);
    const parsedLyric = computed(() => {
      if (lyricObject.value) {
        const _lyricObject = lyricObject.value.replace(/([^\]^\n])\[/g, (p1) => `${p1}
[`);
        const lyric = _lyricObject.split("\n");
        const lrcInfo = /* @__PURE__ */ new Map();
        let lrc = [];
        const lyricLen = lyric.length;
        for (let i = 0; i < lyricLen; i++) {
          const lrcTimes = lyric[i].match(/\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/g);
          const lrcInfoTags = lyric[i].match(/^\[\s*(\w+)\s*:(.*)]/g);
          if (lrcTimes) {
            const timeLen = lrcTimes.length;
            for (let j = 0; j < timeLen; j++) {
              const lrcTime = strToTime(lrcTimes[j]);
              const lrcText = convertLrcText(lyric[i], strToTime(lrcTimes[j], true));
              lrc.push([lrcTime + (lrcInfo.get("offset") / -1e3 || 0), lrcText]);
            }
          } else if (lrcInfoTags) {
            const paras = /^\[\s*(\w+)\s*:(.*)]/g.exec(lrcInfoTags[0]);
            if (paras)
              lrcInfo.set(paras[1].trim(), paras[2].trim());
          }
        }
        lrc = lrc.filter((item) => item[1]);
        lrc.sort((a, b) => a[0] - b[0]);
        const _lrc = [];
        for (let i = 0; i < lrc.length - 1; i++) {
          _lrc.push(lrc[i]);
          if (lrc[i][0] === lrc[i + 1][0]) {
            _lrc[_lrc.length - 1][2] = lrc[i + 1][1];
            i++;
          }
        }
        if (lrc[lrc.length - 1][0] !== _lrc[_lrc.length - 1][0])
          _lrc.push(lrc[lrc.length - 1]);
        return _lrc;
      } else {
        return [];
      }
    });
    const offsetTopList = computed(() => {
      const resultArr = [];
      let totalHeight = 0;
      if (lyricLine.value) {
        lyricLine.value.forEach((line) => {
          const height = line.offsetHeight;
          offsetHeightList.value.push(height);
          resultArr.push(totalHeight);
          totalHeight += height;
        });
      }
      return resultArr;
    });
    const activeLyricIdx = computed(() => {
      const allLyric = parsedLyric.value;
      const currentTime = props.currentTime;
      for (let i = 0, len = allLyric.length; i < len; i++) {
        if (allLyric[i][0] <= currentTime && (allLyric[i + 1] && allLyric[i + 1][0] > currentTime || !allLyric[i + 1]))
          return i;
      }
      return 0;
    });
    const lyricTopPadding = computed(() => {
      return viewHeight.value / 2 - firstLyricHeight.value / 2;
    });
    const lyricBottomPadding = computed(() => {
      return viewHeight.value / 2 - lastLyricHeight.value / 2;
    });
    const minTranslateY = computed(() => {
      return -(wrapperHeight.value - viewHeight.value + lyricBottomPadding.value);
    });
    watch(() => props.lyric, (newValue) => {
      karaokeAvailable.value = false;
      lyricObject.value = newValue;
    });
    watch(() => props.currentTime, () => {
      updateLyricPos();
    });
    watch(() => props.isPasued, () => {
      if (karaokeStatus.value)
        karaokeTimer.value = setTimeout(() => processKaraWord(karaokeStatus.value.eps, karaokeStatus.value.index, karaokeStatus.value.ps, karaokeStatus.value.process, karaokeStatus.value.pos, karaokeStatus.value.count), step);
    });
    watch(parsedLyric, () => {
      nextTick(() => {
        var _a, _b;
        setFirstLastLyricHeight();
        viewHeight.value = ((_a = lyricView.value) == null ? void 0 : _a.offsetHeight) || 0;
        wrapperHeight.value = ((_b = lyricWrapper.value) == null ? void 0 : _b.offsetHeight) || 0;
        nowTranslateY.value = lyricTopPadding.value;
      });
    });
    watch(activeLyricIdx, (newValue) => {
      if (karaokeAvailable.value)
        processKaraLine(lyricLine.value[newValue].getElementsByTagName("span"));
    });
    const unitDivide = (unitNum, num) => {
      const num1 = parseFloat(unitNum);
      const unit = unitNum.replace(num1.toString(), "");
      return `${num1 / num}${unit}`;
    };
    const strToTime = (str, msFlag = false) => {
      const oneTime = /\[?(\d{2}):(\d{2})(\.(\d{2,3}))?]?/.exec(str);
      if (oneTime) {
        const min2sec = parseInt(oneTime[1]) * 60;
        const sec2sec = parseInt(oneTime[2]);
        if (!msFlag) {
          const msec2sec = oneTime[4] ? parseInt(oneTime[4]) / (`${oneTime[4]}`.length === 2 ? 100 : 1e3) : 0;
          return min2sec + sec2sec + msec2sec;
        } else {
          const msec2sec = oneTime[4] ? parseInt(oneTime[4]) : 0;
          return (min2sec + sec2sec) * 1e3 + msec2sec;
        }
      } else {
        return -1;
      }
    };
    const timeToStr = (num) => {
      if (typeof num === "string")
        num = Number(num);
      num = Math.round(num);
      let second = num % 60;
      let minute = Math.floor(num / 60);
      if (second < 10)
        second = `0${second}`;
      if (minute < 10)
        minute = `0${minute}`;
      return `${minute}:${second}`;
    };
    const convertLrcText = (lrcStr, baseTime) => {
      let resultStr = "";
      const _textWithTag = lrcStr.replace(/.*\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/g, "").replace(/^\s+|\s+$/g, "").replace(/\[$/g, "");
      if (_textWithTag.search(/<(\d{2}):(\d{2})(\.(\d{2,3}))?>/g) !== -1) {
        const _lrcArr = _textWithTag.split(/<|>/);
        let _tempHTML = "";
        let _startTimePoint = -1;
        for (const el of _lrcArr) {
          if (el.match(/(\d{2}):(\d{2})(\.(\d{2,3}))?/g)) {
            if (_startTimePoint !== -1) {
              _tempHTML = _tempHTML.replace("$2", (strToTime(el, true) - _startTimePoint).toString());
              resultStr += _tempHTML;
            }
            _tempHTML = '<span data-offset="$1" data-duration="$2">$3</span>';
            _startTimePoint = strToTime(el, true);
            _tempHTML = _tempHTML.replace("$1", (_startTimePoint - baseTime).toString());
          } else {
            _tempHTML = _tempHTML.replace("$3", el);
          }
        }
        if (resultStr.length > 0)
          karaokeAvailable.value = props.karaokeAutoMode;
      } else {
        resultStr = _textWithTag;
      }
      return resultStr;
    };
    const setFirstLastLyricHeight = () => {
      const lyricLines = lyricLine.value;
      if (lyricLines) {
        firstLyricHeight.value = lyricLines[0].offsetHeight;
        lastLyricHeight.value = lyricLines[lyricLines.length - 1].offsetHeight;
      }
    };
    const changeCurrentTime = () => {
      emit("change-current-time", parsedLyric.value[centerLyricIdx.value][0]);
      nextTick(() => {
        isDragging.value = false;
      });
    };
    const getTranslateY = (el) => {
      if (el) {
        const curStyle = window.getComputedStyle(el);
        const curTransform = curStyle.transform || curStyle.webkitTransform;
        return curTransform.split(",")[5].replace(")", "");
      }
      return null;
    };
    const updateLyricPos = () => {
      if (!isDragging.value) {
        const scrollTarget = offsetTopList.value[activeLyricIdx.value] + offsetHeightList.value[activeLyricIdx.value] / 2 - viewHeight.value / 2;
        nowTranslateY.value = -scrollTarget;
      }
    };
    const onTouchStart = (e) => {
      isDragging.value = true;
      clearTimeout(timer.value);
      startClientY.value = e.touches[0].clientY;
      startTranslateY.value = Number(getTranslateY(wrapper.value));
      nowTranslateY.value = startTranslateY.value;
    };
    const onTouchMove = (e) => {
      e.preventDefault();
      const clientY = e.touches[0].clientY;
      const targetTranslateY = startTranslateY.value + clientY - startClientY.value;
      if (targetTranslateY > lyricTopPadding.value) {
        nowTranslateY.value = lyricTopPadding.value;
      } else if (targetTranslateY < minTranslateY.value) {
        nowTranslateY.value = minTranslateY.value;
      } else {
        nowTranslateY.value = targetTranslateY;
        centerLyricIdx.value = findCenterLyricIdx();
      }
    };
    const onTouchEnd = () => {
      timer.value = setTimeout(() => {
        isDragging.value = false;
        centerLyricIdx.value = -1;
      }, props.dragendWaitTime);
    };
    const findCenterLyricIdx = () => {
      const halfViewHeight = viewHeight.value / 2;
      for (let i = 0, len = offsetTopList.value.length; i < len; i++) {
        const v = offsetTopList.value[i];
        if (nowTranslateY.value + v < halfViewHeight && offsetTopList.value[i + 1] && nowTranslateY.value + offsetTopList.value[i + 1] > halfViewHeight || !offsetTopList.value[i + 1])
          return i;
      }
      return -1;
    };
    const processKaraWord = (_eps, _index, _ps, _process, pos, count) => {
      if (props.isPasued) {
        karaokeStatus.value = { eps: _eps, index: _index, ps: _ps, process: _process, pos, count };
        clearTimeout(karaokeTimer.value);
        return;
      }
      const _ep = _eps[_index];
      if (count >= pos) {
        _process += _ps;
        _ep.style.backgroundImage = `-webkit-linear-gradient(top, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%), -webkit-linear-gradient(left, ${props.karaokeChangedColor} ${_process}%, ${props.karaokeBasicColor} 0%)`;
        if (_process >= 99) {
          if (_index + 1 >= _eps.length) {
            karaokeStatus.value = null;
            return;
          }
          _index++;
          const ts = Math.round(Number(_eps[_index].getAttribute("data-duration")) / step) === 0 ? 1 : Math.round(Number(_eps[_index].getAttribute("data-duration")) / step);
          _ps = 100 / ts;
          _process = 0;
          pos = Math.round(Number(_eps[_index].getAttribute("data-offset")) / step);
        }
      }
      count++;
      karaokeTimer.value = setTimeout(() => processKaraWord(_eps, _index, _ps, _process, pos, count), step);
    };
    const processKaraLine = (line) => {
      if (line)
        processKaraWord(line, 0, 100 / Math.round(Number(line[0].getAttribute("data-duration")) / step), 0, Math.round(Number(line[0].getAttribute("data-offset")) / step), 0);
    };
    onBeforeUpdate(() => {
      lyricLine.value = [];
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "lyricView",
        ref: lyricView,
        class: "lyric-view",
        onTouchstart: onTouchStart,
        onTouchmove: onTouchMove,
        onTouchend: onTouchEnd
      }, [
        __props.lyric ? (openBlock(), createElementBlock("div", {
          key: 0,
          ref_key: "lyricWrapper",
          ref: lyricWrapper,
          class: "lyric-wrapper",
          style: normalizeStyle({
            transform: `translate3d(0, ${nowTranslateY.value}px, 0)`,
            transition: `${isDragging.value ? "none" : `all ease ${__props.lyricScrollTime}ms`}`
          })
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(parsedLyric), (item, index) => {
            return openBlock(), createElementBlock("div", {
              ref_for: true,
              ref: (el) => {
                if (el != null)
                  lyricLine.value[index] = el;
              },
              key: index,
              style: normalizeStyle({ padding: `${unitDivide(__props.lyricMargin, 2)} 0` }),
              class: normalizeClass({
                [__props.lyricCenterClass]: index === centerLyricIdx.value,
                [__props.lyricActiveClass]: index === unref(activeLyricIdx)
              })
            }, [
              createElementVNode("p", {
                style: normalizeStyle({ lineHeight: __props.lyricLineheight }),
                class: normalizeClass({ karaok: karaokeAvailable.value }),
                innerHTML: item[1]
              }, null, 14, _hoisted_1),
              item[2] ? (openBlock(), createElementBlock("p", {
                key: 0,
                style: normalizeStyle({ lineHeight: __props.lyricLineheight }),
                class: normalizeClass({ karaok: karaokeAvailable.value }),
                innerHTML: item[2]
              }, null, 14, _hoisted_2)) : createCommentVNode("v-if", true)
            ], 6);
          }), 128))
        ], 4)) : createCommentVNode("v-if", true),
        createCommentVNode(" \u62D6\u62FD\u65F6\u4E2D\u95F4\u6807\u8BB0 "),
        isDragging.value ? (openBlock(), createElementBlock("div", _hoisted_3, [
          createElementVNode("div", {
            class: "triangle",
            style: normalizeStyle({
              borderColor: `transparent transparent transparent ${__props.triangleColor}`,
              borderWidth: `${unitDivide(__props.triangleWidth, 1.732)} 0 ${unitDivide(__props.triangleWidth, 1.732)} ${__props.triangleWidth}`
            }),
            onClick: changeCurrentTime
          }, null, 4),
          createElementVNode("div", {
            class: "line",
            style: normalizeStyle({ background: __props.centerLineColor })
          }, null, 4),
          createElementVNode("div", {
            class: "target-time",
            style: normalizeStyle({ color: __props.centerTimeColor })
          }, toDisplayString(unref(parsedLyric)[centerLyricIdx.value] && timeToStr(unref(parsedLyric)[centerLyricIdx.value][0])), 5)
        ])) : createCommentVNode("v-if", true)
      ], 544);
    };
  }
}));
var ASSLyric = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-86f05752"], ["__file", "J:/ass-lyric/src/ASSLyric.vue"]]);
export { ASSLyric as default };
