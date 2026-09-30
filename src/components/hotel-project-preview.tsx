const propertyImage = "/projects/aureum-stays/the-opaline-residence-1.png";

function AureumHeader({ staff = false }: { staff?: boolean }) {
  return (
    <div className="aureum-preview-header">
      <span className="aureum-preview-brand">AUREUM<span>STAYS</span></span>
      <span className="aureum-preview-header-context">{staff ? "STAFF WORKSPACE" : "CONSIDERED STAYS · MALAYSIA"}</span>
    </div>
  );
}

function DiscoverPreview() {
  return (
    <div className="aureum-discover">
      <div className="aureum-discover-image">
        <img src={propertyImage} alt="The Opaline Residence: double-height living room overlooking the Kuala Lumpur skyline" loading="lazy" />
        <div className="aureum-discover-copy">
          <span className="aureum-overline">THE AUREUM COLLECTION</span>
          <h4>Find the space<br />that feels like yours.</h4>
          <p>Private residences. A sense of place.</p>
        </div>
      </div>
      <dl className="aureum-search-summary" aria-label="Illustrative search criteria">
        <div><dt>Destination</dt><dd>Kuala Lumpur</dd></div>
        <div><dt>Stay type</dt><dd>Hotel</dd></div>
        <div><dt>Guests</dt><dd>2 adults</dd></div>
      </dl>
      <div className="aureum-featured-stay">
        <div><span className="aureum-overline">HOTEL · KUALA LUMPUR</span><h5>The Opaline Residence</h5><p>Skyline calm in the heart of the city.</p></div>
        <span className="aureum-featured-note">City views<br />Room-based stays</span>
      </div>
    </div>
  );
}

function ReservePreview() {
  return (
    <div className="aureum-reserve">
      <div className="aureum-stay-summary">
        <img src={propertyImage} alt="Living space at The Opaline Residence" loading="lazy" />
        <span className="aureum-overline">HOTEL · KUALA LUMPUR</span>
        <h4>The Opaline<br />Residence</h4>
        <p>Choose a room, dates and guests. Availability shapes the stay.</p>
        <div className="aureum-stay-amenities"><span>City view</span><span>Wi-Fi</span><span>Full kitchen</span></div>
      </div>
      <div className="aureum-reservation-panel">
        <span className="aureum-overline">GUEST BOOKING</span>
        <h4>Plan your stay</h4>
        <p className="aureum-panel-intro">An example reservation</p>
        <dl className="aureum-booking-fields">
          <div><dt>Check in</dt><dd>12 October</dd></div>
          <div><dt>Check out</dt><dd>14 October</dd></div>
          <div><dt>Stay</dt><dd>Hotel room</dd></div>
          <div><dt>Guests</dt><dd>2 adults</dd></div>
        </dl>
        <ol className="aureum-booking-steps" aria-label="Booking lifecycle">
          <li><span>01</span>Check room availability</li>
          <li className="aureum-step-current"><span>02</span>Create a booking hold</li>
          <li><span>03</span>Complete payment</li>
        </ol>
        <div className="aureum-hold-note"><span>Pending payment</span><p>A successful verified payment confirms the reservation.</p></div>
      </div>
    </div>
  );
}

const sampleReservations = [
  { reference: "DEMO-001", date: "12–14 Oct", status: "Confirmed", payment: "Succeeded", tone: "confirmed" },
  { reference: "DEMO-002", date: "14–16 Oct", status: "Pending", payment: "Required", tone: "pending" },
] as const;

function ManagePreview() {
  return (
    <div className="aureum-manage">
      <aside className="aureum-staff-sections" aria-label="Staff workspace sections">
        <span>Overview</span><span className="aureum-staff-selected">Reservations</span><span>Operations</span><span>Properties</span><span>Reports</span>
      </aside>
      <div className="aureum-staff-content">
        <div className="aureum-staff-heading"><div><span className="aureum-overline">BOOKING MANAGEMENT</span><h4>Reservations</h4></div><span className="aureum-access-label">Role-based access</span></div>
        <p className="aureum-staff-description">Stay details, payment state and lifecycle status in one register.</p>
        <div className="aureum-reservation-list">
          <div className="aureum-reservation-columns" aria-hidden="true"><span>RESERVATION / STAY</span><span>STATUS / PAYMENT</span></div>
          {sampleReservations.map((reservation) => (
            <div className="aureum-reservation-row" key={reservation.reference}>
              <div><span className="aureum-booking-reference">{reservation.reference}</span><strong>The Opaline Residence</strong><span className="aureum-reservation-dates">{reservation.date} · 1 room · 2 adults</span></div>
              <div className="aureum-reservation-state"><span className={`aureum-status aureum-status-${reservation.tone}`}>{reservation.status}</span><span>Payment: {reservation.payment.toLowerCase()}</span></div>
            </div>
          ))}
        </div>
        <div className="aureum-operations-note"><span className="aureum-overline">DAILY OPERATIONS</span><p>Arrivals, departures and active holds.<br /><span>A two-week view for the front desk.</span></p></div>
      </div>
    </div>
  );
}

export function HotelProjectPreview({ stage = 0 }: { stage?: number }) {
  const activeStage = ((stage % 3) + 3) % 3;
  return (
    <div className={`aureum-preview aureum-preview-stage-${activeStage}`}>
      <AureumHeader staff={activeStage === 2} />
      {activeStage === 0 ? <DiscoverPreview /> : activeStage === 1 ? <ReservePreview /> : <ManagePreview />}
      <div className="aureum-preview-caption"><span>Interface preview · sample data</span><span>{["Discover a stay", "Plan a reservation", "Manage the stay"][activeStage]}</span></div>
    </div>
  );
}
