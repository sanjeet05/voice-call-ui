import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";

const schema = Yup.object().shape({
  name: Yup.string().trim().required("required").min(2, "Name is too short"),
  // from: Yup.string().trim().required("required"),
  // to: Yup.string().trim().required("required"),
  from: Yup.string()
    .matches(/^[0-9]*$/, { message: "Phone number must be a number", excludeEmptyString: false })
    .length(10, "Phone number must be 10 digits")
    .required("required"),
  to: Yup.string()
    .matches(/^[0-9]*$/, { message: "Phone number must be a number", excludeEmptyString: false })
    .length(10, "Phone number must be 10 digits")
    .required("required"),
});

const CallForm = (props) => (
  <Formik
    initialValues={{ name: "", from: "", to: "", duration: "5" }}
    validationSchema={schema}
    onSubmit={(values) => {
      props.handleSubmit(values);
    }}
  >
    {({ handleSubmit, handleBlur, handleChange, values, errors, touched }) => {
      return (
        <form onSubmit={handleSubmit} className="mt-3">
          <div className="form-group">
            <label>Name</label>
            <input
              className={errors.name && touched.name ? "form-control is-invalid" : "form-control"}
              placeholder="Type your name"
              name="name"
              type="text"
              value={values.name}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {errors.name && touched.name ? (
              <span className="invalid-feedback">{errors.name}</span>
            ) : null}
          </div>

          <div className="form-group">
            <label>Your phone number</label>
            <input
              className={errors.from && touched.from ? "form-control is-invalid" : "form-control"}
              placeholder="Type your phone number"
              name="from"
              type="text"
              value={values.from}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {errors.from && touched.from ? (
              <span className="invalid-feedback">{errors.from}</span>
            ) : null}
          </div>

          <div className="form-group pt-3">
            <label>Caller phone number</label>
            <input
              className={errors.to && touched.to ? "form-control is-invalid" : "form-control"}
              placeholder="Type caller phone number"
              name="to"
              type="text"
              value={values.to}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {errors.to && touched.to ? <span className="invalid-feedback">{errors.to}</span> : null}
          </div>

          <div className="form-group">
            <label>Duration</label>
            <select
              className="form-control"
              name="duration"
              value={values.duration}
              onChange={handleChange}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className={`btn btn-primary ${props.isLoading ? "btn_event" : ""}`}
              disabled={props.isDisable}
            >
              {props.isLoading ? (
                <span style={{ position: "relative" }}>
                  <i className="btn_spinner"></i>
                  <span style={{ opacity: "0.2" }}>{"Call"}</span>
                </span>
              ) : (
                "Call"
              )}
            </button>
          </div>
        </form>
      );
    }}
  </Formik>
);

export default CallForm;
