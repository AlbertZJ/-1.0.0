import defaultSettings from '@/settings'

const title = defaultSettings.title || '蜀国一游'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
