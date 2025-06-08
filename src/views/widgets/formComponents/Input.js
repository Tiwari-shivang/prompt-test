import React from "react";

export const Input = ({
  type,
  name,
  value,
  placeholder,
  className,
  onChangeHandler,
  reference,
  autoComplete,
  max,
  min,
  step,
  accept,
  defaultValue,
  disabled,
  id,
  onClickHandler
}) => {
  return (
    <input
    type={type}
    name={name}
    id={id}
	autoComplete={autoComplete}
    className={className}
    placeholder={placeholder}
    value={value}
    max={max}
    min={min}
    step={step}
    accept = {accept}
    defaultValue={defaultValue}
    onChange={onChangeHandler}
    onClick={onClickHandler}
    ref={reference}
    disabled={disabled}
  />
  );
};
