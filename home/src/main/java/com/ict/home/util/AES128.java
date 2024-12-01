package com.ict.home.util;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.util.Base64;

import static java.nio.charset.StandardCharsets.UTF_8;

/**
 * 비밀번호 암호화 및 복호화
 */
public class AES128 {

    private final Key keySpec;  //AES 암호화에 사용될 비밀 키
    private final SecureRandom secureRandom;  //난수 생성 클래스

    /**
     * 생성자
     */
    public AES128(String key) {
        byte[] keyBytes = new byte[16];
        byte[] b = key.getBytes(UTF_8);  //매개변수로 넘어온 키(패스워드)를 문자셋 바이트 배열로 변환
        System.arraycopy(b, 0, keyBytes, 0, keyBytes.length);  //keyBytes 배열에 복사, AES-128 키 크기(16바이트)에 맞춤
        this.keySpec = new SecretKeySpec(keyBytes, "AES");  //AES 키 생성
        this.secureRandom = new SecureRandom();
    }

    /**
     * 암호화
     */
    public String encrypt(String value) throws NoSuchPaddingException, NoSuchAlgorithmException, BadPaddingException, IllegalBlockSizeException, InvalidAlgorithmParameterException, InvalidKeyException {
        //AES: 대칭 키 암호화 알고리즘. 128비트 키 길이 사용하여 암호화
        //CBC: 블록 암호화 모드 중 하나 - 랜덤한 초기화 벡터 필수
        //PKCS5Padding: 암호화된 데이터가 16바이트의 배수가 되도록 데이터를 패딩
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");

        //초기화 벡터(AES 알고리즘 CBC 모드 사용 시 필수), 암호화 할때마다 랜덤한 값으로 변경
        //난수를 16바이트 길이(AES-128 크기)의 랜덤 키로 활용
        byte[] iv = new byte[16];
        secureRandom.nextBytes(iv);

        //IvParameterSpec: CBC 모드에서 IV를 안전하게 전달하기 위한 객체
        IvParameterSpec ivParameterSpec = new IvParameterSpec(iv);

        //암호화 모드로 초기화
        cipher.init(Cipher.ENCRYPT_MODE, keySpec, ivParameterSpec);  //암호화 모드로 초기화

        //doFinal: value 문자열을 UTF-8 바이트 배열로 변환 후 암호화
        byte[] encrypted = cipher.doFinal(value.getBytes(StandardCharsets.UTF_8));

        //encrypted 를 Base64 형식으로 인코딩 후 문자열로 반환
        String encryptedValue = Base64.getEncoder().encodeToString(encrypted);
        //생성한 IV 또한 Base64 형식으로 인코딩 후 문자열로 반환 
        String ivBase64 = Base64.getEncoder().encodeToString(iv);

        //암호화된 값과 IV 함께 반환하여 DB에 저장함으로서 차후 복호화 시 같은 IV 사용할 수 있음
        return  encryptedValue + ":" + ivBase64;
    }

    /**
     * 복호화
     */
    public String decrypt(String encryptedValueWithIv) throws NoSuchPaddingException, NoSuchAlgorithmException, BadPaddingException, IllegalBlockSizeException, InvalidAlgorithmParameterException, InvalidKeyException {
        String[] splits = encryptedValueWithIv.split(":");
        String encryptedValue = splits[0];  //암호화된 값
        String ivBase64 = splits[1];  //IV

        //디코딩
        byte[] encryptedBytes = Base64.getDecoder().decode(encryptedValue);
        byte[] iv = Base64.getDecoder().decode(ivBase64);

        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");

        IvParameterSpec ivParameterSpec = new IvParameterSpec(iv);
        cipher.init(Cipher.DECRYPT_MODE, keySpec, ivParameterSpec);  //복호화 모드로 초기화

        byte[] decrypted = cipher.doFinal(encryptedBytes);  //복호화

        return new String(decrypted, UTF_8);
    }



}
