package com.showtime.onlinejudgecode.judge.service;

import com.showtime.onlinejudgecode.judge.dto.request.ContestRegistrationRequest;
import com.showtime.onlinejudgecode.judge.dto.request.ContestRequest;
import com.showtime.onlinejudgecode.judge.entity.Contest;
import com.showtime.onlinejudgecode.judge.entity.ContestRegistration;

import java.util.List;

public interface IContestService {
    List<Contest> getAllContests();
    Contest getContestById(Long id);
    Contest createContest(ContestRequest request);
    Contest updateContest(Long id, ContestRequest request);
    void deleteContest(Long id);
    ContestRegistration registerForContest(Long contestId, ContestRegistrationRequest request);
    List<ContestRegistration> getRegistrations(Long contestId);
}
