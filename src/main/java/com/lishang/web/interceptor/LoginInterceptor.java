package com.lishang.web.interceptor;

import com.lishang.web.common.ConstantUtils;
import com.lishang.web.entity.UserInfo;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

/**
 * @program: HelloSpringMvc
 * @description: 登录拦截器
 * @author: Lishang
 * @create: 2019-02-25 16:36
 **/

public class LoginInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(javax.servlet.http.HttpServletRequest httpServletRequest, javax.servlet.http.HttpServletResponse httpServletResponse, Object o) throws Exception {
        UserInfo userInfo =(UserInfo) httpServletRequest.getSession().getAttribute(ConstantUtils.SESSION_USER);

        // 未登录重定向到登录页
        if (userInfo == null){
            httpServletResponse.sendRedirect("/login");
            return false;
        }

        // 放行
        return true;
    }

    @Override
    public void postHandle(javax.servlet.http.HttpServletRequest httpServletRequest, javax.servlet.http.HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView) throws Exception {

    }

    @Override
    public void afterCompletion(javax.servlet.http.HttpServletRequest httpServletRequest, javax.servlet.http.HttpServletResponse httpServletResponse, Object o, Exception e) throws Exception {

    }
}
