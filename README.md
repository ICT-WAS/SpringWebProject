# SpringWebProject

### Spring 프로젝트명 : home
### React 프로젝트명 : react-home

## Spring 프로젝트 폴더 구조

```
/프로젝트명
src/
 └── main/
     └── java/
         └── com/
             └── company/
                 └── myapp/
                     ├── 도메인1(user)/
                     │   ├── controller/
                     │   │   └── UserController.java
                     │   ├── service/
                     │   │   └── UserService.java
                     │   ├── repository/
                     │   │   └── UserRepository.java
                     │   ├── model/
                     │   │   └── User.java
                     │   ├── dto/
                     │   │   └── UserDto.java
                     │   └── exception/
                     │       └── UserNotFoundException.java
                     ├── 도메인2(order)/
                     │   ├── controller/
                     │   ├── service/
                     │   ├── repository/
                     │   ├── model/
                     │   └── exception/
                     ├── common/
                     │   ├── exception/
                     │   └── utils/
                     ├── config/
                     │   └── WebSecurityConfig.java
                     └── MyAppApplication.java
 └── test/
```
