export const styles = {
  textField: {
    marginBottom: "28px",
    "& .MuiFormHelperText-root": {
      position: "absolute",
      bottom: "-24px",
      left: "0",
      margin: 0,
    },
  },
  error: {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "red",
      },
      "&:hover fieldset": {
        borderColor: "red",
      },
    },
    "& .MuiFormLabel-root": {
      color: "red",
    },
    "& .MuiFormHelperText-root": {
      color: "red",
    },
  },
};
