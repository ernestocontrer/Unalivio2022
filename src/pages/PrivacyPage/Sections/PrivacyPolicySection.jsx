import React from "react";
//import ReactDOM from 'react-dom'
//import ReactMarkdown from 'react-markdown'

// nodejs library that concatenates classes
//import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons

// React icons
// core components
import teamStyle from "assets/jss/material-kit-react/views/aboutPageSections/teamStyle.jsx";



class MisionVisionSection extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.section}>
        <h1 className={classes.title}>Política de Privacidad</h1>
        <h4 className={classes.title}>Última actualización al Jueves 10 de Diciembre del 2020.</h4>
        <p className={classes.description}>
        En cumplimiento a lo establecido por la LEY FEDERAL DE PROTECCIÓN DE DATOS PERSONALES EN POSESIÓN DE LOS PARTICULARES vigente en México para UNALIVIO S. A. P. I. DE C. V., con domicilio en Av. Central #175, Col. Tolteca, Alcaldía Álvaro Obregón, C. P. 01150, Ciudad de México, México; UNALIVIO S. A. P. I. DE C. V. es la única responsable de la protección y tratamiento de tus datos personales.<br />
        Los datos personales que se solicitan como nombre completo y correo electrónico, serán utilizados única y exclusivamente para dar un seguimiento personalizado a las solicitudes de información del sitio https://blitmx.com. Asimismo, te informamos que tus datos personales podrán ser transferidos y/o tratados por personas distintas a UNALIVIO S. A. P. I. DE C. V. con fines para mejorar la calidad de nuestro servicio y seguridad de nuestros usuarios.<br />
        Tus datos personales han sido otorgados voluntariamente y la actualización y autenticidad de los mismos son tu responsabilidad. Si deseas ejercer cualquiera de los derechos de acceso, rectificación, cancelación u oposición, así como revocar el consentimiento para el tratamiento de los mismos, puedes solicitarlo a través del correo electrónico <a href="mailto:contacto@unalivio.com">contacto@unalivio.com</a><br />
        Te informamos que en nuestra página web utilizamos cookies y otras tecnologías, a través de las cuales es posible brindarte un mejor servicio y experiencia al navegar en nuestra página, la información que se obtiene es totalmente anónima y no permite identificarte. Si no quieres que haya cookies actuando en tu interacción con las páginas del portal, puedes deshabilitarlas desde el navegador, considerando que podrán producirse limitaciones en cuanto a la funcionalidad del sitio web.<br />
        Cualquier modificación a este aviso de privacidad podrás consultarlo en la presente sección.<br />
        </p>
      </div>
    );
  }
}

export default withStyles(teamStyle)(MisionVisionSection);
