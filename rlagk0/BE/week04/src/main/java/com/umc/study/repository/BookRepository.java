package com.umc.study.repository;

import com.umc.study.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findAllByOrderByBookIdDesc();

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