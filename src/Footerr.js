
import React from "react";
import StickyFooter from "react-sticky-footer";
import "./Footerr.css"

const Footerr = () => {
  return (
    <div>
      <StickyFooter
        bottomThreshold={50}
        stickAtThreshold ={0}

        normalStyles={{
          backgroundColor: "#ffc1e3",
          padding: "2rem",
          margin:"2rem"
        }}
        stickyStyles={{
          display:"none",
          backgroundColor: "rgba(255,255,255,.0)",
          padding: "2rem",
          margin:"2rem"

        }}
      >
        <div className="footer__details">
        <h3 className="footer__head">For support please <span style={{color:"green"}}>Donate</span> by GooglePay, Paytm, PhonePay on 9765240201 </h3>
        <p className="footer__autherites">|| Developed and Maintained by Amol Shirole || All Rights Reserved.</p>
        </div>
      </StickyFooter>
    </div>
  );
};

export default Footerr;
