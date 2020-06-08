import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";

// @material-ui/icons

// React icons
//import { FaPlay } from 'react-icons/fa';

// core components
//import {isMobile} from 'react-device-detect';
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
//import Parallax from "components/Parallax/Parallax.jsx";
//import GridContainer from "components/Grid/GridContainer.jsx";
//import GridItem from "components/Grid/GridItem.jsx";
import SEO from "components/SEO/SEO.jsx";

const dashboardRoutes = [];

const MasterPage = ({classes, children, seo, ...rest}) => (<div>
  <SEO {...seo} />
  {<div >{(false?
    <div className={classes.background}></div> : <video 
      id="bg-video"
      className={classes.background} 
      poster="/bg.jpg" playsInline autoPlay muted loop>
      <source src="/bg.mp4" type="video/mp4" />
    </video>
  )}</div>}
  <Header
    color="primary"
    routes={dashboardRoutes}
    brand={<img id="logo" alt="Aliviame!" style={{maxHeight: 92}} src="/logo.png" />}
    rightLinks={<HeaderLinks />}
    fixed
    changeColorOnScroll={false}
    {...rest}
  />
    {/* {authenticated ? this.props.children : <SignIn />} */}
    <div style={{marginTop: 40}} className={classNames(classes.mainTransparent)}>
      <div className={classes.container}>
        {children}
      </div>
    </div>
  <script>
    var vid = document.getElementById("bg-video");
    vid.playbackRate = 0.3; 
  </script>
  <Footer />
</div>)


// style is applied after import per page
export default MasterPage;
