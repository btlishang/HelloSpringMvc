package com.lishang.web.dao;

import com.lishang.web.entity.UserInfo;

import java.util.List;

/**
 * @program: HelloSpringMvc
 * @description:
 * @author: Lishang
 * @create: 2019-02-25 14:42
 **/

public interface UserMapper {

   UserInfo selectUserbyUsername(String username);
}
