<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  ref,
  watch,
} from 'vue'
import ASSLyric from './ASSLyric.vue'

export default defineComponent({
  name: 'App',
})
</script>

<script setup lang="ts">
const musicSrc = ref('../public/samples/2021.06.25 A 愛にできることはまだあるかい.m4a')
// 歌词
const lyricFile = ref('')
// 当前播放时间
const currentTime = ref(0)

const audio = ref<HTMLVideoElement | null>(null)

// 将00:00.00转换为秒数
const timeStrToNum = (str: string) => {
  const minute = Number(str.slice(0, 2))
  const second = Number(str.slice(3, 5))
  const minSec = Number(str.slice(6, 8))
  return minute * 60 + second + minSec / 100
}

// 更新播放时间
const timeupdate = () => {
  changeCurrentTime(audio.value?.currentTime || 0)
}
const changeCurrentTime = (newTime: number) => {
  currentTime.value = newTime
}
const handleChangeCurrentTime = (time: number) => {
  if (audio.value)
    audio.value.currentTime = time
}

const readFile = (filePath: string) => {
  // 创建一个新的xhr对象
  let xhr = null
  const okStatus = document.location.protocol === 'file' ? 0 : 200
  xhr = new XMLHttpRequest()
  xhr.open('GET', filePath, false)
  xhr.overrideMimeType('text/html;charset=utf-8')
  xhr.send(null)
  return xhr.status === okStatus ? xhr.responseText : null
}

onMounted(() => {
  lyricFile.value
    = readFile('../public/samples/2021.06.25 A 愛にできることはまだあるかい.lrc') || ''
})
</script>

<template>
  <div id="app">
    <div class="audio-wrapper">
      <audio
        ref="audio"
        controls
        class="music-player"
        :src="musicSrc"
        :loop="true"
        @timeupdate="timeupdate"
      />
    </div>

    <div class="lyric">
      <ASSLyric
        :lyric="lyricFile"
        :lyric-active-class="'lyric-active'"
        :lyric-center-class="'lyric-center'"
        triangle-width="14px"
        triangle-color="#fff"
        center-line-color="#fff"
        center-time-color="#fff"
        :current-time="currentTime"
        @change-current-time="handleChangeCurrentTime"
      />
    </div>
  </div>
</template>

<style lang="scss">
html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
#app {
  width: 100%;
  height: 100%;
  font-size: 16px;
  display: grid;
  grid-template-rows: 100px calc(100vh - 120px);
  justify-content: center;
  background-color: #64363c;
  margin: 0 auto;
}
.audio-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lyric {
  width: 100%;
  color: #adaaa8;
  box-sizing: border-box;
  border: 1px dashed #ccc;
  box-sizing: border-box;
  text-align: center;
}
.lyric-active {
  // 需要最高级，否则可能被内部的.center-lyric覆盖
  color: #fff !important;
}
.lyric-center {
  color: #fff;
}
</style>
