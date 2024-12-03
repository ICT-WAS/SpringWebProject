import React from "react";
import "../signup/Signup.css";

const Email = React.forwardRef((props, ref) => {
  const { email, setEmail } = props;

  const handleChange = (e) => {
    //초기화 함수
    setEmail(e.target.value);
  };

  return (
    <div className="form-group">
      <label htmlFor="login-email">Email</label>
      <input
        ref={ref}
        type="email"
        id="login-email"
        name="login-email"
        value={email}
        onChange={handleChange}
        placeholder="이메일을 입력해주세요."
      />
    </div>
  );
});

export default Email;
