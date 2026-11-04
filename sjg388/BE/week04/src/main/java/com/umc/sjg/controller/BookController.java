package com.umc.sjg.controller;

import com.umc.sjg.dto.BookResponse;
import com.umc.sjg.dto.CreateBookRequest;
import com.umc.sjg.service.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping
    public List<BookResponse> getBooks() {
        return bookService.getAllBooks();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BookResponse createBook(
            @Valid @RequestBody CreateBookRequest request
    ) {
        return bookService.createBook(request);
    }
}