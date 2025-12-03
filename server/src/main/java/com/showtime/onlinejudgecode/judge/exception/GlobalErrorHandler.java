//package com.showtime.onlinejudgecode.judge.exception;
//
//import io.jsonwebtoken.io.DecodingException;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.ExceptionHandler;
//import org.springframework.web.bind.annotation.RestControllerAdvice;
//import org.springframework.web.bind.support.WebExchangeBindException;
//
//import java.util.Map;
//import java.util.stream.Collectors;
//
//@RestControllerAdvice
//public class GlobalErrorHandler {
//
//    @ExceptionHandler(WebExchangeBindException.class)
//    public ResponseEntity<Map<String, Object>> handleBind(WebExchangeBindException ex) {
//        var errors = ex.getFieldErrors().stream()
//                .collect(Collectors.toMap(FieldError::getField, DefaultMessageSourceResolvable::getDefaultMessage, (a, b)->a));
//        return ResponseEntity.badRequest().body(Map.of(
//                "error", "validation_failed",
//                "details", errors
//        ));
//    }
//
//    @ExceptionHandler(DecodingException.class)
//    public ResponseEntity<Map<String, Object>> handleDecode(DecodingException ex) {
//        return ResponseEntity.badRequest().body(Map.of("error", "invalid_json", "message", ex.getMessage()));
//    }
//}
