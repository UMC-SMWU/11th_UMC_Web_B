package com.umc.study.repository;

import com.umc.study.entity.Book;
import com.umc.study.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long>{

}