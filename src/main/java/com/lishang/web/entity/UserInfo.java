package com.lishang.web.entity;

import java.io.Serializable;

/**
 * @program: HelloSpringMvc
 * @description: UserInfo实体类
 * @author: Lishang
 * @create: 2019-02-25 14:29
 **/

public class UserInfo implements Serializable {
    private String username; //用户名
    private String password; //密码

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

}
