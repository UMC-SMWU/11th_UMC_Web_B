package com.umc.study.repository;

import com.umc.study.entity.Book;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {
    // category를 함께 조회해서 N+1 문제를 막아요.
    @EntityGraph(attributePaths = "category")
    List<Book> findAllByOrderByBookIdDesc();

    // 선택 미션 2: 제목 검색
    @EntityGraph(attributePaths = "category")
    List<Book> findByTitleContainingOrderByBookIdDesc(String keyword);

    // 선택 미션 3: 같은 제목의 도서가 있는지 확인
    boolean existsByTitle(String title);

    @Modifying
    @Query("""
        update Book b
        set b.isAvailable = false
        where b.bookId = :bookId
          and b.isAvailable = true
    """)
    int markUnavailable(@Param("bookId") Long bookId);

    @Modifying
    @Query("""
        update Book b
        set b.isAvailable = true
        where b.bookId = :bookId
    """)
    int markAvailable(@Param("bookId") Long bookId);
}