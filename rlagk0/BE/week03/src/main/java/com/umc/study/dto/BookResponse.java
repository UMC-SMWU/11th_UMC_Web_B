package com.umc.study.dto;

public record BookResponse(
        Long bookId,
        Long categoryId,
        String title,
        String description,
        boolean isAvailable
) {
}