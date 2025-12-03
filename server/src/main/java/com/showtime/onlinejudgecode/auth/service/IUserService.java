package com.showtime.onlinejudgecode.auth.service;

import com.showtime.onlinejudgecode.auth.dto.update.UserUpdate;
import com.showtime.onlinejudgecode.auth.entity.User;

public interface IUserService {
     User getUserById(String id);

     User updateUser(String id, UserUpdate userUpdate);
}
