import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

//import { KeyboardDatePicker } from "@material-ui/pickers";

import customInputStyle from "assets/jss/material-kit-react/components/customInputStyle.jsx";

function CustomInput({ ...props }) {
  const {
    classes,
    formControlProps,
    labelText,
    id,
    labelProps,
    inputSelections,
    inputProps,
    error,
    white,
    inputRootCustomClasses,
    success,
    customLabelClass,
    customSelectClass,
  } = props;

  const labelClasses = classNames({
    [" " + classes.labelRootError]: error,
    [" " + classes.labelRootSuccess]: success && !error,
  });
  const underlineClasses = classNames({
    [classes.underlineError]: error,
    [classes.underlineSuccess]: success && !error,
    [classes.underline]: true,
    [classes.whiteUnderline]: white,
  });
  const marginTop = classNames({
    [inputRootCustomClasses]: inputRootCustomClasses !== undefined,
  });
  const inputClasses = classNames({
    [classes.input]: true,
    [classes.whiteInput]: white,
  });
  var formControlClasses;
  if (formControlProps !== undefined) {
    formControlClasses = classNames(
      formControlProps.className,
      classes.formControl,
    );
  } else {
    formControlClasses = classes.formControl;
  }

  const renderInput = () => {
    return <Input {...inputProps} />;
  };

  return (
    <FormControl {...formControlProps} className={formControlClasses}>
      {labelText !== undefined ? (
        <InputLabel
          className={
            classes.labelRoot + " " + labelClasses + (customLabelClass || "")
          }
          htmlFor={id}
          {...labelProps}
        >
          {labelText}
        </InputLabel>
      ) : null}
      {inputSelections !== undefined ? (
        <Select
          className={customSelectClass}
          classes={{
            input: inputClasses,
            root: marginTop,
            disabled: classes.disabled,
            underline: underlineClasses,
          }}
          id={id}
          {...inputProps}
        >
          {inputSelections.map((option, key) => (
            <MenuItem value={option.value} key={key}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      ) : (
        renderInput()
      )}
    </FormControl>
  );
}

CustomInput.propTypes = {
  classes: PropTypes.object.isRequired,
  labelText: PropTypes.node,
  labelProps: PropTypes.object,
  id: PropTypes.string,
  inputProps: PropTypes.object,
  inputSelections: PropTypes.array,
  formControlProps: PropTypes.object,
  inputRootCustomClasses: PropTypes.string,
  error: PropTypes.bool,
  success: PropTypes.bool,
  white: PropTypes.bool,
};

export default withStyles(customInputStyle)(CustomInput);
