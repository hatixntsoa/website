# 📖 Personal Portfolio

My personal website. Plain HTML, CSS and vanilla JavaScript. No framework, no build step, no dependencies, because you know with all those AI Vuln slops lately I prefer not to worry at each release on the future.

## 👀 About this site

I am a polymath and highly curious person, and this site is a small reflection of that. It is minimal on the surface, with a monospace look, a light and dark theme, and a quiet particle background. If you look closer, there are a few things hidden in it.

## 🥚The easter egg

Watch the big name at the top for a few seconds. It scrambles into strings of random-looking text before settling back into my name.

It looks random, but it is not. Each scramble is the name run through a different algorithm: some encodings, some ciphers, some hashes. They are real, they are cycled one after another, and they are all computed in the browser with no libraries.

If you are curious like me, open [animated-name.js](https://github.com/hatixntsoa/website/blob/master/scripts/animated-name.js) and see how many you can recognize. Adding your own is just one more line in the list.

## 🧐 The story behind the background

I started programming when I was 14, out of pure curiosity about how games are built, haha I still remember writing raw batch script games with what we call spaghetti code, it was fun. Then I got carried away, and I fell in love with making JavaScript games with the canvas element.

Back then I spent weeks debugging very long lines of JavaScript, only to find out the whole problem was a missing semicolon. Haha. I still think about it every time a bug takes more than five minutes, well not anymore because now I debug mainly with the help of LLMs, at least I don't have to relive those debugging hell sessions anymore hehe.

> Why am I being nostalgic now? Anyways.

That is why the animated background is a canvas particle field. It is a gentle reminder, and a bit of nostalgia maybe, of those early days. You can find it in [particles.js](https://github.com/hatixntsoa/website/blob/master/scripts/particles.js).

## 🧩Features

- All text and links live in a single file, [content.js](https://github.com/hatixntsoa/website/blob/master/data/content.js)
- Light and dark theme with a sun and moon toggle, saved between visits
- Animated name that cycles through encodings, ciphers and hashes
- Canvas particle background with mouse and touch parallax
- Fits the screen without a vertical scrollbar, on desktop and mobile
- Respects reduced motion settings

## 🚧 Project structure

```text
.
├── index.html
├── assets/
│   ├── favicon.ico
│   ├── favicon.png
│   └── fonts/
├── data/
│   └── content.js
├── scripts/
│   ├── theme-init.js
│   ├── render-content.js
│   ├── particles.js
│   ├── footer.js
│   ├── animated-name.js
│   ├── theme-chooser.js
│   └── fit-screen.js
└── styles/
    └── style.css
```


## ©️ Credits

- Original design and name animation idea inspired from [tsirysndr/me](https://github.com/tsirysndr/me) as of today 11/25/2026.
- Font: Caskaydia Cove Nerd Font Mono from [Nerd Fonts](https://www.nerdfonts.com)
