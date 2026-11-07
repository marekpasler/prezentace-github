import { useEffect, useState } from "react";
import { AbsoluteFill, Composition, Easing, continueRender, delayRender, interpolate, staticFile, useCurrentFrame } from "remotion";

/*
  "Příběh GitHubu" — variant V1 "Kapitoly" (28 s).
  One milestone per screen. Only the year digits that change roll (no in-between years);
  title and line leave up and arrive from below; a thin progress line fills to the next stop.
  Motion: power3 family only, 0.6 / 1.2 s, no overshoot; each chapter holds ≥ 3.3 s still.
*/

const C = { bg: "#0d1117", line: "#3d444d", ink: "#f0f6fc", muted: "#b7c0ca", mint: "#5effc4" };

// verified facts only; the presenter speaks over each chapter (SCRIPT.md, slide 3)
const CH = [
  { year: "2005", title: "Git", line: "Linus Torvalds, pro jádro Linuxu", src: "git-scm.com" },
  { year: "2008", title: "GitHub", line: "veřejný start, Git v cloudu", src: "github.blog" },
  { year: "2018", title: "Microsoft", line: "kupuje GitHub za 7,5 mld. $ v akciích", src: "blogs.microsoft.com" },
  { year: "2019", title: "Actions", line: "build a nasazení po každém pushi", src: "github.blog, changelog" },
  { year: "2021", title: "Copilot", line: "AI doplňuje kód, technický preview", src: "github.blog" },
  { year: "2025", title: "180+ milionů", line: "vývojářů na GitHubu", src: "GitHub Octoverse 2025" },
];

const FPS = 30;
const INTRO = 30; // 1 s before chapter 1 is settled
const LEN = 135; // 4.5 s per chapter
const ROLL = 36; // 1.2 s year roll / progress fill
const SWAP = 18; // 0.6 s title out / in
const DURATION = INTRO + LEN * CH.length; // 840 frames = 28 s
const start = (i: number) => INTRO + i * LEN;

const OUT = Easing.bezier(0.33, 1, 0.68, 1); // power3.out
const IN = Easing.bezier(0.32, 0, 0.67, 0); // power3.in
const MOVE = Easing.bezier(0.65, 0, 0.35, 1); // power3.inOut
const t01 = (f: number, a: number, len: number, ease: (n: number) => number) =>
  interpolate(f, [a, a + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

const fontCss = `
@font-face { font-family: "Plex Sans"; font-weight: 700; src: url(${staticFile("fonts/plex-sans-700-latin.woff2")}) format("woff2"); unicode-range: U+0000-00FF, U+2000-206F; }
@font-face { font-family: "Plex Sans"; font-weight: 700; src: url(${staticFile("fonts/plex-sans-700.woff2")}) format("woff2"); unicode-range: U+0100-024F; }
@font-face { font-family: "Plex Sans"; font-weight: 400; src: url(${staticFile("fonts/plex-sans-400-latin.woff2")}) format("woff2"); unicode-range: U+0000-00FF, U+2000-206F; }
@font-face { font-family: "Plex Sans"; font-weight: 400; src: url(${staticFile("fonts/plex-sans-400.woff2")}) format("woff2"); unicode-range: U+0100-024F; }
@font-face { font-family: "Plex Mono"; font-weight: 600; src: url(${staticFile("fonts/plex-mono-600-latin.woff2")}) format("woff2"); }
`;

const useFonts = () => {
  const [handle] = useState(() => delayRender("fonts"));
  useEffect(() => {
    const families = ['700 80px "Plex Sans"', '400 40px "Plex Sans"', '600 80px "Plex Mono"'];
    Promise.all(families.map((f) => document.fonts.load(f, "Příběh 0123")))
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
  }, [handle]);
};

// one year digit in a mask: the old digit leaves up while the new one arrives from below
const Digit: React.FC<{ prev: string | null; cur: string; p: number }> = ({ prev, cur, p }) => (
  <span style={{ display: "inline-block", position: "relative", overflow: "hidden", height: "1em", lineHeight: 1, verticalAlign: "top" }}>
    <span style={{ visibility: "hidden" }}>{cur}</span>
    {prev !== null && prev !== cur && <span style={{ position: "absolute", left: 0, top: 0, transform: `translateY(${-p * 110}%)` }}>{prev}</span>}
    <span style={{ position: "absolute", left: 0, top: 0, transform: `translateY(${prev === cur ? 0 : (1 - p) * 110}%)` }}>{cur}</span>
  </span>
);

const History: React.FC = () => {
  useFonts();
  const f = useCurrentFrame();
  let k = 0;
  CH.forEach((_, i) => { if (i > 0 && f >= start(i)) k = i; });
  const cur = CH[k], prev = k > 0 ? CH[k - 1] : null;

  // year: chapter 1 rises in; later chapters roll only the digits that change
  const digits = cur.year.split("").map((d, i) => {
    if (k === 0) return <Digit key={i} prev={null} cur={d} p={t01(f, 4 + i * 3, SWAP, OUT)} />;
    return <Digit key={i} prev={prev!.year[i]} cur={d} p={t01(f, start(k), ROLL, MOVE)} />;
  });

  // title block: the previous one leaves up, the new one arrives from below
  const block = (c: (typeof CH)[number], y: number, o: number) => (
    <div style={{ position: "absolute", left: 170, top: 560, transform: `translateY(${y}px)`, opacity: o }}>
      <div style={{ fontWeight: 700, fontSize: 140, lineHeight: 1, letterSpacing: "-0.03em", color: C.ink }}>{c.title}</div>
      <div style={{ fontSize: 56, color: C.muted, marginTop: 34 }}>{c.line}</div>
      <div style={{ fontSize: 36, color: C.muted, marginTop: 22, opacity: 0.85 }}>Zdroj: {c.src}</div>
    </div>
  );
  const inStart = k === 0 ? 12 : start(k) + SWAP; // the old block is gone before the new one arrives
  const e = t01(f, inStart, SWAP, OUT);
  const x = k > 0 ? t01(f, start(k), SWAP, IN) : 1;

  // progress: six stops, the line fills to the current one
  const fill = k === 0 ? 0 : interpolate(t01(f, start(k), ROLL, MOVE), [0, 1], [(k - 1) / 5, k / 5]);
  const barIn = t01(f, 0, SWAP, OUT);

  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: '"Plex Sans", sans-serif' }}>
      <style>{fontCss}</style>
      <div style={{ position: "absolute", left: 160, top: 200, fontFamily: '"Plex Mono", monospace', fontWeight: 600, fontSize: 300, letterSpacing: "-0.04em", color: C.mint, lineHeight: 1 }}>
        {digits}
      </div>
      {prev && x < 1 && block(prev, -24 * x, 1 - x)}
      {block(cur, 24 * (1 - e), e)}
      <div style={{ position: "absolute", left: 160, right: 160, top: 940, height: 6, background: C.line, opacity: barIn }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${fill * 100}%`, background: C.mint }} />
        {CH.map((_, i) => {
          const on = i / 5 <= fill + 1e-6;
          return <div key={i} style={{ position: "absolute", left: `${(i / 5) * 100}%`, top: -9, width: 24, height: 24, marginLeft: -12, borderRadius: "50%", border: `5px solid ${on ? C.mint : C.line}`, background: on ? C.mint : C.bg }} />;
        })}
      </div>
    </AbsoluteFill>
  );
};

export const MyComposition = () => <Composition id="Historie" component={History} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} />;
