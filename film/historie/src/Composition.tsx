import { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Composition,
  Easing,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const C = {
  bg: "#0d1117",
  line: "#3d444d",
  ink: "#f0f6fc",
  muted: "#b7c0ca",
  mint: "#5effc4",
  mintDim: "#1e5c47",
};

// Facts only; each one is said out loud in SCRIPT.md
const MILESTONES = [
  { year: 2005, title: "Git", line: "napsal ho Linus Torvalds pro vývoj jádra Linuxu" },
  { year: 2008, title: "GitHub", line: "veřejný start: Git v cloudu, profily, Pages" },
  { year: 2018, title: "Microsoft", line: "kupuje GitHub za 7,5 mld. $ (v akciích)" },
  { year: 2019, title: "Actions", line: "obecně dostupné: build a nasazení po každém pushi" },
  { year: 2021, title: "Copilot", line: "technický preview AI, která doplňuje kód" },
  { year: 2025, title: "180+ milionů", line: "vývojářů, v průměru víc než 1 nový za sekundu" },
];

const FPS = 30;
const INTRO = 24;
const STEP = 66; // frames per milestone
const GAP = 760; // px between milestones on the track
const FOCUS_X = 700; // where the active milestone sits on screen
const DURATION = INTRO + STEP * MILESTONES.length + 45;

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

const History: React.FC = () => {
  useFonts();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // camera: a spring move to each milestone, so the track settles instead of sliding at constant speed
  const cam = MILESTONES.reduce((acc, _, i) => {
    if (i === 0) return acc;
    const s = spring({ frame: frame - (INTRO + i * STEP), fps, config: { damping: 200, stiffness: 90, mass: 1 } });
    return acc + s * GAP;
  }, 0);
  const trackX = FOCUS_X - cam;

  // the year rolls between milestones
  const yearAt = (() => {
    let y: number = MILESTONES[0].year;
    MILESTONES.forEach((m, i) => {
      if (i === 0) return;
      const t = interpolate(frame, [INTRO + i * STEP, INTRO + i * STEP + 26], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.2, 0, 0, 1),
      });
      y += (m.year - MILESTONES[i - 1].year) * t;
    });
    return Math.round(y);
  })();

  const lineDraw = interpolate(frame, [0, INTRO + STEP * (MILESTONES.length - 1) + 30], [0, GAP * (MILESTONES.length - 1)], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const intro = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp", easing: Easing.bezier(0.05, 0.7, 0.1, 1) });
  const outro = 1; // hold the 2025 frame: the deck shows it when you step back onto this slide

  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: '"Plex Sans", sans-serif', opacity: outro }}>
      <style>{fontCss}</style>

      {/* ambient: a dot grid drifting against the camera at a fraction of its speed */}
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${C.line} 1.6px, transparent 1.6px)`,
          backgroundSize: "48px 48px",
          backgroundPosition: `${-cam * 0.25}px 0px`,
          opacity: 0.35,
        }}
      />

      {/* year counter */}
      <div
        style={{
          position: "absolute",
          left: 140,
          top: 90,
          fontFamily: '"Plex Mono", monospace',
          fontWeight: 600,
          fontSize: 210,
          letterSpacing: "-0.04em",
          color: C.mint,
          opacity: intro,
          transform: `translateY(${(1 - intro) * 30}px)`,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {yearAt}
      </div>
      <div style={{ position: "absolute", right: 140, top: 120, fontSize: 44, color: C.muted, opacity: intro }}>Příběh GitHubu</div>
      <div style={{ position: "absolute", left: 140, bottom: 64, fontSize: 32, color: C.muted, opacity: intro }}>Zdroje: git-scm.com, github.blog, blogs.microsoft.com, GitHub Octoverse 2025</div>

      {/* the track: one commit per milestone */}
      <div style={{ position: "absolute", left: 0, top: 540, transform: `translateX(${trackX}px)` }}>
        <div style={{ position: "absolute", left: -2000, top: -3, width: 2000 + GAP * MILESTONES.length + 2000, height: 6, background: C.line }} />
        <div style={{ position: "absolute", left: 0, top: -4, width: lineDraw, height: 8, background: C.mint, borderRadius: 4 }} />
        {MILESTONES.map((m, i) => {
          const at = INTRO + i * STEP;
          const pop = spring({ frame: frame - at, fps, config: { damping: 12, stiffness: 180, mass: 0.6 } });
          const reveal = interpolate(frame, [at + 6, at + 22], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.05, 0.7, 0.1, 1),
          });
          const active = frame >= at && (frame < at + STEP || i === MILESTONES.length - 1);
          const dim = i === MILESTONES.length - 1 ? 1 : interpolate(frame, [at + STEP - 4, at + STEP + 12], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={m.year} style={{ position: "absolute", left: i * GAP, top: 0 }}>
              {/* secondary: a ring that expands once as the commit lands */}
              <div
                style={{
                  position: "absolute",
                  left: -26,
                  top: -26,
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  border: `4px solid ${C.mint}`,
                  opacity: frame < at ? 0 : interpolate(frame, [at, at + 20], [0.9, 0], { extrapolateRight: "clamp" }),
                  transform: `scale(${interpolate(frame, [at, at + 20], [1, 2.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: -22,
                  top: -22,
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: active ? C.mint : C.mintDim,
                  border: `5px solid ${C.mint}`,
                  transform: `scale(${Math.max(0.0001, pop)})`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: -10,
                  top: 70,
                  width: GAP - 40,
                  opacity: reveal * dim,
                  transform: `translateY(${(1 - reveal) * 40}px)`,
                }}
              >
                <div style={{ fontFamily: '"Plex Mono", monospace', fontWeight: 600, fontSize: 40, color: C.mint }}>{m.year}</div>
                <div style={{ fontWeight: 700, fontSize: 96, color: C.ink, letterSpacing: "-0.03em", lineHeight: 1.05, marginTop: 8 }}>{m.title}</div>
                <div style={{ fontWeight: 400, fontSize: 44, color: C.muted, marginTop: 18, lineHeight: 1.3 }}>{m.line}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const MyComposition = () => {
  return (
    <Composition id="Historie" component={History} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} />
  );
};
