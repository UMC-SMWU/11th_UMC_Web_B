package com.umc.study.dto;

public record BookCreateRequest(
        Long categoryId,
        String title,
        String description
) {
}