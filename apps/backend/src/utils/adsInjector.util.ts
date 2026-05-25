import { JSDOM } from "jsdom";

type AdType = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

const adInjector = (description: string, adArray: Array<{ desktop: AdType; mobile: AdType }>) => {
  const P_NODE_NAME = "P"; // PARAGRAPH constant

  const dom = new JSDOM(description);
  let adThreshold = 1500; // Minimum length of text to inject ads
  let currentTextLength = 0;

  dom.window.document.body.childNodes.forEach((node: Node) => {
    currentTextLength += node.textContent ? node.textContent.length : 0;

    if (node.nodeName === P_NODE_NAME && currentTextLength >= adThreshold && adArray.length > 0) {
      const { desktop, mobile } = adArray.shift()!;

      const aspectRatioMobile = ((mobile.height / mobile.width) * 100).toFixed(2);
      const aspectRatioDesktop = ((desktop.height / desktop.width) * 100).toFixed(2);

      const mobileHTML = `<div class="mobileAd" style="max-width: 320px; margin: 0 auto;"><div style="padding-bottom: ${aspectRatioMobile}%; position: relative; overflow: hidden;"><img src="${mobile.src}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" alt="${mobile.alt}" /></div></div>`;
      const desktopHTML = `<div class="desktopAd" style="margin: 0 auto;"><div style="padding-bottom: ${aspectRatioDesktop}%; position: relative; overflow: hidden;"><img src="${desktop.src}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" alt="${desktop.alt}" /></div></div>`;

      dom.window.document.body.insertBefore(JSDOM.fragment(`${desktopHTML}${mobileHTML}`), node.nextSibling);
      currentTextLength = 0; // Reset after injecting ad
    }
  });

  dom.window.document.body.appendChild(
    JSDOM.fragment(
      `<style>@media screen and (min-width: 1200px) {.desktopAd {display: block} .mobileAd {display: none}} @media screen and (max-width: 1199px) {.mobileAd {display: block} .desktopAd {display: none}}</style>`
    )
  );

  return dom.serialize();
};

export default adInjector;
