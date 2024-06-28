<template>
  <view>
    <button>生成 PDF</button>
    <CanvasToUrl />
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import TianZiGe from '@/static/images/huigongge.svg'
import { generatePdfFile } from '@/utils'
import CanvasToUrl from '@/components/CanvasToUrl.vue'

const canvasWidth = ref(938)
const canvasHeight = ref(1326.6)

const textVal =
  '若测试打印内容测试打印内容测试打印内容测试打印内容测试打印内容测试打印内容测试打印内容测试打印内容测试打印内容测试打印内容测试打印内容测试打印内容测试打印内容测试打印内容测试打印内容测试打印内容测试打印内容测试打印内容测试打印内容测试打印内容测试打印内容测试打印内容测试打印内容测试打印内容测试打印内容测试打印内容测试打印内容测试打印内容测试打印内容测试打印内容测试打印内容测试打印内容测试打印内容测试打印内容测试打印内容测试打印内容测试打印内容测试打印内容'
let ctx: UniApp.CanvasContext

const charsPerLine = 12
const gridSize = 80
const spacing = 8 // 上下间距

const fs: UniApp.FileSystemManager = uni.getFileSystemManager()

onMounted(() => {
  ctx = uni.createCanvasContext('canvasA')
})

const generatePDF = async () => {
  // 清除画布
  ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)

  const cols = charsPerLine
  const rows = Math.floor((canvasHeight.value + spacing) / (gridSize + spacing)) // 考虑上下间距的行数

  // 绘制背景格子
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const yOffset = row * (gridSize + spacing) // 考虑上下间距
      ctx.drawImage(TianZiGe, col * (gridSize - 2), yOffset, gridSize, gridSize)
    }
  }

  // 设置字体和大小
  ctx.setFontSize(40)
  ctx.setFillStyle('#333333')
  ctx.setTextAlign('center')
  ctx.setTextBaseline('middle')

  // 绘制字帖内容
  let index = 0
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (index < textVal.length) {
        const yOffset = row * (gridSize + spacing) // 考虑上下间距
        const x = col * (gridSize - 2) + gridSize / 2
        const y = yOffset + gridSize / 2
        ctx.fillText(textVal[index], x, y)
        index++
      }
    }
  }

  ctx.draw(false, () => {
    uni.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: canvasWidth.value,
      height: canvasHeight.value,
      fileType: 'png',
      canvasId: 'canvasA',
      success: async (res) => {
        const filePath = await generatePdfFile([res.tempFilePath, res.tempFilePath])
        await uni.openDocument({ filePath })
      },
      fail: (err) => {
        console.warn(err)
      },
      complete: () => {
        uni.hideLoading()
      },
    })
  })
}
</script>

<style scoped></style>
