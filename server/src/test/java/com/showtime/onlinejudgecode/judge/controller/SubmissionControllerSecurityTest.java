package com.showtime.onlinejudgecode.judge.controller;

import com.showtime.onlinejudgecode.auth.configuration.JwtAuthenticationFilter;
import com.showtime.onlinejudgecode.auth.configuration.SecurityConfig;
import com.showtime.onlinejudgecode.auth.configuration.UserDetailsServiceImpl;
import com.showtime.onlinejudgecode.auth.entity.Role;
import com.showtime.onlinejudgecode.auth.entity.User;
import com.showtime.onlinejudgecode.auth.model.CustomUserDetails;
import com.showtime.onlinejudgecode.auth.service.JwtService;
import com.showtime.onlinejudgecode.judge.entity.Submission;
import com.showtime.onlinejudgecode.judge.service.SubmissionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = SubmissionController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, JwtService.class})
@TestPropertySource(properties = {
        "app.jwt.secret=test-secret-key-1234567890-test-secret-key",
        "app.jwt.expiration=3600000"
})
class SubmissionControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @MockBean
    private SubmissionService submissionService;

    @MockBean
    private UserDetailsServiceImpl userDetailsService;

    private CustomUserDetails userDetails;

    @BeforeEach
    void setUp() {
        User user = new User();
        user.setId("user-1");
        user.setEmail("user@example.com");
        user.setPassword("password");
        user.setRole(Role.USER);
        userDetails = new CustomUserDetails(user);
    }

    @Test
    void shouldReturnUnauthorizedWithoutToken() throws Exception {
        mockMvc.perform(get("/api/submissions/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldAllowOwnerWithValidToken() throws Exception {
        Submission submission = new Submission();
        User owner = new User();
        owner.setId("user-1");
        submission.setUser(owner);
        submission.setId(1L);

        given(userDetailsService.loadUserByUsername(anyString())).willReturn(userDetails);
        given(submissionService.getSubmissionById(1L)).willReturn(submission);

        String token = jwtService.generateToken(userDetails);

        mockMvc.perform(get("/api/submissions/1")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void shouldForbidAccessingOtherUsersSubmission() throws Exception {
        Submission submission = new Submission();
        User owner = new User();
        owner.setId("other-user");
        submission.setUser(owner);
        submission.setId(2L);

        given(userDetailsService.loadUserByUsername(anyString())).willReturn(userDetails);
        given(submissionService.getSubmissionById(2L)).willReturn(submission);

        String token = jwtService.generateToken(userDetails);

        mockMvc.perform(get("/api/submissions/2")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }
}
