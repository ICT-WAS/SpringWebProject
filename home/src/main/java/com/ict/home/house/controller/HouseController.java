package com.ict.home.house.controller;

import com.ict.home.house.dto.HouseInfo;
import com.ict.home.house.model.House;
import com.ict.home.house.service.HouseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/house")
@RequiredArgsConstructor
public class HouseController {

    private final HouseService houseService;

    @GetMapping("")
    @Operation(summary = "공고 목록 조회", description = "공고를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "공고 조회 성공",
                    content = @Content(schema = @Schema(implementation = HouseInfo.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "리소스를 찾을 수 없음")
    })
    public ResponseEntity<?> getHouseList(@RequestParam(required = false) List<String> regions,
                                          @RequestParam(required = false) List<String> houseTypes,
                                          @RequestParam(required = false) List<String> area,
                                          @RequestParam(required = false) List<Integer> prices,
                                          @RequestParam(required = false) List<String> supplies,
                                          @RequestParam(required = false) List<String> status,
                                          @RequestParam(required = false) Long userCondition,
                                          @RequestParam(required = false) String orderBy) {
        List<HouseInfo> houseInfoList = houseService.getHouseInfoList();

        if(regions!=null){
            houseInfoList = houseService.filterByRegions(houseInfoList, regions);
        }

        if (houseTypes != null) {

        }

        if (area != null) {

        }

        if (prices != null) {

        }

        if (supplies != null) {

        }

        if (status != null) {

        }

        List<HouseInfo> finalHouseInfoList = houseInfoList;
        return ResponseEntity.ok(new HashMap<String, Object>(){{
            put("totalCount", finalHouseInfoList.size());
            put("houseInfoList", finalHouseInfoList);
                                 }});
    }




}
