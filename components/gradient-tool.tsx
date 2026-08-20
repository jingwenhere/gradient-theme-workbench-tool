"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Dices, Pause, Play, Sparkles } from "lucide-react";
import "./gradient-tool.css";

type Gradient = { name: string; from: string; to: string; direction?: "up" | "down" };

export const gradients: Gradient[] = [
  { name: "粉樱", from: "#efd0d4", to: "#e2e4fc" },
  { name: "晨曦", from: "#cfe0c3", to: "#95b8d1" },
  { name: "雾蓝", from: "#f0c9fa", to: "#ffd9f4", direction: "up" },
  { name: "草木", from: "#dcfcf5", to: "#f4ecd6" },
  { name: "梦幻", from: "#fca47c", to: "#f5f4ce" },
  { name: "薄荷", from: "#b8e0d2", to: "#65a1cc" },
  { name: "桃汽", from: "#f5ced4", to: "#ffa9c1", direction: "up" },
  { name: "青瓷", from: "#b6dce6", to: "#fec4b1" },
  { name: "柠芽", from: "#fdf5a1", to: "#b0f2bd" },
  { name: "莓果", from: "#bcbcfc", to: "#f2d4e9" },
  { name: "海盐", from: "#bcf0fc", to: "#f2d4e9" },
  { name: "珊瑚", from: "#ffb8a5", to: "#c8e4e4" },
  { name: "轻雾", from: "#e3fadd", to: "#a3e7f3" },
  { name: "落日", from: "#bee1fb", to: "#ea8e8e" },
  { name: "奶油", from: "#bee1fb", to: "#eacb8e" },
  { name: "樱桃", from: "#ffbfd1", to: "#dddcbd" },
  { name: "青柠", from: "#6edef9", to: "#dddcbd", direction: "up" },
  { name: "晚霞", from: "#ea8e8e", to: "#befbe5" },
  { name: "紫藤", from: "#3ccdef", to: "#d7bddd", direction: "up" },
  { name: "海棠", from: "#a1eedc", to: "#ffa9c1", direction: "up" },
];

const categories = ["粉樱", "晨曦", "雾蓝", "草木", "梦幻"];

function hexToHsl(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b); let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) { const d = max - min; s = l > .5 ? d / (2 - max - min) : d / (max + min); h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4; h /= 6; }
  return [h * 360, s * 100, l * 100];
}

export function GradientTool() {
  const [selected, setSelected] = useState(0);
  const [speed, setSpeed] = useState(50);
  const [blur, setBlur] = useState(64);
  const [hue, setHue] = useState(0);
  const [chroma, setChroma] = useState(0);
  const [lightness, setLightness] = useState(0);
  const [paused, setPaused] = useState(false);
  const [copied, setCopied] = useState(false);
  const [seed, setSeed] = useState(0);

  const active = gradients[selected % gradients.length];
  const css = `radial-gradient(circle at 30% 30%, ${active.from}, transparent 58%), radial-gradient(circle at 75% 70%, ${active.to}, transparent 62%), #f8f3f5`;
  const dots = useMemo(() => Array.from({ length: 24 }, (_, i) => gradients[(i + seed) % gradients.length]), [seed]);
  const baseHsl = hexToHsl(active.from);
  const background = `linear-gradient(${active.direction === "up" ? "0deg" : "180deg"}, ${active.from}, ${active.to})`;

  const copyCss = async () => { await navigator.clipboard?.writeText(css); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return <main className="gradient-page">
    <section className="gradient-canvas" style={{ "--blur": `${blur}px`, "--speed": `${Math.max(3, 18 - speed / 7)}s`, "--hue": `${hue}deg`, "--chroma": `${chroma}%`, "--lightness": `${lightness}%` } as React.CSSProperties}>
      <div className={`ambient ambient-a ${paused ? "is-paused" : ""}`} style={{ background }} />
      <div className={`ambient ambient-b ${paused ? "is-paused" : ""}`} style={{ background: `linear-gradient(135deg, ${active.to}, ${active.from})` }} />
      <div className="topbar"><div className="brand"><Sparkles size={18} /> <span>Pastel / Gradient Studio</span></div><span className="version">100 pastel gradients · 2:55</span></div>
      <div className="swatch-grid">{dots.map((g, i) => <button key={`${g.name}-${i}`} aria-label={`选择${g.name}渐变`} className={`swatch ${i === selected % 24 ? "selected" : ""}`} style={{ background: `linear-gradient(180deg, ${g.from}, ${g.to})` }} onClick={() => setSelected((i + seed) % gradients.length)} />)}</div>
      <div className="control-panel">
        <div className="tabs">{categories.map((cat, i) => <button key={cat} className={selected === i ? "active" : ""} onClick={() => setSelected(i)}>{cat}</button>)}</div>
        <div className="control-list">
          {[{ label: "流动速度", value: speed, min: 0, max: 100, suffix: "中", set: setSpeed }, { label: "柔和度  (BLUR)", value: blur, min: 0, max: 128, suffix: `${blur}PX`, set: setBlur }, { label: "色相  HUE", value: hue, min: -180, max: 180, suffix: `${hue}°`, set: setHue }, { label: "饱和度  CHROMA", value: chroma, min: -40, max: 40, suffix: `${chroma}%`, set: setChroma }, { label: "明度  LIGHTNESS", value: lightness, min: -40, max: 40, suffix: `${lightness}%`, set: setLightness }].map(control => <label className="range-row" key={control.label}><span className="range-meta"><span>{control.label}</span><strong>{control.suffix}</strong></span><input type="range" min={control.min} max={control.max} value={control.value} onChange={e => control.set(Number(e.target.value))} /></label>)}
        </div>
        <div className="actions"><button className="pill" onClick={() => setSeed(Math.floor(Math.random() * gradients.length))}><Dices size={16} />重新随机布局</button><button className="pill" onClick={() => setPaused(v => !v)}>{paused ? <Play size={15} /> : <Pause size={15} />}{paused ? "继续" : "暂停"}</button><button className="pill primary" onClick={copyCss}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? "已复制" : "复制当前静帧 CSS"}</button></div>
        <p className="hint">色相、饱和度、明度实时调整渐变（对应 OKLCH 的 H / C / L）。复制静帧 CSS，可直接用作静态背景。</p>
      </div>
    </section>
  </main>;
}
