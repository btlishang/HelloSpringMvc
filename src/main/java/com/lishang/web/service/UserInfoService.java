package com.lishang.web.service;

import com.lishang.web.entity.UserInfo;

import java.util.List;

/**
 * @program: HelloSpringMvc
 * @description:
 * @author: Lishang
 * @create: 2019-02-26 17:32
 **/

public interface UserInfoService {
    public List<UserInfo> selectAll();
}
