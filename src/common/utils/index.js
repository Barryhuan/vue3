let lastTime
const stableIntervalKey = []
export function setStableInterval(callback, interval) {
  const keyIndex = stableIntervalKey.length
  const nextTimeoutCallback = () => {
    lastTime = new Date().getTime()
    callback()
    if (stableIntervalKey[keyIndex]) {
      const currentTime = new Date().getTime()
      const nextInterval = interval - (currentTime - lastTime) % interval
      stableIntervalKey[keyIndex] = window.setTimeout(nextTimeoutCallback, nextInterval)
    }
  }
  stableIntervalKey[keyIndex] = window.setTimeout(nextTimeoutCallback, interval)
  return keyIndex
}

export function clearStableInterval(index) {
  if (stableIntervalKey[index]) {
    window.clearTimeout(stableIntervalKey[index])
    stableIntervalKey[index] = null
  }
}

export function aoiPathStrFormat(str) {
  if (str === "-") {
    return []
  }
  const pathStr = str
    .replace("MULTIPOLYGON ", "")
    .replace(/\(/g, "")
    .replace(/\)/g, "");
  return pathStr.split(",").map(lnglatStr => lnglatStr.split(" ").map((lngOrLat) => +lngOrLat));
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}