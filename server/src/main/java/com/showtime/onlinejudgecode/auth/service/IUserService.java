package com.showtime.onlinejudgecode.auth.service;

import com.showtime.onlinejudgecode.auth.dto.update.UserUpdate;
import com.showtime.onlinejudgecode.auth.entity.User;
import org.springframework.data.crossstore.ChangeSetPersister;

public interface IUserService {
     User getUserById(String id) throws ChangeSetPersister.NotFoundException;

     User updateUser(String id, UserUpdate userUpdate) throws ChangeSetPersister.NotFoundException;
}
