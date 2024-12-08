package com.ict.home.house.controller;

import com.ict.home.house.model.House;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;

@RestController
@RequestMapping("/house")
public class HouseController {

    @GetMapping("")
    @Operation(summary = "공고 목록 조회", description = "공고를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "공고 조회 성공",
                    content = @Content(schema = @Schema(implementation = House.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "리소스를 찾을 수 없음")
    })
    public ResponseEntity<?> getHouseList() {

        return ResponseEntity.ok(new ArrayList<House>());
    }

}
