import React, { useEffect } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";

// @material-ui/icons

// React icons
//import { FaPlay } from 'react-icons/fa';

// core components

import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
//import Parallax from "components/Parallax/Parallax.jsx";
//import GridContainer from "components/Grid/GridContainer.jsx";
//import GridItem from "components/Grid/GridItem.jsx";

import image from "assets/img/v1.png";

const dashboardRoutes = [];

const MasterPage = ({
  classes,
  children,
  seo,
  poster,
  video,
  firebase,
  ...rest
}) => {
  const init = () => {
    if (firebase.analytics()) {
      firebase.analytics().logEvent("page_view", {
        page_path: seo.pathname,
        page_title: seo.title,
      });
    }
  };

  useEffect(() => {
    init();
  }, []);
  return (
    <div>
      <div
        className={classes.background}
        style={{
          background: `url(` + image + `) 0 0px /auto 100vh no-repeat`,
          backgroundColor: "#0037e0",
          filter: " opacity(100%)",
        }}
      ></div>
      <Header
        color="white"
        routes={dashboardRoutes}
        brand={
          <a href="/">
            <img
              id="logo"
              alt="UNALIVIO"
              style={{ maxHeight: 46 }}
              src="/logo.png"
            />
          </a>
        }
        rightLinks={
          <HeaderLinks
            links={[
              {
                id: "link-why",
                title: "¿Por qué recargar teléfonos con Unalivio?",
                href: "/#why",
                target: "_anchor",
                children: <>¿Cómo recargar?</>,
              },
              {
                id: "link-howto",
                title: "¿Cómo funciona?",
                href: "/#howto",
                target: "_anchor",
                children: <>Preguntas frecuentes</>,
              },
              {
                id: "link-topup",
                title: "¡Alívialo ya!",
                href: "/#topup",
                target: "_anchor",
                children: <>Noticias Unalivio</>,
              },
            ]}
          />
        }
        fixed
        changeColorOnScroll={false}
        {...rest}
      />
      {/* {authenticated ? this.props.children : <SignIn />} */}
      <div
        style={{ marginTop: 40 }}
        className={classNames(classes.mainTransparent)}
      >
        <div>{children}</div>
      </div>
      <script>
        var vid = document.getElementById("bg-video"); vid.playbackRate = 0.3;
      </script>
      <Footer whiteFont={true} />
    </div>
  );
};

// style is applied after import per page
export default MasterPage;
