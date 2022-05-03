<script lang="ts">
import { Console } from 'console'
import type { HtmlHTMLAttributes } from 'vue'
import { computed, defineComponent, nextTick, onBeforeUpdate, ref, watch } from 'vue'

export default defineComponent({
  name: 'ASSLyric',
})
</script>

<script setup lang="ts">
const props = defineProps({
  currentTime: {
    type: Number,
    required: true,
  },
  // 原词，格式为{开始时间: 歌词, ...}
  lyric: {
    type: String,
    required: true,
  }, // 当前唱到的歌词类名
  lyricActiveClass: {
    type: String,
    default: '',
  },
  // 拖拽时中间歌词类名
  lyricCenterClass: {
    type: String,
    default: '',
  },
  // 滚动到目标歌词时间，单位ms
  lyricScrollTime: {
    type: Number,
    default: 400,
  },
  // 拖拽结束后隔多长后恢复滚动
  dragendWaitTime: {
    type: Number,
    default: 3000,
  },
  // 每句歌词及翻译与下一句歌词及翻译的间隔
  lyricMargin: {
    type: String,
    default: '20px',
  },
  // 每句歌词及翻译行高
  lyricLineheight: {
    type: String,
    default: '1.5em',
  },
  // 拖拽时左边出现的三角形颜色
  triangleColor: {
    type: String,
    default: 'orange',
  },
  // 拖拽时左边出现的等边三角形的高度
  triangleWidth: {
    type: String,
    default: '40px',
  },
  // 拖拽时中间线的颜色
  centerLineColor: {
    type: String,
    default: '#ccc',
  },
  // 拖拽时中间歌词开始时间颜色
  centerTimeColor: {
    type: String,
    default: 'orange',
  },
})

const emit = defineEmits(['change-current-time'])

// 接收到的lyric文件
const lyricObject = ref(props.lyric)
// 开始接触的clientY
const startClientY = ref(0)
// 开始接触的translateY
const startTranslateY = ref(0)
// 是否正在拖拽
const isDragging = ref(false)
// 当前歌词容器滚动的高度
const nowTranslateY = ref(0)
// touchend后设置的定时器
const timer = ref()
// 找出当前视野中最接近中间的歌词，返回下标
const centerLyricIdx = ref(-1)
// 每句歌词的高度
const offsetHeightList = ref<number[]>([])
// 包裹全部歌词的容器
const wrapper = ref(null)
// 容器高度
const wrapperHeight = ref(0)
// 歌词可视区高度
const viewHeight = ref(0)
// 获取歌词view容器div
const lyricView = ref<null | HTMLElement>(null)
// 获取歌词wrapper容器div
const lyricWrapper = ref<null | HTMLElement>(null)
// 获取歌词行容器div
const lyricLine = ref<HTMLElement[]>([])

const firstLyricHeight = ref(0)
const lastLyricHeight = ref(0)

// 卡拉ok字幕用计时器
// 启动单个字推进的定时器
const karaokeTimer = ref()
// 默认刷新时长30ms，刷新时长配置对桌面歌词性能影响较大
const step = 10

// 包含原词和译词（译词在同一个文件）
/**
 * Parse lrc, suppose multiple time tag
 *
 * @param {String} lyric - Format:
 * [mm:ss]lyric
 * [mm:ss.xx]lyric
 * [mm:ss.xxx]lyric
 * [mm:ss.xx][mm:ss.xx][mm:ss.xx]lyric
 * [mm:ss.xx]<mm:ss.xx>lyric
 *
 * @return {String} [[time, text], [time, text], [time, text], ...]
 */
const parsedLyric = computed(() => {
  if (lyricObject.value) {
    const _lyricObject = lyricObject.value.replace(
      /([^\]^\n])\[/g,
      (p1: string) => `${p1}\n[`,
    )
    const lyric = _lyricObject.split('\n')
    const lrcInfo = new Map()
    let lrc = []
    const lyricLen = lyric.length
    for (let i = 0; i < lyricLen; i++) {
      // try match lrc time
      const lrcTimes = lyric[i].match(/\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/g)
      // try match lrv info tags
      const lrcInfoTags = lyric[i].match(/^\[\s*(\w+)\s*:(.*)]/g)
      if (lrcTimes) {
        // handle multiple time tag
        const timeLen = lrcTimes.length
        for (let j = 0; j < timeLen; j++) {
          const lrcTime = strToTime(lrcTimes[j])
          // match lrc text
          const lrcText = convertLrcText(lyric[i], strToTime(lrcTimes[j], true))
          lrc.push([lrcTime + lrcInfo.get('offset') / -1000, lrcText])
        }
      }
      else if (lrcInfoTags) {
        const paras = /^\[\s*(\w+)\s*:(.*)]/g.exec(lrcInfoTags[0])
        if (paras)
          lrcInfo.set(paras[1].trim(), paras[2].trim())
      }
    }
    // sort by time
    lrc = lrc.filter(item => item[1])
    lrc.sort((a: any, b: any) => a[0] - b[0])
    const _lrc = []
    for (let i = 0; i < lrc.length - 1; i++) {
      _lrc.push(lrc[i])
      if (lrc[i][0] === lrc[i + 1][0]) {
        _lrc[_lrc.length - 1][2] = lrc[i + 1][1]
        i++
      }
    }
    if (lrc[lrc.length - 1][0] !== _lrc[_lrc.length - 1][0])
      _lrc.push(lrc[lrc.length - 1])
    return _lrc
  }
  else {
    return []
  }
})

// 每句歌词及其翻译对应的div的offsetTop
const offsetTopList = computed(() => {
  const resultArr: any[] = []
  let totalHeight = 0
  if (lyricLine.value) {
    lyricLine.value.forEach((line: { offsetHeight: any }) => {
      const height = line.offsetHeight
      offsetHeightList.value.push(height)
      resultArr.push(totalHeight)
      totalHeight += height
    })
  }
  return resultArr
})

// 当前高亮的歌词下标（也就是第几句，从0开始）
const activeLyricIdx = computed(() => {
  const allLyric = parsedLyric.value
  const currentTime = props.currentTime
  for (let i = 0, len = allLyric.length; i < len; i++) {
    if (
      allLyric[i][0] <= currentTime
      && ((allLyric[i + 1] && allLyric[i + 1][0] > currentTime)
        || !allLyric[i + 1])
    )
      return i
  }
  return 0
})

// 第一句歌词距容器顶部的最大距离
const lyricTopPadding = computed(() => {
  return viewHeight.value / 2 - firstLyricHeight.value / 2
})

// 最后一句歌词距容器底部的最大距离
const lyricBottomPadding = computed(() => {
  return viewHeight.value / 2 - lastLyricHeight.value / 2
})

// nowTranslateY的最小值，也就是歌词向上滚动的最大值
const minTranslateY = computed(() => {
  return -(wrapperHeight.value - viewHeight.value + lyricBottomPadding.value)
})

watch(
  () => props.lyric,
  (newValue: string) => {
    lyricObject.value = newValue
  },
)

watch(
  () => props.currentTime,
  () => {
    updateLyricPos()
  },
)

watch(
  parsedLyric,
  () => {
    nextTick(() => {
      // 获取第1句 和最后 1句歌词高度
      setFirstLastLyricHeight()
      // 获取可视区高度
      viewHeight.value = lyricView.value?.offsetHeight || 0
      // 获取容器高度
      wrapperHeight.value = lyricWrapper.value?.offsetHeight || 0
      // 设置初始滚动
      nowTranslateY.value = lyricTopPadding.value
    })
  },
)

// 根据当前行调用karaoke
watch(
  activeLyricIdx,
  (newValue: number) => {
    processKaraLine(lyricLine.value[newValue].getElementsByTagName('span'))
  },
)

// 带单位的字符串除以数字，如60px/2=15px
const unitDivide = (unitNum: string, num: number) => {
  const num1 = parseFloat(unitNum)
  const unit = unitNum.replace(num1.toString(), '')
  return `${num1 / num}${unit}`
}

// 把mm:ss.xx或者mm:ss.xxx转换为秒数的形式
// 默认返回s，msFlag控制按照ms输出
const strToTime = (str: string, msFlag = false) => {
  const oneTime = /\[?(\d{2}):(\d{2})(\.(\d{2,3}))?]?/.exec(str)
  if (oneTime) {
    const min2sec = parseInt(oneTime[1]) * 60
    const sec2sec = parseInt(oneTime[2])
    if (!msFlag) {
      const msec2sec = oneTime[4]
        ? parseInt(oneTime[4])
                / (`${oneTime[4]}`.length === 2 ? 100 : 1000)
        : 0
      return min2sec + sec2sec + msec2sec
    }
    else {
      const msec2sec = oneTime[4]
        ? parseInt(oneTime[4])
        : 0
      return (min2sec + sec2sec) * 1000 + msec2sec
    }
  }
  else { return -1 }
}

// 把秒数转换为xx:xx的形式
const timeToStr = (num: number) => {
  num = Math.round(num)
  let second: any = num % 60
  let minute: any = Math.floor(num / 60)
  if (second < 10)
    second = `0${second}`

  if (minute < 10)
    minute = `0${minute}`

  return `${minute}:${second}`
}

// 转换<>
const convertLrcText = (lrcStr: string, baseTime: number) => {
  let resultStr = ''
  const _textWithTag = lrcStr.replace(/.*\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/g, '')
    .replace(/^\s+|\s+$/g, '')

  if (_textWithTag.search(/<(\d{2}):(\d{2})(\.(\d{2,3}))?>/g) !== -1) {
    const _lrcArr: string[] = _textWithTag.split(/<|>/)
    let _tempHTML = ''
    let _startTimePoint = -1
    for (const el of _lrcArr) {
      if (el.match(/(\d{2}):(\d{2})(\.(\d{2,3}))?/g)) {
        if (_startTimePoint !== -1) {
          _tempHTML = _tempHTML.replace('$2', (strToTime(el, true) - _startTimePoint).toString())
          resultStr += _tempHTML
        }
        _tempHTML = '<span data-offset="$1" data-duration="$2">$3</span>'
        _startTimePoint = strToTime(el, true)
        _tempHTML = _tempHTML.replace('$1', (_startTimePoint - baseTime).toString())
      }
      else { _tempHTML = _tempHTML.replace('$3', el) }
    }
  }
  else { resultStr = _textWithTag }

  return resultStr
}

// 设置第1句和最后1句歌词高度
const setFirstLastLyricHeight = () => {
  const lyricLines = lyricLine.value
  if (lyricLines) {
    firstLyricHeight.value = lyricLines[0].offsetHeight
    lastLyricHeight.value = lyricLines[lyricLines.length - 1].offsetHeight
  }
}

// 拖拽后点击视野中间左侧三角形更改进度
const changeCurrentTime = () => {
  emit('change-current-time', parsedLyric.value[centerLyricIdx.value][0])
  nextTick(() => {
    isDragging.value = false
  })
}

// 实时获取当前元素的translateY
const getTranslateY = (el: null | Element) => {
  if (el) {
    const curStyle = window.getComputedStyle(el)
    const curTransform = curStyle.transform || curStyle.webkitTransform
    return curTransform.split(',')[5].replace(')', '')
  }
  return null
}

// 更新歌词位置
const updateLyricPos = () => {
  // 没有拖拽歌词
  if (!isDragging.value) {
    const scrollTarget
      = offsetTopList.value[activeLyricIdx.value]
      + offsetHeightList.value[activeLyricIdx.value] / 2
      - viewHeight.value / 2
    nowTranslateY.value = -scrollTarget
  }
}

// 触屏事件
const onTouchStart = (e: TouchEvent) => {
  isDragging.value = true
  clearTimeout(timer.value)
  startClientY.value = e.touches[0].clientY
  startTranslateY.value = Number(getTranslateY(wrapper.value))
  nowTranslateY.value = startTranslateY.value
}

const onTouchMove = (e: TouchEvent) => {
  e.preventDefault() // 防止屏幕跟着滚动
  const clientY = e.touches[0].clientY
  const targetTranslateY = startTranslateY.value + clientY - startClientY.value
  if (targetTranslateY > lyricTopPadding.value) {
    // 抵达上边界
    nowTranslateY.value = lyricTopPadding.value
  }
  else if (targetTranslateY < minTranslateY.value) {
    // 移出下边界
    nowTranslateY.value = minTranslateY.value
  }
  else {
    nowTranslateY.value = targetTranslateY
    centerLyricIdx.value = findCenterLyricIdx()
  }
}

const onTouchEnd = () => {
  timer.value = setTimeout(() => {
    isDragging.value = false
    centerLyricIdx.value = -1
  }, props.dragendWaitTime)
}

// 找出当前视野中最接近中间的歌词，返回下标
const findCenterLyricIdx = () => {
  const halfViewHeight = viewHeight.value / 2
  for (let i = 0, len = offsetTopList.value.length; i < len; i++) {
    const v = offsetTopList.value[i]
    if (
      (nowTranslateY.value + v < halfViewHeight
        && offsetTopList.value[i + 1]
        && nowTranslateY.value + offsetTopList.value[i + 1] > halfViewHeight)
      || !offsetTopList.value[i + 1]
    )
      return i
  }
  return -1
}

/*
处理单个显示元素
_eps: dom节点列表，表示歌词中单个显示元素
_index: 当前变化元素的索引
_ps: process step，每次timeout推进的步长
_process: 当前变化元素的进度（0-100）
pos: 对该元素进行处理时间点，在哪个timeout点处理
count: timeout的次数
*/
const processKaraWord = (_eps: HTMLCollectionOf<HTMLSpanElement>, _index: number, _ps: number, _process: number, pos: number, count: number) => {
  const _ep = _eps[_index]
  if (count >= pos) {
    _process += _ps
    _ep.style.backgroundImage = `-webkit-linear-gradient(top, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%), -webkit-linear-gradient(left, #f00 ${_process}%, #00f 0%)`
    if (_process >= 99) {
      if ((_index + 1) >= _eps.length) { // 该句结束退出
        return
      }
      _index++
      const ts = Math.round(Number(_eps[_index].getAttribute('data-duration')) / step) === 0 ? 1 : Math.round(Number(_eps[_index].getAttribute('data-duration')) / step)
      _ps = 100 / ts
      _process = 0
      pos = Math.round(Number(_eps[_index].getAttribute('data-offset')) / step)
    }
  }
  count++
  karaokeTimer.value = setTimeout(() => processKaraWord(_eps, _index, _ps, _process, pos, count), step)
}

/*
处理单行
*/
const processKaraLine = (line: HTMLCollectionOf<HTMLSpanElement>) => {
  if (line)
    processKaraWord(line, 0, 100 / Math.round(Number(line[0].getAttribute('data-duration')) / step), 0, Math.round(Number(line[0].getAttribute('data-offset')) / step), 0)
}

onBeforeUpdate(() => {
  lyricLine.value = []
})
</script>

// 歌词滚动组件
<template>
  <div
    ref="lyricView"
    class="lyric-view"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <div
      v-if="lyric"
      ref="lyricWrapper"
      class="lyric-wrapper"
      :style="{
        transform: `translate3d(0, ${nowTranslateY}px, 0)`,
        transition: `${isDragging ? 'none' : `all ease ${lyricScrollTime}ms`}`,
      }"
    >
      <div
        v-for="(item, index) in parsedLyric"
        :ref="el=>{lyricLine[index]=el}"
        :key="index"
        :style="{ padding: `${unitDivide(lyricMargin, 2)} 0` }"
        :class="{
          [lyricCenterClass]: index === centerLyricIdx,
          [lyricActiveClass]: index === activeLyricIdx,
        }"
      >
        <p :style="{lineHeight: lyricLineheight}" class="karaok" v-html="item[1]" />
        <p v-if="item[2]" :style="{lineHeight: lyricLineheight}" class="karaok" v-html="item[2]" />
      </div>
    </div>

    <!-- 拖拽时中间标记 -->
    <div v-if="isDragging" class="center-mark">
      <div
        class="triangle"
        :style="{
          borderColor: `transparent transparent transparent ${triangleColor}`,
          borderWidth: `${unitDivide(triangleWidth, 1.732)} 0 ${unitDivide(
            triangleWidth,
            1.732
          )} ${triangleWidth}`,
        }"
        @click="changeCurrentTime"
      />
      <div class="line" :style="{ background: centerLineColor }" />
      <div class="target-time" :style="{ color: centerTimeColor }">
        {{
          parsedLyric[centerLyricIdx] &&
            timeToStr(parsedLyric[centerLyricIdx][0])
        }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.lyric-view {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  .center-mark {
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    display: flex;
    align-items: center;
    // 拖拽三角形
    .triangle {
      border-style: solid;
    }

    // 中间指示线
    .line {
      flex: 1;
      height: 1px;
      margin: 0 20px;
    }
  }
}
.lyric-wrapper {
  transition: ease 0.3s;
  // 每一句歌词及其翻译
  & > div p {
    padding: 0;
    margin: 0;
  }
}

.karaok {
  -webkit-box-orient:horizontal;
  -webkit-box-align:center;
  -webkit-filter:brightness(2);
  filter: brightness(2);

  // 所有span添加卡拉OK用css
  ::v-deep & > span {
    background:-webkit-linear-gradient(top, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%), -webkit-linear-gradient(left, #f00 0%, #00f 0%);
    -webkit-background-clip:text;
    background-clip: text;
    -webkit-text-fill-color:transparent;
    /*-webkit-text-stroke:1px #f00;*/
    //-webkit-filter:drop-shadow(0px 0px 1px #f00);
}
 }
</style>
