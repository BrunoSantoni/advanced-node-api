import axios from 'axios'
import { S3FileStorage } from '@/infra/sdks'
import { env } from '@/main/config/env'

describe('AWS S3 Integration Tests', () => {
  let fileName: string
  let file: Buffer
  let onePixelImage: string

  let sut: S3FileStorage

  beforeAll(() => {
    fileName = 'any_filename.png'
    onePixelImage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjME/c8x8ABHsCVDusIskAAAAASUVORK5CYII='
    file = Buffer.from(onePixelImage, 'base64')
  })

  beforeEach(() => {
    sut = new S3FileStorage(
      env.s3.accessKey,
      env.s3.secret,
      env.s3.bucket
    )
  })

  it('should upload and delete image from aws s3', async () => {
    const pictureUrl = await sut.upload({
      fileName,
      file
    })

    // Testa com o Axios se a URL obtida da imagem é válida.
    expect((await axios.get(pictureUrl)).status).toBe(200)

    await sut.delete({ fileName })

    // Testa com o Axios se a URL obtida da imagem foi deletada.
    await expect(axios.get(pictureUrl)).rejects.toThrow()
  })
})
