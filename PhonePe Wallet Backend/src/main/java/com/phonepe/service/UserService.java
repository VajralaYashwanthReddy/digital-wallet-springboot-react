package com.phonepe.service;

import com.phonepe.dto.LoginRequest;
import com.phonepe.dto.UserRegistrationRequest;
import com.phonepe.entity.User;
import com.phonepe.entity.Wallet;
import com.phonepe.repository.UserRepository;
import com.phonepe.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final PasswordEncoder passwordEncoder;   // ✅ ADD THIS

    @Transactional
    public User registerUser(UserRegistrationRequest request) {

        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new RuntimeException("Phone number already registered");
        }

        if (userRepository.existsByUpiId(request.getUpiId())) {
            throw new RuntimeException("UPI ID already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setUpiId(request.getUpiId());

        // 🔐 VERY IMPORTANT
        user.setPin(passwordEncoder.encode(request.getPin()));

        User savedUser = userRepository.save(user);

        Wallet wallet = new Wallet();
        wallet.setUser(savedUser);
        wallet.setBalance(BigDecimal.ZERO);
        walletRepository.save(wallet);

        return savedUser;
    }

    public User login(LoginRequest request) {

        User user = userRepository.findByPhoneNumber(request.getPhoneNumber())
                .orElseThrow(() -> new RuntimeException("Invalid phone number or PIN"));

        // 🔐 VERY IMPORTANT
        if (!passwordEncoder.matches(request.getPin(), user.getPin())) {
            throw new RuntimeException("Invalid phone number or PIN");
        }

        return user;
    }

    public User getUserProfile(String upiId) {
        return userRepository.findByUpiId(upiId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
