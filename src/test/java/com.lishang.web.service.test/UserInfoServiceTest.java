package com.lishang.web.service.test;

import com.lishang.web.entity.UserInfo;
import com.lishang.web.service.UserInfoService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;

/**
 * @program: HelloSpringMvc
 * @description: 测试
 * @author: Lishang
 * @create: 2019-02-26 17:29
 **/
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({"classpath:/dev/spring-context.xml","classpath:/dev/spring-context-druid.xml","classpath:/dev/spring-context-mybatis.xml"})
public class UserInfoServiceTest {
    @Autowired
    private UserInfoService userInfoService;

    @Test
    public void testSelectAll(){
        List<UserInfo> userInfos = userInfoService.selectAll();
        for (UserInfo userInfo : userInfos) {
            System.out.println(userInfo.getUsername());
            
        }
    }
}
