export function FypProjectPreview() {
  return <figure className="fyp-project-preview" aria-label="Final Year Project Client module presentation with sample data">
    <div className="fyp-preview-masthead">
      <div className="fyp-preview-brand"><strong>TRINITY</strong><span>MEDICAL CENTER</span></div>
      <span className="fyp-preview-portal">PATIENT PORTAL</span>
    </div>
    <div className="fyp-preview-body">
      <div className="fyp-preview-booking">
        <span className="fyp-preview-eyebrow">PLAN YOUR VISIT</span>
        <p className="fyp-preview-title">An appointment.<br/>A clear next step.</p>
        <ol className="fyp-preview-steps" aria-label="Appointment workflow"><li><span>01</span>Branch</li><li><span>02</span>Doctor</li><li className="fyp-preview-current"><span>03</span>Time</li></ol>
        <div className="fyp-preview-selection"><div><span>BRANCH</span><strong>Sample branch</strong></div><div><span>CONSULTATION</span><strong>Walk-in</strong></div></div>
        <div className="fyp-preview-doctor"><span className="fyp-preview-avatar" aria-hidden="true">DR</span><div><strong>Sample doctor</strong><span>Doctor &amp; department selection</span></div><span className="fyp-preview-slot-note">Selected</span></div>
        <div className="fyp-preview-times"><span>Appointment time</span><div><span>09:00</span><span className="fyp-preview-selected-time">09:30</span><span>10:00</span></div></div>
        <p className="fyp-preview-booking-note">Branch → Doctor → Available appointment</p>
      </div>
      <div className="fyp-preview-account">
        <span className="fyp-preview-eyebrow">BEYOND THE BOOKING</span>
        <p className="fyp-preview-account-title">Your patient workspace.</p>
        <div className="fyp-preview-account-links">
          <div><span className="fyp-preview-link-number">01</span><div><strong>Appointments</strong><span>Review or change a visit</span></div></div>
          <div><span className="fyp-preview-link-number">02</span><div><strong>Profile</strong><span>Keep contact details current</span></div></div>
          <div><span className="fyp-preview-link-number">03</span><div><strong>Messages</strong><span>Continue a doctor conversation</span></div></div>
          <div><span className="fyp-preview-link-number">04</span><div><strong>History</strong><span>Appointments &amp; payments</span></div></div>
        </div>
        <div className="fyp-preview-credit"><span>MY CONTRIBUTION</span><strong>Client module</strong><small>Part of a team-built hospital system.</small></div>
      </div>
    </div>
    <figcaption><span>Interface preview · sample data</span><span>ASP.NET Web Forms / C#</span></figcaption>
  </figure>;
}