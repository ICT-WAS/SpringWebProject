import "../signup/Signup.css";

const Password = ({ password, setPassword }) => {
  const handleChange = (e) => {
    //초기화 함수
    setPassword(e.target.value);
  };

  return (
    <div className="form-group">
      <label htmlFor="login-password">비밀번호</label>
      <input
        type="password"
        id="login-password"
        name="login-password"
        value={password}
        onChange={handleChange}
        placeholder="비밀번호를 입력해주세요."
      />
    </div>
  );
};

export default Password;
