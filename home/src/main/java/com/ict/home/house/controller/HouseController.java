package com.ict.home.house.controller;

import com.ict.home.house.dto.HouseInfo;
import com.ict.home.house.service.HouseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/house")
@RequiredArgsConstructor
public class HouseController {

    private final HouseService hs;

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
                                          @RequestParam(required = false) List<String> statuses,
                                          @RequestParam(required = false) Long userId,
                                          @RequestParam(required = false) String orderBy,
                                          @RequestParam(defaultValue = "0") int page,
                                          @RequestParam(defaultValue = "10") int size) {
        List<HouseInfo> houseInfoListByFilter = hs.getHouseInfoListByFilter(regions, houseTypes, area, prices, supplies, statuses, userId, orderBy);

        if (houseInfoListByFilter.isEmpty() || houseInfoListByFilter.size() < 10) {
            HashMap<String, Object> stringObjectHashMap = new HashMap<>();
            stringObjectHashMap.put("totalCount", houseInfoListByFilter.size());
            stringObjectHashMap.put("houseInfoList", houseInfoListByFilter);
            return ResponseEntity.ok(stringObjectHashMap);
        }

        int fromIndex = page * size;
        int toIndex = Math.min(fromIndex + size, houseInfoListByFilter.size());
        List<HouseInfo> paginatedList = houseInfoListByFilter.subList(fromIndex, toIndex);

        return ResponseEntity.ok(new HashMap<String, Object>() {{
            put("totalCount", houseInfoListByFilter.size());
            put("houseInfoList", paginatedList);
        }});
    }

    @GetMapping("/keyword")
    @Operation(summary = "공고 목록 이름 검색", description = "공고를 이름으로 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "공고 조회 성공",
                    content = @Content(schema = @Schema(implementation = HouseInfo.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "리소스를 찾을 수 없음")
    })
    public ResponseEntity<?> getHouseListByKeyword(@RequestParam String keyword,
                                                   @RequestParam(defaultValue = "0") int page,
                                                   @RequestParam(defaultValue = "10") int size){
        List<HouseInfo> houseInfoList = hs.getHouseInfoListByName(keyword);

        if (houseInfoList.isEmpty() || houseInfoList.size() < 10) {
            HashMap<String, Object> stringObjectHashMap = new HashMap<>();
            stringObjectHashMap.put("totalCount", houseInfoList.size());
            stringObjectHashMap.put("houseInfoList", houseInfoList);
            return ResponseEntity.ok(stringObjectHashMap);
        }

        int fromIndex = page * size;
        int toIndex = Math.min(fromIndex + size, houseInfoList.size());
        List<HouseInfo> paginatedList = houseInfoList.subList(fromIndex, toIndex);

        return ResponseEntity.ok(new HashMap<String, Object>() {{
            put("totalCount", houseInfoList.size());
            put("houseInfoList", paginatedList);
        }});
    }
}