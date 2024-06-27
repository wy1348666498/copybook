<template>
  <div class="container">
    <input v-model="text" placeholder="输入练习内容" />
    <button @click="generatePDF">生成 PDF</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PDFDocument } from 'pdf-lib'

const text = ref('')

const generatePDF = async () => {
  // 创建 PDF 文档
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595.28, 841.89]) // A4 size

  const fs = uni.getFileSystemManager()

  uni.chooseMedia({
    count: 1,
    mediaType: ['image'],
    sourceType: ['album', 'camera'],
    success: async (res) => {
      const sBase64 = fs.readFileSync(res.tempFiles[0].tempFilePath, 'base64')
      const jpgImage = await pdfDoc.embedPng(sBase64)
      page.drawImage(jpgImage, {
        x: 20,
        y: 20,
        width: page.getWidth() - 40,
        height: page.getHeight() - 40,
      })

      // 保存 PDF 文档
      const pdfBytes = await pdfDoc.saveAsBase64()
      const filePath = uni.env.USER_DATA_PATH + '/' + 'pdf.pdf'
      fs.writeFile({
        data: pdfBytes,
        filePath,
        encoding: 'base64',
        success: (r) => {
          uni.openDocument({
            filePath,
          })
        },
        complete: (r) => {
          console.log(r)
        },
      })
    },
  })
}
</script>

<style scoped>
.container {
}
</style>
