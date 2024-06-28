import { PDFDocument } from 'pdf-lib'

/**
 * @description 生成pdf文件到本地
 * @param urls
 * @param fileName
 */
export async function generatePdfFile(urls: string[], fileName: string = 'pdf.pdf') {
  try {
    const fs: UniApp.FileSystemManager = uni.getFileSystemManager()
    // 创建 PDF 文档
    const pdfDoc = await PDFDocument.create()
    for (let i = 0; i < urls.length; i++) {
      const page = pdfDoc.addPage([595.28, 841.896])
      const imageBytes = fs.readFileSync(urls[i], 'base64')
      const pngImage = await pdfDoc.embedPng(imageBytes)
      page.drawImage(pngImage, {
        x: 0,
        y: 0,
        width: page.getWidth(),
        height: page.getHeight(),
      })
    }
    const base64 = await pdfDoc.saveAsBase64()
    const filePath = `${uni.env.USER_DATA_PATH}/${fileName}`
    fs.writeFileSync(filePath, base64, 'base64')
    fs.saveFileSync(filePath, filePath)
    return filePath
  } catch (e) {
    console.error(e)
    return ''
  }
}
