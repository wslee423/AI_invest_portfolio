import { Font } from '@react-pdf/renderer'

let registered = false

export function registerFonts() {
  if (registered) return
  registered = true

  const base =
    typeof window !== 'undefined' ? window.location.origin : ''

  Font.register({
    family: 'NotoSansKR',
    fonts: [
      {
        src: `${base}/fonts/NotoSansKR-Regular.woff`,
        fontWeight: 400,
      },
      {
        src: `${base}/fonts/NotoSansKR-Bold.woff`,
        fontWeight: 700,
      },
    ],
  })
}
