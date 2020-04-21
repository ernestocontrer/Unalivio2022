import React from 'react';
// material-ui components
import withStyles from "@material-ui/core/styles/withStyles";
import Fade from "@material-ui/core/Fade";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
// @material-ui/icons
import Close from "@material-ui/icons/Close";
// core components
import customModalStyle from "assets/jss/material-dashboard-pro-react/modalStyle.js";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />;
});

function CustomModal({...props}) {
  const {
    id,
    title,
    titleProps,
    content,
    contentProps,
    actions,
    actionsProps,
    open,
    onClose,
  } = props;

  const classes = useStyles();

  return (
    <Dialog
      classes={{
        root: classes.center,
        paper: classes.modal
      }}
      id={id}
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      aria-labelledby="modal-slide-title"
      aria-describedby="modal-slide-description"
    >
      <DialogTitle
        id="classic-modal-slide-title"
        disableTypography
        className={classes.modalHeader}
        {...titleProps}
      >
        <IconButton
          className={classes.modalCloseButton}
          key="close"
          aria-label="Close"
          color="inherit"
          onClick={onClose}
        >
          <Close className={classes.modalClose} />
        </IconButton>
        <h4 className={classes.modalTitle}>{title}</h4>
      </DialogTitle>
      <DialogContent
        className={classes.modalBody}
        {...contentProps}
      >
        {content}
      </DialogContent>
      <DialogActions
        className={classes.modalFooter + " " + classes.modalFooterCenter}
        {...actionsProps}
      >
        {actions}
      </DialogActions>
    </Dialog>
  );
}

CustomInput.propTypes = {
  id: PropTypes.string,
  title: PropTypes.node,
  titleProps: PropTypes.object,
  content: PropTypes.node,
  contentProps: PropTypes.object,
  actions: PropTypes.node,
  actionsProps: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.function,
};

export default withStyles(customModalStyle)(CustomModal);
