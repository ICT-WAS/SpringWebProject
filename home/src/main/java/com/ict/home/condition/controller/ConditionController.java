package com.ict.home.condition.controller;

import com.ict.home.condition.model.*;
import com.ict.home.condition.serivce.ConditionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
