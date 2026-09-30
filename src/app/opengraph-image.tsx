import { ImageResponse } from "next/og";
import { profile } from "@/data/content";
export const alt = "Wong Chee Chun — Software Engineer & Creative Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage(){return new ImageResponse(<div style={{background:"#f7f6f2",width:"100%",height:"100%",padding:"70px",display:"flex",flexDirection:"column",color:"#262824"}}><div style={{display:"flex",justifyContent:"space-between",fontSize:24}}><span>{profile.name}</span><span style={{color:"#df4927",display:"flex",alignItems:"center",gap:5}}>cc</span></div><div style={{display:"flex",flexDirection:"column",fontSize:92,lineHeight:1.04,letterSpacing:-5,marginTop:70}}><span>From surface</span><span>to <span style={{color:"#df4927"}}>system.</span></span></div><div style={{display:"flex",fontSize:23,borderTop:"1px solid #d9dbd2",paddingTop:25,marginTop:55}}>{profile.role}</div></div>,size);}
