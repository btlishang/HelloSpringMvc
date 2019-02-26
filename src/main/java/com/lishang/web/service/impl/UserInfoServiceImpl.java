package com.lishang.web.service.impl;

import com.lishang.web.dao.UserInfoMapper;
import com.lishang.web.entity.UserInfo;
import com.lishang.web.service.UserInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @program: HelloSpringMvc
 * @description:
 * @author: Lishang
 * @create: 2019-02-26 17:42
 **/
@Service
public class UserInfoServiceImpl implements UserInfoService {
    @Autowired
    private UserInfoMapper userInfoMapper;
    @Override
    public List<UserInfo> selectAll() {
        return userInfoMapper.selectAll();
    }
}
