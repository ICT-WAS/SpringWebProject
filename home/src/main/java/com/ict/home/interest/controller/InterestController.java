package com.ict.home.interest.controller;

import com.ict.home.house.dto.HouseInfo;
import com.ict.home.house.model.House;
import com.ict.home.house.service.HouseService;
import com.ict.home.interest.dto.InterestRequest;
import com.ict.home.interest.model.Interest;
import com.ict.home.interest.service.InterestService;
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
@RequestMapping("/interest")
@RequiredArgsConstructor
public class InterestController {

    private final InterestService is;

    private final HouseService hs;

    @GetMapping("/check/{userId}/{houseId}")
    @Operation(summary = "중복 조회", description = "이미 관심 등록을 한 공고인지 확인합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "관심 공고 조회 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "리소스를 찾을 수 없음")
    })
    public ResponseEntity<?> readInterest(@PathVariable Long userId, @PathVariable Long houseId){
        Long interestId = is.getInterestIdByUserAndHouse(userId, houseId);
        if (userId == null) {
            interestId = null;
        }

        return ResponseEntity.ok(interestId);
    }

    @GetMapping("/{userId}")
    @Operation(summary = "관심 공고 조회", description = "관심 공고를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "관심 공고 조회 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "리소스를 찾을 수 없음")
    })
    public ResponseEntity<?> readInterest(@PathVariable Long userId){
        List<Interest> interests = is.readInterest(userId);
        List<House> houses = new ArrayList<>();

        for (Interest interest : interests) {
            houses.add(interest.getHouse());
        }

        List<HouseInfo> houseInfoByInterest = hs.getHouseInfoByInterest(houses);

        return ResponseEntity.ok(houseInfoByInterest);
    }

    @PostMapping("")
    @Operation(summary = "관심 공고를 등록", description = "관심 공고를 등록합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "관심 공고 등록 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "리소스를 찾을 수 없음")
    })
    public ResponseEntity<?> createInterest(@RequestBody InterestRequest interestRequest){
        Long userId = interestRequest.getUserId();
        Long houseId = interestRequest.getHouseId();

        Interest interest = is.createInterest(userId, houseId);

        if (interest == null) {
            return ResponseEntity.ok(null);
        } else {
            return ResponseEntity.ok(interest.getInterestId());
        }
    }

    @DeleteMapping("/{interestId}")
    @Operation(summary = "관심 공고 삭제", description = "관심 공고를 삭제합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "관심 공고 삭제 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "리소스를 찾을 수 없음")
    })
    public ResponseEntity<?> deleteInterest(@PathVariable Long interestId) {

        boolean isDeleted = is.deleteInterest(interestId);
        String data = isDeleted ? "삭제되었습니다." : null;

        return ResponseEntity.ok(data);
    }

}
