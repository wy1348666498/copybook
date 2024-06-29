<template>
  <view></view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import TianZiGe from '@/static/images/huigongge.svg'
import PinYin from '@/static/images/pinyin.svg'
import { generatePdfFile } from '@/utils'

const canvasWidth = 938
const canvasHeight = 1326.6

// 每行多少格子
const charsPerLine = 12
// 格子大小
const gridSize = 80
// 上下间距
const spacing = 8
// 拼音格子宽
const pinyinWidth = 80
// 拼音格子高
const pinyinHeight = 51

let ctx: any
let canvas: any

// 定义类型
interface TextOption {
  char: string
  pinyin: string
  color: string
  fontSize: number
  fontFamily: string
  opacity: number
}

interface PageOption {
  backgroundUrl: string
  hasPinyin: boolean
  pinyinBackgroundUrl: string
  texts: TextOption[][]
}

const pagesOptions: PageOption[] = [
  {
    backgroundUrl: TianZiGe,
    hasPinyin: true,
    pinyinBackgroundUrl: PinYin,
    texts: [
      [
        {
          char: '你',
          pinyin: 'nǐ',
          color: '#333333',
          fontSize: 40,
          fontFamily: '',
          opacity: 1,
        },
        {
          char: '好',
          pinyin: 'hǎo',
          color: '#333333',
          fontSize: 40,
          fontFamily: '',
          opacity: 1,
        },
      ],
      [
        {
          char: '才',
          pinyin: 'cái',
          color: '#333333',
          fontSize: 40,
          fontFamily: '',
          opacity: 1,
        },
        {
          char: '怪',
          pinyin: 'guài',
          color: '#333333',
          fontSize: 40,
          fontFamily: '',
          opacity: 1,
        },
      ],
    ],
  },
]

async function generateCanvas(page: PageOption) {
  const totalHeight = canvasHeight - 2 * spacing
  const lineHeight = page.hasPinyin ? gridSize + pinyinHeight : gridSize
  const linesPerPage = Math.floor(totalHeight / lineHeight)

  ctx.clearRect(0, 0, canvasWidth, canvasHeight)

  // Draw grid background
  const bgImage = await loadImage(page.backgroundUrl)
  for (let y = 0; y < linesPerPage; y++) {
    for (let x = 0; x < charsPerLine; x++) {
      ctx.drawImage(
        bgImage,
        x * (gridSize - 2),
        y * lineHeight + (page.hasPinyin ? pinyinHeight : 0),
        gridSize,
        gridSize,
      )
    }
  }

  if (page.hasPinyin) {
    const pinyinBgImage = await loadImage(page.pinyinBackgroundUrl)
    for (let y = 0; y < linesPerPage; y++) {
      for (let x = 0; x < charsPerLine; x++) {
        ctx.drawImage(pinyinBgImage, x * (gridSize - 2), y * lineHeight, pinyinWidth, pinyinHeight)
      }
    }
  }

  // Draw text
  for (let y = 0; y < linesPerPage; y++) {
    if (!page.texts[y]) continue
    for (let x = 0; x < charsPerLine; x++) {
      const textOption = page.texts[y][x]
      if (!textOption) continue
      ctx.font = `${textOption.fontSize}px ${textOption.fontFamily || 'sans-serif'}`
      ctx.fillStyle = textOption.color
      ctx.globalAlpha = textOption.opacity
      const charX = x * (gridSize - 2) + (gridSize - textOption.fontSize) / 2
      const charY =
        y * lineHeight + (page.hasPinyin ? pinyinHeight : 0) + (gridSize + textOption.fontSize) / 2
      ctx.fillText(textOption.char, charX, charY)
      if (page.hasPinyin) {
        const pinyinX = x * (gridSize - 2) + (gridSize - textOption.fontSize) / 2
        const pinyinY =
          y * lineHeight + (pinyinHeight - textOption.fontSize) / 2 + textOption.fontSize
        ctx.fillText(textOption.pinyin, pinyinX, pinyinY)
      }
    }
  }

  const res = await uni.canvasToTempFilePath({ canvasId: '', canvas })
  console.log(res.tempFilePath, 'res.tempFilePath')
  // 获取画完后的数据
  const filePath = await generatePdfFile([res.tempFilePath])
  filePath && (await uni.openDocument({ filePath }))
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = canvas.createImage()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

onMounted(() => {
  canvas = uni.createOffscreenCanvas({ type: '2d', width: canvasWidth, height: canvasHeight })
  ctx = canvas.getContext('2d')
  generateCanvas(pagesOptions[0])
})
</script>
