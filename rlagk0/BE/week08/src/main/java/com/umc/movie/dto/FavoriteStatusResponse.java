package com.umc.movie.dto;

// 즐겨찾기하지 않은 것도 정상 상태이므로 오류 대신 false를 돌려줍니다.
public record FavoriteStatusResponse(
        boolean isFavorite
) {
}
