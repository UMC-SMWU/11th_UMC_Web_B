package com.umc.study.repository;

import com.umc.study.dto.RentalCreateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class RentalRepository {

    private final JdbcTemplate jdbcTemplate;

    public void save(RentalCreateRequest request) {
        String sql = """
                INSERT INTO rental (user_id, book_id, rented_at, due_at)
                VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))
                """;

        jdbcTemplate.update(
                sql,
                request.userId(),
                request.bookId()
        );
    }

    public Optional<Long> findActiveBookId(Long rentalId) {
        String sql = """
                SELECT book_id
                FROM rental
                WHERE rental_id = ?
                  AND returned_at IS NULL
                """;

        return jdbcTemplate.query(
                sql,
                resultSet -> {
                    if (resultSet.next()) {
                        return Optional.of(
                                resultSet.getLong("book_id")
                        );
                    }

                    return Optional.empty();
                },
                rentalId
        );
    }

    public boolean existsById(Long rentalId) {
        String sql = """
                SELECT COUNT(*)
                FROM rental
                WHERE rental_id = ?
                """;

        Integer count = jdbcTemplate.queryForObject(
                sql,
                Integer.class,
                rentalId
        );

        return count != null && count > 0;
    }

    public int returnRental(Long rentalId) {
        String sql = """
                UPDATE rental
                SET returned_at = NOW()
                WHERE rental_id = ?
                  AND returned_at IS NULL
                """;

        return jdbcTemplate.update(sql, rentalId);
    }
}