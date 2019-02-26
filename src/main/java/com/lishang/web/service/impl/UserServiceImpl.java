package com.lishang.web.service.impl;

import com.lishang.web.dao.UserMapper;
import com.lishang.web.entity.UserInfo;
import com.lishang.web.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

/**
 * @program: HelloSpringMvc
 * @description:
 * @author: Lishang
 * @create: 2019-02-25 14:37
 **/
@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserMapper userMapper;

    @Override
    public UserInfo login(String username, String password) {
        UserInfo userInfo = userMapper.selectUserbyUsername(username);
        if (userInfo != null){
            // 明文密码加密
            String md5Password = DigestUtils.md5DigestAsHex(password.getBytes());
            // 加密后的密码和数据库中的密码进行比对，匹配则允许登录
            if (md5Password.equals(userInfo.getPassword())){
                return userInfo;
            }
        }
        return null;
    }
}
