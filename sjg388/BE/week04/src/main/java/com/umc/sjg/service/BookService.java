package com.umc.sjg.service;

import com.umc.sjg.domain.Book;
import com.umc.sjg.domain.Category;
import com.umc.sjg.dto.BookResponse;
import com.umc.sjg.dto.CreateBookRequest;
import com.umc.sjg.repository.BookRepository;
import com.umc.sjg.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<BookResponse> getAllBooks() {
        return bookRepository.findAllByOrderByBookIdDesc()
                .stream()
                .map(BookResponse::from)
                .toList();
    }

    @Transactional
    public BookResponse createBook(CreateBookRequest request) {

        Category category = categoryRepository
                .findById(request.categoryId())
                .orElseThrow(
                        () -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "존재하지 않는 카테고리입니다."
                        )
                );

        Book book = new Book(
                category,
                request.title(),
                request.description()
        );

        Book savedBook = bookRepository.save(book);

        return BookResponse.from(savedBook);
    }
}