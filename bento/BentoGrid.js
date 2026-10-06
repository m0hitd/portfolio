// BentoGrid — React component, no build step (React 18 UMD + htm via CDN).
// Mounts into #badges-bento. Works as-is on GitHub Pages.
//
// Layout is drawn on a 945 x 545 unit stage (1 unit = --u, scales with width).
// Hover: the card slides by `shift` units while a solid accent block grows
// out of the edge it leaves, filling the gap. Background diamonds tint softly.
(function () {
  const { useState, useCallback } = React;
  const html = htm.bind(React.createElement);

  const PROFILE = "https://www.skills.google/public_profiles/44c2e2ed-0316-4198-8e81-f9ab3ee3a4fe";

  // rect: [x, y, w, h] in stage units. shift: + slides right (block on left), - slides left (block on right).
  const CARDS = [
    {
      id: "genai", title: "Introduction to Generative AI", subtitle: "Google Cloud Skills Boost · Earned Oct 2025",
      fa: "fa-wand-magic-sparkles", href: PROFILE,
      accent: "#EA4335", rect: [254, 0, 361, 179], shift: -36,
    },
    {
      id: "core", title: "Core Infrastructure", subtitle: "Google Cloud Fundamentals · Earned May 2024",
      fa: "fa-server", href: PROFILE,
      accent: "#1A73E8", rect: [254, 179, 180, 180], shift: -34,
    },
    {
      id: "ace", title: "ACE Exam Prep", subtitle: "Associate Cloud Engineer study guide · Earned May 2024",
      fa: "fa-graduation-cap", href: PROFILE,
      accent: "#5AB0F0", rect: [434, 179, 181, 180], shift: 34,
    },
    {
      id: "digital", title: "Digital Transformation with Google Cloud", subtitle: "Google Cloud Skills Boost · Earned Aug 2026",
      fa: "fa-cloud", href: PROFILE + "/badges/26364444",
      accent: "#F57C00", rect: [254, 359, 361, 181], shift: 72,
    },
    {
      id: "llm", title: "Introduction to Large Language Models", subtitle: "Earned Jun 2026",
      fa: "fa-brain", href: PROFILE,
      accent: "#1C1D20", rect: [0, 359, 180, 181], shift: 72, peripheral: true,
    },
    {
      id: "arcade", title: "The Arcade Base Camp", subtitle: "Earned Jan 2025",
      icon: "images/Base camp logo.png", href: PROFILE + "/badges/13733603",
      accent: "#1C1D20", rect: [689, 179, 180, 180], shift: -72, peripheral: true,
    },
  ];

  // Static filler tiles: [x, y, w, h, tone]
  const TILES = [
    [72, 179, 182, 180, "light"],
    [180, 469, 74, 71, "light"],
    [615, 469, 74, 71, "dark"],
    [689, 359, 180, 181, "light"],
  ];

  // Diamond badges: [centerX, centerY, side]
  const DIAMONDS = [
    [217, 142, 53],
    [907, 502, 53],
  ];

  const rectStyle = ([x, y, w, h]) => ({ "--x": x, "--y": y, "--w": w, "--h": h });

  function BentoCard({ card, active, onActivate, onDeactivate }) {
    const side = card.shift > 0 ? "left" : "right";
    return html`
      <div
        className=${"bx-slot" + (active ? " is-active" : "") + (card.peripheral ? " is-peripheral" : "")}
        style=${{ ...rectStyle(card.rect), "--accent": card.accent, "--shift": card.shift, "--bar": Math.abs(card.shift) }}
        onMouseEnter=${() => onActivate(card.id)}
        onMouseLeave=${onDeactivate}
      >
        <span className=${"bx-bar bx-bar--" + side} aria-hidden="true"></span>
        <a
          className="bx-panel"
          href=${card.href}
          target="_blank"
          rel="noopener"
          onFocus=${() => onActivate(card.id)}
          onBlur=${onDeactivate}
        >
          <span className=${"bx-glyph" + (card.icon ? " bx-glyph--lg" : "")}>
            ${card.icon
              ? html`<img src=${card.icon} alt="" loading="lazy" />`
              : html`<i className=${"fa-solid " + card.fa}></i>`}
          </span>
          <span className="bx-copy">
            <span className="bx-title">${card.title}</span>
            <span className="bx-subtitle">${card.subtitle}</span>
          </span>
        </a>
      </div>
    `;
  }

  function BentoGrid() {
    const [activeId, setActiveId] = useState(null);
    const activate = useCallback((id) => setActiveId(id), []);
    const deactivate = useCallback(() => setActiveId(null), []);
    const active = CARDS.find((c) => c.id === activeId);
    const tint = active && !active.peripheral ? active.accent : null;

    return html`
      <div className="bx">
        <div className="bx-stage" style=${tint ? { "--diamond": tint } : null}>
          ${DIAMONDS.map(([cx, cy, s], i) => html`
            <div key=${"d" + i} className=${"bx-diamond" + (tint ? " is-lit" : "")}
              style=${{ "--cx": cx, "--cy": cy, "--s": s }} aria-hidden="true"></div>
          `)}
          ${TILES.map(([x, y, w, h, tone], i) => html`
            <div key=${"t" + i} className=${"bx-tile bx-tile--" + tone} style=${rectStyle([x, y, w, h])} aria-hidden="true"></div>
          `)}
          ${CARDS.map((card) => html`
            <${BentoCard}
              key=${card.id}
              card=${card}
              active=${activeId === card.id}
              onActivate=${activate}
              onDeactivate=${deactivate}
            />
          `)}
        </div>
      </div>
    `;
  }

  window.BentoGrid = BentoGrid;

  const root = document.getElementById("badges-bento");
  if (root) ReactDOM.createRoot(root).render(html`<${BentoGrid} />`);
})();
