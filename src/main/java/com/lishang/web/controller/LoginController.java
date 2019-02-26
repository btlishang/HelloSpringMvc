package com.lishang.web.controller;

import com.lishang.web.common.ConstantUtils;
import com.lishang.web.entity.UserInfo;
import com.lishang.web.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;

/**
 * @program: HelloSpringMvc
 * @description: 登录、首页
 * @author: Lishang
 * @create: 2019-02-25 11:04
 **/
@Controller
public class LoginController {

    @Autowired
    private UserService userService;

    @RequestMapping(value = {"", "login"}, method = RequestMethod.GET)
    public String login(){
        return "login";
    }

    @RequestMapping(value = "login", method = RequestMethod.POST)
    public String login(@RequestParam(required = true) String username, @RequestParam(required = true) String password, Model model, HttpServletRequest httpServletRequest){
        UserInfo userInfo = userService.login(username, password);

        // 登录失败
        if (userInfo != null){
            model.addAttribute("message","用户名或密码错误，请重新输入");
            return login();
        }
        // 登录成功
        else {
            httpServletRequest.getSession().setAttribute(ConstantUtils.SESSION_USER,userInfo);
        }
        return null;
    }
}
