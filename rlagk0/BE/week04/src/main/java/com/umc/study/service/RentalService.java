package com.umc.study.service;

import com.umc.study.dto.RentalCreateRequest;
import com.umc.study.exception.ConflictException;
import com.umc.study.exception.ResourceNotFoundException;
import com.umc.study.repository.BookRepository;
import com.umc.study.repository.RentalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RentalService {

    private final RentalRepository rentalRepository;
    private final BookRepository bookRepository;

    @Transactional
    public void createRental(RentalCreateRequest request) {
        int updated = bookRepository.markUnavailable(
                request.bookId()
        );

        if (updated == 0) {
            throw new ConflictException(
                    "존재하지 않거나 이미 대여 중인 도서입니다."
            );
        }

        rentalRepository.save(request);
    }

    @Transactional
    public void returnRental(Long rentalId) {
        Long bookId = rentalRepository
                .findActiveBookId(rentalId)
                .orElseGet(() -> {
                    if (rentalRepository.existsById(rentalId)) {
                        throw new ConflictException(
                                "이미 반납된 대여 기록입니다."
                        );
                    }

                    throw new ResourceNotFoundException(
                            "대여 기록을 찾을 수 없습니다."
                    );
                });

        int updated = rentalRepository.returnRental(rentalId);

        if (updated == 0) {
            throw new ConflictException(
                    "이미 반납된 대여 기록입니다."
            );
        }

        bookRepository.markAvailable(bookId);
    }
}