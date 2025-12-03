package com.showtime.onlinejudgecode.auth.service.impl;

import com.showtime.onlinejudgecode.auth.dto.update.UserUpdate;
import com.showtime.onlinejudgecode.auth.entity.User;
import com.showtime.onlinejudgecode.auth.repository.UserRepository;
import com.showtime.onlinejudgecode.auth.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService implements IUserService {

    @Autowired
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    @Override
    public User getUserById(String id) {
        return userRepository.findById(id);
    }

    @Override
    public User updateUser(String id, UserUpdate userUpdate){
        User user = getUserById(id);
        if(userUpdate.getUsername() != null){
            user.setUsername(userUpdate.getUsername());
        }
        if(userUpdate.getAvatar() != null){
            user.setAvatar(userUpdate.getAvatar());
        }
        if(userUpdate.getEmail() != null){
            user.setEmail(userUpdate.getEmail());
        }
        return userRepository.save(user);

    }


}