package com.ict.home.condition.controller;

import com.ict.home.condition.dto.*;
import com.ict.home.condition.model.*;
import com.ict.home.condition.serivce.ConditionService;
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

import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
    public ResponseEntity<?> getCondition(@PathVariable Long userId) {

        GetConditionDTO conditionDTO = cs.getConditions(userId);

        return ResponseEntity.ok(new HashMap<String, Object>() {{
            put("hasCondition", !conditionDTO.isEmpty());
            put("form1Data", conditionDTO.getCondition01());
            put("spouseFormData", conditionDTO.getSpouseFormData());
            put("accountData", conditionDTO.getAccountData());
            put("spouseAccountData", conditionDTO.getSpouseAccountData());

            put("familyList", conditionDTO.getFamilyList());
            put("spouseFamilyList", conditionDTO.getSpouseFamilyList());
            put("form3Data", conditionDTO.getCondition03());
        }});
    }

    @PostMapping("/{userId}")
    @Operation(summary = "조건 등록", description = "조건을 등록합니다.")
    public ResponseEntity<String> addCondition(@Valid @RequestBody ConditionDTO conditionDTO, @PathVariable Long userId) {
        // 저장하는 로직 (예: repository 사용)
        cs.saveConditions(conditionDTO, userId);

        return ResponseEntity.ok("등록 성공");
    }

    @PatchMapping("/1/{userId}")
    @Operation(summary = "조건1 수정", description = "조건을 수정합니다.")
    public ResponseEntity<String> updateCondition1(@Valid @RequestBody Condition1UpdateRequest condition1UpdateRequest,
                                                   @PathVariable Long userId) {
        // 저장하는 로직 (예: repository 사용)
        cs.updateCondition1(condition1UpdateRequest.getCondition01DTO(), condition1UpdateRequest.getAccountDTOList(), userId);

        return ResponseEntity.ok("등록 성공");
    }

    @PatchMapping("/2/{userId}")
    @Operation(summary = "조건2 수정", description = "조건을 수정합니다.")
    public ResponseEntity<String> updateCondition2(@Valid @RequestBody List<FamilyDTO> familyDTOList,
                                                   @PathVariable Long userId) {
        // 저장하는 로직 (예: repository 사용)
        cs.updateCondition2(familyDTOList, userId);

        return ResponseEntity.ok("등록 성공");
    }

    @PatchMapping("/3/{userId}")
    @Operation(summary = "조건3 수정", description = "조건을 수정합니다.")
    public ResponseEntity<String> updateCondition3(@Valid @RequestBody Condition03DTO condition03DTO,
                                                   @PathVariable Long userId) {
        // 저장하는 로직 (예: repository 사용)
        cs.updateCondition3(condition03DTO, userId);

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
    public ResponseEntity<?> deleteCondition(@PathVariable Long userId) {

        cs.deleteConditions(userId);

        return ResponseEntity.ok("삭제 성공");
    }

}
