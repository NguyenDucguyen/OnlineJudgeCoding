package com.showtime.onlinejudgecode.service.impl;


import com.showtime.onlinejudgecode.dto.update.UserUpdate;
import com.showtime.onlinejudgecode.entity.User;
import com.showtime.onlinejudgecode.repository.UserRepository;
import com.showtime.onlinejudgecode.service.IUserService;
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
    public User getUserById(int id) {
        return userRepository.findById(id);
    }

    @Override
    public User updateUser(int id, UserUpdate userUpdate){
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
