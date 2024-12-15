package com.ict.home.condition.controller;

import com.ict.home.condition.dto.*;
import com.ict.home.condition.model.*;
import com.ict.home.condition.serivce.ConditionService;
import com.ict.home.user.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/condition")
public class ConditionController {

    @Autowired
    private ConditionService cs;

    @GetMapping("/{userId}")
    @Operation(summary = "조건 조회", description = "조건을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조건 조회 성공",
                    content = @Content(
                            schema = @Schema(
                                    anyOf = {Family.class,
                                            Condition01.class,
                                            Condition03.class,
                                            Account.class}
                            )
                    )
            ),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "리소스를 찾을 수 없음")
    })
    public ResponseEntity<?> getCondition() {

        return ResponseEntity.ok("조회 성공");
    }

    // @PostMapping("/test/{userId}")
    @PostMapping("/test")
    public ResponseEntity<String> createUserApplication(@Valid @RequestBody ConditionDTO conditionDTO, @RequestParam(required = false) Long userId) {
        // User user = new User();
        // user.setId(userId);
        log.info("Received conditionDTO: {}", conditionDTO);

        System.out.println("[condition01] " + conditionDTO.getCondition01DTO());
        System.out.println("[accountList] " + conditionDTO.getAccountDTOList());
        System.out.println("[condition03] " + conditionDTO.getCondition03DTO());
        System.out.println("[familyList] " + conditionDTO.getFamilyDTOList());

        // DTO에서 데이터를 꺼내 JPA 엔티티로 변환 후 저장
        Condition01 condition01 = new Condition01();
        Condition01DTO condition01DTO = conditionDTO.getCondition01DTO();

        // condition01.setUser(user); // user 엔티티 설정
        condition01.setBirthday(condition01DTO.getBirthday());
        condition01.setSiDo(condition01DTO.getSiDo());
        condition01.setGunGu(condition01DTO.getGunGu());
        condition01.setTransferDate(condition01DTO.getTransferDate());
        condition01.setRegionMoveInDate(condition01DTO.getRegionMoveInDate());
        condition01.setMetropolitanAreaDate(condition01DTO.getMetropolitanAreaDate());
        condition01.setIsHouseHolder(condition01DTO.getIsHouseHolder());
        condition01.setMarried(condition01DTO.getMarried());
        condition01.setMarriedDate(condition01DTO.getMarriedDate());

        List<AccountDTO> accountDTOList = conditionDTO.getAccountDTOList(); // DTO에서 AccountDTO 리스트 가져오기
        List<Account> accountList = new ArrayList<>();

        for (AccountDTO accountDTO : accountDTOList) {
            Account account = new Account();
            // account.setUser(user);
            // 필요한 경우 condition01을 Account 엔티티와 연결
            account.setType(accountDTO.getType());
            account.setCreatedAt(accountDTO.getCreatedAt());
            account.setPaymentCount(accountDTO.getPaymentCount());
            account.setTotalAmount(accountDTO.getTotalAmount());
            account.setRecognizedAmount(accountDTO.getRecognizedAmount());
            account.setRelationship(accountDTO.getRelationship());

            accountList.add(account);
        }

        Condition03 condition03 = new Condition03();
        Condition03DTO condition03DTO = conditionDTO.getCondition03DTO();
        // condition03.setUser(user);
        condition03.setCarPrice(condition03DTO.getCarPrice());
        condition03.setPropertyPrice(condition03DTO.getPropertyPrice());
        condition03.setTotalAsset(condition03DTO.getTotalAsset());
        condition03.setMyAsset(condition03DTO.getMyAsset());
        condition03.setSpouseAsset(condition03DTO.getSpouseAsset());
        condition03.setFamilyAverageMonthlyIncome(condition03DTO.getFamilyAverageMonthlyIncome());
        condition03.setPreviousYearAverageMonthlyIncome(condition03DTO.getPreviousYearAverageMonthlyIncome());
        condition03.setIncomeActivity(condition03DTO.getIncomeActivity());
        condition03.setSpouseAverageMonthlyIncome(condition03DTO.getSpouseAverageMonthlyIncome());
        condition03.setIncomeTaxPaymentPeriod(condition03DTO.getIncomeTaxPaymentPeriod());
        condition03.setLastWinned(condition03DTO.getLastWinned());
        condition03.setIneligible(condition03DTO.getIneligible());

        List<FamilyDTO> familyDTOList = conditionDTO.getFamilyDTOList();
        List<Family> familyList = new ArrayList<>();

        for (FamilyDTO familyDTO : familyDTOList) {
            Family family = new Family();
            // family.setUser(user);
            family.setRelationship(familyDTO.getRelationship());
            family.setLivingTogether(familyDTO.getLivingTogether());
            family.setLivingTogetherDate(familyDTO.getLivingTogetherDate());
            family.setBirthday(familyDTO.getBirthday());
            family.setIsMarried(familyDTO.getIsMarried());
            family.setHouseCount(familyDTO.getHouseCount());
            family.setHouseSoldDate(familyDTO.getHouseSoldDate());

            familyList.add(family);
        }

        // 저장하는 로직 (예: repository 사용)

        return ResponseEntity.ok("등록 성공");
    }

    @PostMapping("/{userId}")
    @Operation(summary = "조건 등록", description = "조건을 등록합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조건 등록 성공",
                    content = @Content(
                            schema = @Schema(
                                    anyOf = {Family.class,
                                            Condition01.class,
                                            Condition03.class,
                                            Account.class}
                            )
                    )
            ),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "리소스를 찾을 수 없음")
    })
    public ResponseEntity<?> addCondition() {

        return ResponseEntity.ok("등록 성공");
    }

    @PutMapping("/{userId}")
    @Operation(summary = "조건 수정", description = "조건을 수정합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조건 수정 성공",
                    content = @Content(
                            schema = @Schema(
                                    anyOf = {Family.class,
                                            Condition01.class,
                                            Condition03.class,
                                            Account.class}
                            )
                    )
            ),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "리소스를 찾을 수 없음")
    })
    public ResponseEntity<?> updateCondition() {

        return ResponseEntity.ok("수정 성공");
    }

    @DeleteMapping("/{userId}")
    @Operation(summary = "조건 삭제", description = "조건을 삭제합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조건 삭제 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "리소스를 찾을 수 없음")
    })
    public ResponseEntity<?> deleteCondition() {

        return ResponseEntity.ok("삭제 성공");
    }

}
