package com.umc.study.controller;

import com.umc.study.dto.RentalCreateRequest;
import com.umc.study.service.RentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    @PostMapping
    public ResponseEntity<String> createRental(
            @RequestBody RentalCreateRequest request
    ) {
        rentalService.createRental(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("도서 대여가 완료되었습니다!");
    }

    @PatchMapping("/{rentalId}/return")
    public ResponseEntity<String> returnRental(
            @PathVariable Long rentalId
    ) {
        rentalService.returnRental(rentalId);

        return ResponseEntity.ok(
                "도서 반납이 완료되었습니다!"
        );
    }
}