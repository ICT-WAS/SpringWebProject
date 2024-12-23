package com.ict.home.house.controller;

import com.ict.home.house.dto.HouseDetailDTO;
import com.ict.home.house.dto.HouseInfo;
import com.ict.home.house.service.HouseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/house")
@RequiredArgsConstructor
public class HouseController {

    @Value("${api.key.id}")
    private String apiKeyId;

    @Value("${api.key.secret}")
    private String apiKeySecret;

    private final HouseService hs;

    @GetMapping("/{houseId}")
    @Operation(summary = "공고 상세 정보 조회", description = "공고의 상세 정보를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "공고의 상세 정보를 조회합니다.",
                    content = @Content(schema = @Schema(implementation = HouseDetailDTO.class)))
    })
    public ResponseEntity<?> getHouseDetail(@PathVariable Long houseId) {
        HouseDetailDTO houseDetail = hs.getHouseDetail(houseId);

        return ResponseEntity.ok(houseDetail);
    }

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

        if (houseInfoListByFilter.isEmpty() || houseInfoListByFilter.size() < size) {
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

        if (houseInfoList.isEmpty() || houseInfoList.size() < size) {
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

    @GetMapping("/solution/{houseId}/{userId}/{type}")
    @Operation(summary = "공고별 공급방식별 맞춤형 솔루션", description = "원하는 공고의 원하는 공급방식의 지원가능 여부와 개선점을 알 수 있습니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "솔루션 조회 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "리소스를 찾을 수 없음")
    })
    public ResponseEntity<?> getSolution(@PathVariable Long houseId,
                                         @PathVariable Long userId,
                                         @PathVariable String type) {
        System.out.println("houseId = " + houseId);
        System.out.println("userId = " + userId);
        System.out.println("type = " + type);

        Map<String, List<String>> solution = hs.getSolution(houseId, userId, type);

        return ResponseEntity.ok(solution);
    }

    @GetMapping("/api/geocode")
    @SuppressWarnings("unchecked")
    public ResponseEntity<?> getGeocode(@RequestParam String query) {
        String url = "https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=" + query;

        RestTemplate restTemplate = new RestTemplate();
        var headers = new org.springframework.http.HttpHeaders();
        headers.set("x-ncp-apigw-api-key-id", apiKeyId);
        headers.set("x-ncp-apigw-api-key", apiKeySecret);

        var entity = new org.springframework.http.HttpEntity<>(headers);

        var response = restTemplate.exchange(
                url, org.springframework.http.HttpMethod.GET, entity, Map.class);

        Map<String, Object> responseBody = response.getBody();
        if (responseBody != null) {
            // "addresses" 배열 가져오기
            List<Map<String, Object>> addresses = (List<Map<String, Object>>) responseBody.get("addresses");

            if (addresses != null && !addresses.isEmpty()) {
                // 첫 번째 주소에서 "x" 값 가져오기
                String x = (String) addresses.get(0).get("x");
                String y = (String) addresses.get(0).get("y");

                return ResponseEntity.ok(new HashMap<String, Object>() {{
                    put("x", x);
                    put("y", y);
                }});
            }
        }
        return null;
    }
}