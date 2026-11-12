package com.umc.movie.util;

import com.umc.movie.exception.ApiException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

@Component
public class JwtUtil {
    private final SecretKey key;
    private final JwtParser parser;
    private final long accessExpiration;

    public JwtUtil(@Value("${spring.jwt.secret}") String secret,
                   @Value("${spring.jwt.access-expiration}") long accessExpiration) {
        if (accessExpiration <= 0) {
            throw new IllegalArgumentException("JWT 유효시간은 양수여야 합니다.");
        }
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.parser = Jwts.parser().verifyWith(key).build();
        this.accessExpiration = accessExpiration;
    }

    public String issueAccessToken(Long memberId) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(memberId.toString())
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(accessExpiration)))
                .signWith(key)
                .compact();
    }

    public Long getMemberId(String token) {
        try {
            var claims = parser.parseSignedClaims(token).getPayload();
            long memberId = Long.parseLong(claims.getSubject());
            if (claims.getExpiration() == null || memberId <= 0) {
                throw new IllegalArgumentException("필수 JWT 클레임이 누락되었거나 유효하지 않습니다.");
            }
            return memberId;
        } catch (JwtException | IllegalArgumentException exception) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "AUTH401_2",
                    "유효하지 않거나 만료된 토큰입니다.");
        }
    }
}
