import "./Signup.css";
const Signup = () => {
  return (
    <div className="form-container">
      <h2>Sign Up</h2>
      <form>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="이메일을 입력해주세요."
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="비밀번호를 입력해주세요."
          />
        </div>
        <div className="form-group">
          <label htmlFor="password-check">비밀번호 확인</label>
          <input
            type="password"
            id="password-check"
            name="password-check"
            placeholder="비밀번호를 확인해주세요."
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">사용자명</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="사용자의 이름을 입력해주세요."
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone-number">휴대폰 번호</label>
          <input type="text" id="phone-number" name="phone-number" />
          <button
            type="submit"
            className="phone-auth-button"
            placeholder="000-0000-0000 형식으로 입력해주세요."
          >
            인증하기
          </button>
        </div>
        <button type="submit" className="submit-button">
          회원가입
        </button>
      </form>
    </div>
  );
};

export default Signup;
