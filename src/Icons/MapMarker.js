export const MapMarker = ({ markerClassName }) => {
    const markerDiv = document.createElement('div')
    markerDiv.className = markerClassName
    const svgns = "http://www.w3.org/2000/svg"
    const markerSvg = document.createElementNS(svgns, 'svg')
    const iconPath = document.createElementNS(svgns, 'path')
    const valueOfD = "M182.9 551.7c0 .1.2.3.2.3s175.2-269 175.2-357.4c0-130.1-88.8-186.7-175.4-186.9C96.3 7.9 7.5 64.5 7.5 194.6 7.5 283 182.8 552 182.8 552l.1-.3zm-60.7-364.5c0-33.6 27.2-60.8 60.8-60.8 33.6 0 60.8 27.2 60.8 60.8S216.5 248 182.9 248c-33.5 0-60.7-27.2-60.7-60.8z"

    markerSvg.setAttribute('viewBox', "0 0 365 560")
    markerSvg.setAttribute('enable-background', 'new 0 0 365 560')
    iconPath.setAttribute('d', valueOfD)

    markerSvg.appendChild(iconPath)
    markerDiv.appendChild(markerSvg)

    return markerDiv
}
