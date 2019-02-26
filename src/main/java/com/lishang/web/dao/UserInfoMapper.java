package com.lishang.web.dao;

import com.lishang.web.entity.UserInfo;

import java.util.List;

/**
 * @program: HelloSpringMvc
 * @description:
 * @author: Lishang
 * @create: 2019-02-26 17:35
 **/

public interface UserInfoMapper {
    public List<UserInfo> selectAll();
}
