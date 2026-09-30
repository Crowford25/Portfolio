import { portfolio, type Career } from "@/data/content";

function CareerDetails({ item }: { item: Career }) {
  if (!item.organisationShort && !item.tools?.length) return null;

  return <details className="calm-career-detail">
    <summary>{item.stage === "Diploma" || item.stage === "Degree" ? "Institution details" : "Role details"}</summary>
    <div>
      {item.organisationShort && <p className="calm-career-institution">{item.organisation}</p>}
      {!!item.tools?.length && <p className="calm-career-tools"><span>Tools</span>{item.tools.join(" / ")}</p>}
    </div>
  </details>;
}

export function CareerJourney() {
  if (!portfolio.career.length) return null;

  return <section className="career-journey calm-career wrap" id="career" aria-labelledby="career-title">
    <header className="calm-career-intro">
      <div>
        <span className="eyebrow">CAREER</span>
        <h2 id="career-title">The road so far.</h2>
      </div>
      <p className="calm-career-hint" id="career-scroll-hint">Scroll sideways to follow the journey.</p>
    </header>
    <div className="calm-career-scroll" role="region" aria-label="Career timeline" aria-describedby="career-scroll-hint" tabIndex={0}>
      <ol className="calm-career-list" role="list">
        {portfolio.career.map((item, index) => <li key={`${item.stage}-${item.period}`} className={`${index % 2 === 0 ? "is-above" : "is-below"}${item.current ? " is-current" : ""}`}>
          <div className="calm-career-axis">
            <span className="calm-career-point" aria-hidden="true"/>
            <span className="calm-career-date">{item.period || "Dates to add"}</span>
          </div>
          <article className="calm-career-entry" aria-labelledby={`career-entry-${index}`}>
            <p className="calm-career-stage">{item.current ? <span className="calm-career-current">Current role</span> : item.stage}</p>
            <h3 id={`career-entry-${index}`}>{item.title}</h3>
            {item.field && <p className="calm-career-field">{item.field}</p>}
            <p className="calm-career-company">{item.organisationShort || item.organisation || "Organisation to add"}</p>
            <p className="calm-career-description">{item.description}</p>
            <CareerDetails item={item}/>
          </article>
        </li>)}
      </ol>
    </div>
  </section>;
}