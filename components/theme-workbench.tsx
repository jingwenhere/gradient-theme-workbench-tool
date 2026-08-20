"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, Copy, Dices, FileText, Folder, Gauge, LayoutPanelLeft, MessageCircle, Move, Search, Send, Sparkles, Terminal, WandSparkles } from "lucide-react";
import { gradients } from "./gradient-tool";
import "./theme-workbench.css";
import "./theme-motion.css";

const nav = [{ label: "Canvas", icon: LayoutPanelLeft }, { label: "Terminal", icon: Terminal }, { label: "Note", icon: FileText }, { label: "Browser", icon: Gauge }, { label: "Chat", icon: MessageCircle }, { label: "Group", icon: Folder }];

export function ThemeWorkbench() {
  const [selected, setSelected] = useState(0);
  const [copied, setCopied] = useState(false);
  const [saturation, setSaturation] = useState(72);
  const [lightness, setLightness] = useState(100);
  const [alpha, setAlpha] = useState(42);
  const [softness, setSoftness] = useState(64);
  const [positionX, setPositionX] = useState(28);
  const [positionY, setPositionY] = useState(22);
  const [motion, setMotion] = useState(false);
  const active = gradients[selected];
  const theme = useMemo(() => ({
    page: `radial-gradient(circle at 12% 12%, ${active.from}55, transparent 38%), radial-gradient(circle at 90% 88%, ${active.to}66, transparent 44%), #f5f6f8`,
    accent: `linear-gradient(135deg, ${active.from}, ${active.to})`,
    tint: `${active.from}55`,
  }), [active]);
  const css = `background: ${theme.page};\n--theme-accent: ${theme.accent};\n--theme-saturation: ${saturation}%;\n--theme-lightness: ${lightness}%;\n--theme-alpha: ${alpha}%;`;
  const copy = async () => { await navigator.clipboard?.writeText(css); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  const randomizePosition = () => { setPositionX(Math.round(12 + Math.random() * 76)); setPositionY(Math.round(12 + Math.random() * 76)); };

  return <main className="workbench" style={{
    background: theme.page,
    "--outer-from": active.from,
    "--outer-to": active.to,
    "--outer-saturation": `${35 + saturation}%`,
    "--outer-lightness": `${82 + lightness / 6}%`,
    "--outer-opacity": `${0.16 + alpha / 250}`,
    "--outer-softness": `${10 + softness / 2}px`,
    "--outer-x": `${positionX}%`,
    "--outer-y": `${positionY}%`,
    "--theme-motion": motion ? "running" : "paused",
  } as React.CSSProperties}>
    <div className="workbench-head"><div className="wb-brand"><Sparkles size={17} /> Theme workbench <span>Dotwise / Browser shell</span></div><button className="export-btn" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? "Copied" : "Copy theme CSS"}</button></div>
    <div className="workbench-body">
      <aside className="palette-panel">
        <div className="palette-title"><WandSparkles size={17} /><div><strong>Gradient themes</strong><small>Test on Note layout</small></div></div>
        <div className="theme-toolbar" aria-label="主题调节工具栏">
          {[{ label: "Saturation", value: saturation, set: setSaturation }, { label: "Lightness", value: lightness, set: setLightness }, { label: "Opacity", value: alpha, set: setAlpha }, { label: "Softness", value: softness, set: setSoftness }].map(control => <label className="theme-control" key={control.label}><span>{control.label}<b>{control.value}%</b></span><input aria-label={control.label} type="range" min="0" max="100" value={control.value} onInput={e => control.set(Number(e.currentTarget.value))} onChange={e => control.set(Number(e.currentTarget.value))} /></label>)}
          {[{ label: "Position X", value: positionX, set: setPositionX }, { label: "Position Y", value: positionY, set: setPositionY }].map(control => <label className="theme-control" key={control.label}><span>{control.label}<b>{control.value}%</b></span><input aria-label={control.label} type="range" min="0" max="100" value={control.value} onInput={e => control.set(Number(e.currentTarget.value))} onChange={e => control.set(Number(e.currentTarget.value))} /></label>)}
          <div className="toolbar-actions"><button className="tool-button" onClick={randomizePosition}><Dices size={14} /> Randomize position</button><button className={`tool-button motion-toggle ${motion ? "on" : ""}`} onClick={() => setMotion(value => !value)}><Move size={14} /> Motion {motion ? "on" : "off"}</button></div>
        </div>
        <div className="gradient-list">{gradients.map((g, i) => <button key={g.name} className={`gradient-option ${selected === i ? "selected" : ""}`} onClick={() => setSelected(i)}><span className="mini-swatch" style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }} /><span>{g.name}</span><code>{g.from}</code></button>)}</div>
      </aside>
      <section className="note-window" style={{
        "--accent": theme.accent,
        "--from": active.from,
        "--to": active.to,
        "--theme-saturation": `${35 + saturation}%`,
        "--theme-brightness": `${82 + lightness / 6}%`,
        "--theme-wash": `${8 + alpha * 0.42}%`,
        "--theme-wash-soft": `${6 + alpha * 0.28}%`,
        "--theme-opacity": `${0.14 + alpha / 250}`,
        "--theme-blur": `${8 + softness / 2}px`,
        "--theme-x": `${positionX}%`,
        "--theme-y": `${positionY}%`,
        "--theme-motion": motion ? "running" : "paused",
      } as React.CSSProperties}>
        <aside className="note-sidebar"><div className="window-controls"><i className="close" /><i className="minimize" /><i className="zoom" /></div><div className="search"><Search size={15} /><span>Stella’s workspace</span></div><div className="switcher"><b>File</b><span>Task</span><span>Inbox</span></div><div className="nav-items">{nav.map(({ label, icon: Icon }, i) => <div className={`nav-item ${i === 2 ? "current" : ""}`} key={label}><Icon size={16} />{label}</div>)}</div><div className="profile"><span className="avatar">S</span> Stella</div></aside>
        <div className="note-canvas"><div className="note-title"><FileText size={15} /> Note</div><div className="note-empty"><span>Start writing</span><small>A calm space for ideas, drafts, and notes.</small></div></div>
        <aside className="chat-panel"><div className="chat-title"><strong>Plan a weekend</strong><div><button aria-label="New chat"><MessageCircle size={15} /></button><button aria-label="Expand"><LayoutPanelLeft size={15} /></button></div></div><div className="chat-content"><div className="bubble user">Can you help me plan a relaxing weekend?</div><p>Absolutely. We could keep Saturday for exploring — a new café, a long walk, and dinner somewhere you’ve been meaning to try.</p><div className="chat-actions"><button aria-label="Regenerate"><WandSparkles size={14} /></button><button aria-label="Copy"><Copy size={14} /></button></div></div><div className="composer"><div className="chips"><span><FileText size={12} /> Draft.pdf</span><span><FileText size={12} /> ReadMe.txt</span></div><div className="composer-placeholder">Building a To-Do application requires a balance for quick entries</div><div className="composer-actions"><button aria-label="Attach file"><Folder size={16} /></button><span>✦ Claude <ChevronDown size={13} /></span><button className="send" aria-label="Send"><Send size={15} /></button></div></div></aside>
      </section>
    </div>
  </main>;
}
