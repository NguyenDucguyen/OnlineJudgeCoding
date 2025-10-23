package com.showtime.onlinejudgecode.controller;

import com.showtime.onlinejudgecode.dto.update.UserUpdate;
import com.showtime.onlinejudgecode.entity.User;
import com.showtime.onlinejudgecode.service.IUserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private  IUserService userService;

    public ResponseEntity<?> getUserById(@PathVariable int id){
        User user = userService.getUserById(id);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    public ResponseEntity<?> updateUser(@PathVariable int id, @RequestBody UserUpdate userUpdate){
        User user = userService.updateUser(id, userUpdate);
        return new ResponseEntity<>(user, HttpStatus.UPGRADE_REQUIRED);
    }
}
