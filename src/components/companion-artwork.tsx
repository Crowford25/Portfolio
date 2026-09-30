export function CompanionArtwork({ id }: { id: string }) {
  return <svg className="companion-illustration" viewBox="72 20 336 386" fill="none" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={`${id}-shell`} x1="144" y1="92" x2="327" y2="253" gradientUnits="userSpaceOnUse"><stop stopColor="#fffdf3"/><stop offset=".58" stopColor="#f3eddf"/><stop offset="1" stopColor="#d3cebd"/></linearGradient>
          <linearGradient id={`${id}-body`} x1="184" y1="247" x2="293" y2="369" gradientUnits="userSpaceOnUse"><stop stopColor="#fcf9ed"/><stop offset="1" stopColor="#dcd6c6"/></linearGradient>
          <linearGradient id={`${id}-face`} x1="160" y1="114" x2="318" y2="228" gradientUnits="userSpaceOnUse"><stop stopColor="#3a4038"/><stop offset="1" stopColor="#202720"/></linearGradient>
          <linearGradient id={`${id}-orange`} x1="175" y1="291" x2="302" y2="350" gradientUnits="userSpaceOnUse"><stop stopColor="#f17645"/><stop offset="1" stopColor="#ce4829"/></linearGradient>
        </defs>
        <g className="companion-robot">
          <path d="M214 232v25h52v-25" fill="#7e896d"/>
          <path d="M222 236v14h36v-14" fill="#b9c1a7"/>
          <path d="M151 277c-23-2-36 11-40 38l-3 21c-1 10 6 19 16 20 10 1 18-5 20-15l5-28 15-10" fill={`url(#${id}-shell)`} stroke="#c4c4b0"/>
          <path d="M329 277c23-2 36 11 40 38l3 21c1 10-6 19-16 20-10 1-18-5-20-15l-5-28-15-10" fill={`url(#${id}-shell)`} stroke="#c4c4b0"/>
          <path d="m110 330-2 8c-1 10 6 17 15 18 10 1 18-5 20-14l1-8" fill="#778363"/>
          <path d="m336 334 1 8c2 9 10 15 20 14 9-1 16-8 15-18l-2-8" fill="#778363"/>
          <path d="M174 351h50v21h-50zM257 351h50v21h-50z" fill="#68755a"/>
          <path d="M173 363h49v17c0 6-5 10-11 10h-47c-5 0-8-4-7-8l3-8c2-7 6-11 13-11Z" fill={`url(#${id}-shell)`} stroke="#c5c5b3"/>
          <path d="M260 363h47c7 0 11 4 13 11l3 8c1 4-2 8-7 8h-47c-6 0-9-4-9-10v-17Z" fill={`url(#${id}-shell)`} stroke="#c5c5b3"/>
          <path d="M157 385h64M261 385h62" stroke="#bcbfaa" strokeWidth="3"/>

          <rect x="148" y="246" width="184" height="119" rx="42" fill={`url(#${id}-body)`} stroke="#c8c8b5"/>
          <path d="M177 259c17-7 110-7 127 0" stroke="#fffef7" strokeWidth="3" strokeLinecap="round"/>
          <rect x="176" y="279" width="128" height="62" rx="22" fill={`url(#${id}-orange)`}/>
          <path d="M187 292c10-6 23-7 38-7" stroke="#ffa47b" strokeWidth="2" strokeLinecap="round" opacity=".75"/>
          
          <path d="M243 300h34M243 310h34M243 320h23" stroke="#773d29" strokeWidth="3" strokeLinecap="round" opacity=".55"/>
          <circle cx="310" cy="311" r="3" fill="#b7b89f"/>
          <circle cx="170" cy="311" r="3" fill="#b7b89f"/>

          <path d="M240 80V54" stroke="#69795a" strokeWidth="7" strokeLinecap="round"/>
          <circle cx="240" cy="45" r="11" fill="#df6137" stroke="#bd492b"/>
          <circle cx="237" cy="42" r="3" fill="#ffbb8e"/>
          <rect x="94" y="136" width="28" height="62" rx="14" fill="#d8663d"/>
          <rect x="358" y="136" width="28" height="62" rx="14" fill="#d8663d"/>
          <path d="M103 149v35M377 149v35" stroke="#f69a6b" strokeWidth="3" strokeLinecap="round"/>
          <rect x="108" y="76" width="264" height="169" rx="61" fill={`url(#${id}-shell)`} stroke="#bfc3af" strokeWidth="1.5"/>
          <path d="M137 112c13-21 38-26 68-26h78c27 0 49 4 62 18" stroke="#fffef8" strokeWidth="4" strokeLinecap="round"/>
          <rect x="129" y="101" width="222" height="121" rx="43" fill="#8e9781"/>
          <rect x="132" y="105" width="216" height="116" rx="41" fill={`url(#${id}-face)`}/>
          <path d="M147 134c5-13 20-20 36-20h47" stroke="#596151" strokeWidth="2" strokeLinecap="round" opacity=".75"/>
          <circle cx="151" cy="199" r="3" fill="#dd7750" opacity=".85"/>
          <circle cx="329" cy="199" r="3" fill="#dd7750" opacity=".85"/>

          <g className="companion-expression companion-eyes-curious">
            <rect x="171" y="139" width="45" height="50" rx="22.5" fill="#dce8b8"/>
            <rect x="263" y="132" width="47" height="57" rx="23.5" fill="#e5eec8"/>
            <g className="companion-pupils"><ellipse cx="194" cy="161" rx="9" ry="13" fill="#354431"/><ellipse cx="286" cy="157" rx="9" ry="14" fill="#354431"/><circle cx="198" cy="156" r="3" fill="#f8fae7"/><circle cx="290" cy="152" r="3" fill="#f8fae7"/></g>
            <path d="M231 194q9 5 18-1" stroke="#c5d49f" strokeWidth="3" strokeLinecap="round"/>
          </g>
          <g className="companion-expression companion-eyes-happy">
            <g className="companion-pupils"><path d="M175 168q19-32 38 0M268 168q19-32 38 0" stroke="#e0edb9" strokeWidth="9" strokeLinecap="round"/></g>
            <path d="M225 188q15 18 30 0" fill="#dce8b8"/>
            <path d="M160 185h12M309 185h12" stroke="#e99670" strokeWidth="4" strokeLinecap="round" opacity=".8"/>
          </g>
          <g className="companion-expression companion-eyes-focused">
            <rect x="171" y="150" width="46" height="24" rx="12" fill="#dce8b8"/>
            <rect x="263" y="150" width="46" height="24" rx="12" fill="#dce8b8"/>
            <g className="companion-pupils"><rect x="189" y="154" width="10" height="16" rx="5" fill="#354431"/><rect x="281" y="154" width="10" height="16" rx="5" fill="#354431"/></g>
            <path d="M233 193h14" stroke="#c5d49f" strokeWidth="3" strokeLinecap="round"/>
          </g>
        </g>
      </svg>;
}
