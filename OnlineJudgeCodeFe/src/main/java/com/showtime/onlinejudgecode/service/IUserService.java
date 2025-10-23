package com.showtime.onlinejudgecode.service;

import com.showtime.onlinejudgecode.dto.UserDto;
import com.showtime.onlinejudgecode.dto.update.UserUpdate;
import com.showtime.onlinejudgecode.entity.User;

public interface IUserService {
     User getUserById(int id);

     User updateUser(int id, UserUpdate userUpdate);
}
