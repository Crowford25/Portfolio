"use client";

import { useState } from "react";
import { portfolio } from "@/data/content";

export function Capabilities() {
  const [active, setActive] = useState<number | null>(null);

  return <section id="capabilities" className="capabilities-section calm-capabilities wrap" aria-labelledby="capabilities-title">
    <div className="calm-capabilities-heading">
      <span className="eyebrow">Capabilities</span>
      <h2 id="capabilities-title">What I bring.</h2>
    </div>
    <div className="calm-capabilities-content">
      <div className="calm-service-list">
        {portfolio.services.map((group, index) => <div className="calm-service" key={group.title}>
          <h3><button
            id={`capability-${index}`}
            type="button"
            aria-expanded={active === index}
            aria-controls={`capability-panel-${index}`}
            onClick={() => setActive(active === index ? null : index)}
          >{group.title}<span className="calm-disclosure-mark" aria-hidden="true">+</span></button></h3>
          <div id={`capability-panel-${index}`} className="calm-service-detail" role="region" aria-labelledby={`capability-${index}`} hidden={active !== index}>
            <p>{group.description}</p>
            <ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>)}
      </div>
      <details className="calm-tools">
        <summary>Tools &amp; technologies<span className="calm-disclosure-mark" aria-hidden="true">+</span></summary>
        <dl>{portfolio.capabilities.map(group => <div key={group.title}>
          <dt>{group.title}</dt>
          <dd>{group.items.join(" · ")}</dd>
        </div>)}</dl>
      </details>
    </div>
  </section>;
}