package com.lishang.web.service;

import com.lishang.web.entity.UserInfo;

/**
 * @program: HelloSpringMvc
 * @description: 登录
 * @author: Lishang
 * @create: 2019-02-25 14:34
 **/

public interface UserService {
    UserInfo login(String username,String password);
}
